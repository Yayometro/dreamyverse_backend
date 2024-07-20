"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
require("dotenv/config");
const server_1 = __importDefault(require("./server"));
const dbConnection_1 = require("./dbConnection");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const mapUsersIdSocket_1 = __importDefault(require("./helpers/mapUsersIdSocket"));
// SERVER HTTP
const server = http_1.default.createServer(server_1.default);
const { FRONT_URI } = process.env;
console.log("FRONT_URI", FRONT_URI);
const io = new socket_io_1.Server(server, {
    cors: {
        // origin: FRONT_URI || "*", // Ajusta el origen según tus necesidades
        origin: "*", // Ajusta el origen según tus necesidades
        methods: ["GET", "POST"],
    },
});
exports.io = io;
//Middleware:
// io.use((socket, next) => {
//     // Autenticación aquí (ejemplo: usando token JWT)
//     next();
// });
io.on("connection", socket => {
    console.log("A user connected", socket.id);
    // Handdling identifications event with user
    socket.on("identify", (userId) => {
        mapUsersIdSocket_1.default[userId] = socket.id;
        console.log(`User ${userId} is associated with socket ${socket.id}`);
        console.log("mapUsersSocket", mapUsersIdSocket_1.default);
    });
    socket.on("disconnect", () => {
        let userIdToDelete = null;
        // Find the userId associated with the disconnecting socket.id
        for (const userId in mapUsersIdSocket_1.default) {
            if (mapUsersIdSocket_1.default[userId] === socket.id) {
                userIdToDelete = userId;
                break;
            }
        }
        // If found, delete the entry from mapUsersSocket
        if (userIdToDelete) {
            delete mapUsersIdSocket_1.default[userIdToDelete];
            console.log(`User ${userIdToDelete} disconnected`);
        }
    });
});
server.listen(server_1.default.get("port"), () => {
    console.log(`Server running on port http://localhost:${server_1.default.get("port")}`);
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, dbConnection_1.connectDB)();
        // const port = app.get("port");
        // app.listen(port, () => {
        //   console.log(`Server running on port http://localhost:${port}`);
        // });
    }
    catch (e) {
        console.error("Failed to connect to the database:", e);
        process.exit(1); // Out id DB fails
    }
});
startServer();
console.log("mapUsersSocket", mapUsersIdSocket_1.default);
