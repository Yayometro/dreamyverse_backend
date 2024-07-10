import mongoose from "mongoose";

const {DB_URI} = process.env

export const connectionString = DB_URI;

export const connectDB = async () => {
    try{
        if(!connectionString){
            throw new Error('Database URI is undefined. Please check your environment settings.');
        }
        const data = await mongoose.connect(connectionString);
        console.log("Connected to databased in mongoose")
        return data
    } catch(e: unknown){
        if (e instanceof Error) {
            console.error(e.message);
            throw new Error(e.message);
        } else {
            console.error(e);
            throw new Error('An unexpected error has occurred trying to access database, please try again later.');
            // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
        }
    }
}