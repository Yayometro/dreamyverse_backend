
import 'dotenv/config';
import app from "./server";
import { connectDB } from "./dbConnection";
import http from "http";
import { Server } from "socket.io";
import mapUsersSocket from './helpers/mapUsersIdSocket';

// SERVER HTTP
const server = http.createServer(app);


const { FRONT_URI } = process.env;

console.log("FRONT_URI", FRONT_URI)

const io = new Server(server, {
  cors: {
    // origin: FRONT_URI || "*", // Ajusta el origen según tus necesidades
    origin: "*", // Ajusta el origen según tus necesidades
    methods: ["GET", "POST"],
  },
});

//Middleware:
// io.use((socket, next) => {
//     // Autenticación aquí (ejemplo: usando token JWT)
//     next();
// });



io.on("connection", socket => {
  console.log("A user connected", socket.id);

  // Handdling identifications event with user
  socket.on("identify", (userId) => {
    mapUsersSocket[userId] = socket.id as string
    console.log(`User ${userId} is associated with socket ${socket.id}`);
    console.log("mapUsersSocket", mapUsersSocket)
  });

  socket.on("disconnect", () => {
    let userIdToDelete = null;
    
    // Find the userId associated with the disconnecting socket.id
    for (const userId in mapUsersSocket) {
      if (mapUsersSocket[userId] === socket.id) {
        userIdToDelete = userId;
        break;
      }
    }
    
    // If found, delete the entry from mapUsersSocket
    if (userIdToDelete) {
      delete mapUsersSocket[userIdToDelete];
      console.log(`User ${userIdToDelete} disconnected`);
    }
  });
});

server.listen(app.get("port"), () => {
  console.log(`Server running on port http://localhost:${app.get("port")}`);
});


const startServer = async () => {
  try {
    await connectDB(); 
    // const port = app.get("port");
    // app.listen(port, () => {
    //   console.log(`Server running on port http://localhost:${port}`);
    // });
  } catch (e) {
    console.error("Failed to connect to the database:", e);
    process.exit(1); // Out id DB fails
  }
};

startServer();

console.log("mapUsersSocket", mapUsersSocket)

export { io };
