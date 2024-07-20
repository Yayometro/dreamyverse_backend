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
exports.connectDB = exports.connectionString = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { DB_URI } = process.env;
exports.connectionString = DB_URI;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!exports.connectionString) {
            throw new Error('Database URI is undefined. Please check your environment settings.');
        }
        const data = yield mongoose_1.default.connect(exports.connectionString);
        console.log("Connected to databased in mongoose");
        return data;
    }
    catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
            throw new Error(e.message);
        }
        else {
            console.error(e);
            throw new Error('An unexpected error has occurred trying to access database, please try again later.');
            // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
        }
    }
});
exports.connectDB = connectDB;
