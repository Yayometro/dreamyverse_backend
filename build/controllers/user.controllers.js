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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const Message_1 = __importDefault(require("../models/Message"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
//Const
const userCtrl = {
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //
        try {
            const { mail, password } = req.body;
            console.log(req.body);
            const findUser = yield User_1.default.findOne({ mail });
            console.log(findUser);
            if (!findUser) {
                return res.status(401).send({
                    ok: false,
                    message: "Unidentified user. Check the email entered and try again ❌",
                });
            }
            //Password match
            let passwordMatch;
            if (findUser) {
                passwordMatch = yield bcryptjs_1.default.compare(password, findUser.password);
                console.log("passwordMatch:", passwordMatch);
                if (!passwordMatch) {
                    return res.status(401).send({
                        ok: false,
                        message: "Password don't match, please review it and try again ❌",
                    });
                    // throw new Error("Password don't match, please review it and try again ❌")
                }
                findUser.password = "";
            }
            //Password error
            //Send to FRONT
            return res.status(201).send({
                data: findUser,
                message: "User found correctly 😎",
                ok: true,
            });
        }
        catch (e) {
            console.log(e);
            return res.status(500).send({
                message: "An unexpected error has occurred, please try again later.",
            });
        }
    }),
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username, mail, password, name, lastName, phone, avatar, zodiac, } = req.body;
            console.log(req.body);
            //User or mail copy check
            const mailInUse = yield User_1.default.findOne({ mail });
            if (mailInUse) {
                console.log("Correo en uso");
                return res.status(401).send({
                    message: "This user's email is already in use. Check the email entered and try a new one 🚨",
                });
            }
            const usernameInUse = yield User_1.default.findOne({ username });
            if (usernameInUse) {
                console.log("usernameInUse: ", usernameInUse);
                return res.status(401).send({
                    message: "The username is already in use. Check the username entered and try again 🚨",
                });
            }
            // Encrypt
            const salt = yield bcryptjs_1.default.genSalt(10);
            const encryptPassword = yield bcryptjs_1.default.hash(password, salt);
            // CREATION
            const phoneParsed = Number(phone);
            const newUser = new User_1.default({
                username,
                mail,
                name: name || null,
                lastName: lastName || null,
                phone: phoneParsed || null,
                avatar: avatar || null,
                zodiac: zodiac || null,
            });
            newUser.password = encryptPassword;
            //FIND FEEDBACK USER
            const findFeedbackTeam = yield User_1.default.findById("663050351d4cd21299492e1d");
            if (!findFeedbackTeam)
                throw new Error("No Feedback user team founded");
            console.log(findFeedbackTeam);
            // Creation of other instances
            const newConversation = new Conversation_1.default({
                participants: [newUser._id, findFeedbackTeam._id],
            });
            const messageWelcome = new Message_1.default({
                fromUser: findFeedbackTeam._id,
                receiverUser: newUser._id,
                content: {
                    message: "Welcome to DreamyVerse from the Team. We hope you enjoy your experience here and any feedback you want to add, please let us here ☺️",
                },
            });
            // Associations:
            messageWelcome.conversation = newConversation._id;
            //Savings:
            const savedUser = yield newUser.save();
            if (!savedUser) {
                throw new Error("No user was saved creating a NEW USER ❌");
            }
            const savedConversation = yield newConversation.save();
            if (!savedConversation) {
                throw new Error("No savedConversation was saved creating a NEW USER ❌");
            }
            const savedMessageWelcome = yield messageWelcome.save();
            if (!savedMessageWelcome) {
                throw new Error("No savedMessageWelcome was saved creating a NEW USER ❌");
            }
            //Send to FRONT
            return res.status(201).send({
                data: {
                    user: savedUser,
                },
                message: "User created correctly 👌",
                ok: true,
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                throw new Error(e.message);
            }
            else {
                console.error(e);
                return res.status(500).send({
                    message: "An unexpected error has occurred trying to access database, please try again later.",
                });
                // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
            }
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userEdited = req.body;
            console.log(req.body);
            console.log({ userEdited: userEdited });
            if (!userEdited) {
                return res
                    .status(401)
                    .send("User obj must be introduced, please review the body of your request");
            }
            if (!userEdited._id) {
                return res
                    .status(401)
                    .send("User ID must be introduced, please review and try again");
            }
            if (!userEdited.username) {
                return res
                    .status(401)
                    .send("User username be introduced, please review and try again");
            }
            if (!userEdited.mail) {
                return res
                    .status(401)
                    .send("User mail be introduced, please review and try again");
            }
            if (typeof userEdited !== "object") {
                return res
                    .status(401)
                    .send("Revisa que el tipo de datos introducidos en 'phone' sean numerico.");
            }
            //User or mail copy check
            const userUpdated = yield User_1.default.findByIdAndUpdate(userEdited._id, { $set: userEdited }, { new: true });
            if (!userUpdated) {
                return res.status(401).send({
                    message: "The user could not be found. Check the email entered and try a new one 🚨",
                    error: userUpdated,
                    ok: false,
                });
            }
            return res.status(201).send({
                data: userUpdated,
                message: "User updated correctly 👌",
                ok: true,
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                throw new Error(e.message);
            }
            else {
                console.error(e);
                return res.status(500).send({
                    message: "An unexpected error has occurred, please try again later.",
                });
                // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
            }
        }
    }),
    getUserPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //
        try {
            const { mail } = req.body;
            console.log(req.body);
            console.log(mail);
            if (!mail) {
                return res.status(401).send({
                    status: 401,
                    ok: false,
                    message: "mail as req.body is null or undefined, please review the data and try again ❌",
                });
            }
            const findUser = yield User_1.default.findOne({ mail });
            console.log(findUser);
            if (!findUser) {
                return res.status(401).send({
                    status: 401,
                    ok: false,
                    message: "Unidentified user. Check the email entered and try again ❌",
                });
            }
            //Send to FRONT
            return res.status(201).send({
                data: findUser,
                message: "User found correctly 🤓",
                ok: true,
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                throw new Error(e.message);
            }
            else {
                console.error(e);
                throw new Error("An unexpected error has occurred, please try again later.");
                // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
            }
        }
    }),
    getUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { mail, id } = req.query;
            console.log("mail:", mail);
            if ((typeof mail !== "string" || mail.trim() === "") &&
                (typeof id !== "string" || id.trim() === "")) {
                return res.status(400).send({
                    message: "mail or id must be a non-empty string.",
                    ok: false,
                });
            }
            const query = {};
            if (typeof mail === "string" && mail.trim() !== "") {
                query.mail = mail;
            }
            if (typeof id === "string" && id.trim() !== "") {
                query._id = id; // Usar _id para buscar por ObjectId
            }
            // Buscar el usuario
            const userFound = yield User_1.default.findOne(query);
            if (!userFound)
                return res.status(401).send({
                    message: "No user found on 'getUser', review the ID or try again later",
                    ok: false,
                });
            userFound.password = "";
            console.log(userFound);
            return res.status(201).send({
                data: userFound,
                message: "User found 😎",
                ok: true,
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                return res.status(401).send({
                    error: e,
                    message: e.message,
                    ok: false,
                });
                // throw new Error(e.message);
            }
            else {
                console.error(e);
                return res.status(401).send({
                    error: e,
                    message: "An unexpected error has occurred, please try again later.",
                    ok: false,
                });
                throw new Error("An unexpected error has occurred, please try again later.");
                // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
            }
        }
    }),
    getUserByUsername: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { username } = req.query;
            console.log("username:", username);
            if (typeof username !== "string") {
                return res.status(400).send({
                    message: "username must be a string.",
                    ok: false,
                });
            }
            const userFound = yield User_1.default.findOne({ username: username });
            if (!userFound)
                return res.status(401).send({
                    message: "No user found on 'getUser', review the username or try again later",
                    ok: false,
                });
            userFound.password = "";
            console.log(userFound);
            return res.status(201).send({
                data: userFound,
                message: "User found 😎",
                ok: true,
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                return res.status(401).send({
                    error: e,
                    message: e.message,
                    ok: false,
                });
                // throw new Error(e.message);
            }
            else {
                console.error(e);
                return res.status(401).send({
                    error: e,
                    message: "An unexpected error has occurred, please try again later.",
                    ok: false,
                });
                throw new Error("An unexpected error has occurred, please try again later.");
                // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
            }
        }
    }),
    getUsersById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { idsArray } = req.body;
            console.log("getUsersById:", idsArray);
            if (!Array.isArray(idsArray)) {
                return res.status(400).send({
                    message: "idsArray must be an array of ObjectId.",
                    ok: false,
                });
            }
            const objectIdArray = idsArray.map((id) => new mongoose_1.default.Types.ObjectId(id));
            const usersFound = yield User_1.default.find({ _id: { $in: objectIdArray } });
            // if (usersFound.length === 0) {
            //   return res.status(401).send({
            //     message: "No users found for the provided IDs.",
            //     ok: false
            //   });
            // }
            usersFound.forEach((user) => (user.password = ""));
            return res.status(201).send({
                data: usersFound,
                message: "Users found 😎",
                ok: true,
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                return res.status(401).send({
                    error: e,
                    message: e.message,
                    ok: false,
                });
                // throw new Error(e.message);
            }
            else {
                console.error(e);
                return res.status(401).send({
                    error: e,
                    message: "An unexpected error has occurred, please try again later.",
                    ok: false,
                });
                throw new Error("An unexpected error has occurred, please try again later.");
                // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
            }
        }
    }),
};
exports.default = userCtrl;
