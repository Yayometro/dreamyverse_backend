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
const Dream_1 = __importDefault(require("../models/Dream"));
const User_1 = __importDefault(require("../models/User"));
const Follow_1 = __importDefault(require("../models/Follow"));
const __1 = require("..");
const Notification_1 = __importDefault(require("../models/Notification"));
const mapUsersIdSocket_1 = __importDefault(require("../helpers/mapUsersIdSocket"));
//Const
const dreamCtrl = {
    getUserDreams: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.query;
            console.log("mail:", id);
            if (typeof id !== "string") {
                return res.status(400).send({
                    message: "ID must be a string.",
                    ok: false,
                });
            }
            const userFound = yield User_1.default.findOne({ _id: id });
            if (!userFound)
                return res.status(401).send({
                    message: "No user found on 'getUserDreams', review the _Id or try again later",
                    ok: false,
                });
            const userDreams = yield Dream_1.default.find({ user: userFound._id })
                .populate("user")
                .sort({ date: -1 });
            if (!userDreams)
                return res.status(401).send({
                    message: "No dreams found on 'getUserDreams', review the ID or try again later",
                    ok: false,
                });
            console.log(userDreams);
            return res.status(201).send({
                data: userDreams,
                message: "Dreams found 😎",
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
    getDream: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.query;
            console.log("id:", id);
            if (typeof id !== "string") {
                return res.status(400).send({
                    message: "ID must be a string.",
                    ok: false,
                });
            }
            const dreamFound = yield Dream_1.default.findById(id).populate("user");
            if (!dreamFound)
                return res.status(401).send({
                    message: "No dream found on 'getDream', review the _Id or try again later",
                    ok: false,
                });
            return res.status(201).send({
                data: dreamFound,
                message: "Dream found 😎",
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
    getHomeDreamsFeed: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.query;
            console.log("userId:", userId);
            if (typeof userId !== "string") {
                return res.status(400).send({
                    message: "userId must be a string.",
                    ok: false,
                });
            }
            // Encuentra los follows del usuario
            const findFollowsFromUser = yield Follow_1.default.find({ follower: userId });
            if (!findFollowsFromUser) {
                return res.status(401).send({
                    message: "No follows found for the user, review the userId or try again later",
                    ok: false,
                });
            }
            // Start sets
            const followedUserIds = new Set();
            const followedDreamIds = new Set();
            // Organization
            findFollowsFromUser.forEach(follow => {
                if (follow.user) {
                    followedUserIds.add(follow.user.toString());
                }
                if (follow.dream) {
                    followedDreamIds.add(follow.dream.toString());
                }
            });
            // Add user
            followedUserIds.add(userId);
            // Find per user
            const userDreams = yield Dream_1.default.find({ user: { $in: Array.from(followedUserIds) } })
                .populate("user")
                .sort({ date: -1 })
                .limit(400);
            // Find per dream
            const followedDreams = yield Dream_1.default.find({ _id: { $in: Array.from(followedDreamIds) } })
                .populate("user")
                .sort({ date: -1 })
                .limit(400);
            // Mix and remove duplicates
            const totalDreams = [...new Set([...userDreams, ...followedDreams])];
            if (!totalDreams.length) {
                return res.status(201).send({
                    data: totalDreams,
                    message: "No dreams found, user must follow somone to display results",
                    ok: false,
                });
            }
            return res.status(201).send({
                data: totalDreams,
                message: "Dreams found 😎",
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
            }
            else {
                console.error(e);
                return res.status(401).send({
                    error: e,
                    message: "An unexpected error has occurred, please try again later.",
                    ok: false,
                });
            }
        }
    }),
    getAllPublicDreams: (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const publicDreams = yield Dream_1.default.find({ "visibility.isPublic": true })
                .populate("user")
                .sort({ date: -1 });
            if (!publicDreams)
                return res.status(401).send({
                    message: "No dreams found on 'getpublicDreams', review the ID or try again later",
                    ok: false,
                });
            // const publicDreamsOrdered
            if (publicDreams.length > 400) {
                return res.status(201).send({
                    data: publicDreams.slice(0, 400),
                    message: "Dream found limited to 400 😎",
                    ok: true,
                });
            }
            return res.status(201).send({
                data: publicDreams,
                message: "Dream found 😎",
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
    createDream: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user, visibility, dream, title, date, category, image, people, recording, isLucid, } = req.body;
            // Verifica si el usuario existe
            const userExists = yield User_1.default.findById(user);
            if (!userExists) {
                return res.status(404).send({
                    message: "User creator not found, review the userID",
                    ok: false,
                });
            }
            const newDream = new Dream_1.default({
                user,
                visibility,
                dream,
                title,
                date,
                category,
                image,
                recording,
                isLucid,
            });
            const savedDream = yield newDream.save();
            yield savedDream.populate("user");
            if (!savedDream) {
                throw new Error("No dream was saved creating a NEW DREAM ❌");
            }
            // Notifications handling
            if (people && people.fromApp && people.fromApp.length > 0) {
                for (const taggedUser of people.fromApp) {
                    const userFound = yield User_1.default.findById(taggedUser.person);
                    if (!userFound) {
                        console.log("User not found", taggedUser.person);
                        continue; // O puedes enviar un error si es crítico
                    }
                    const notification = new Notification_1.default({
                        user: userFound._id,
                        type: 'dream',
                        redirectionalId: savedDream._id,
                        message: `${userExists.username} has dreamed about you in a new dream 🌛`,
                    });
                    yield notification.save();
                    const socketId = mapUsersIdSocket_1.default[userFound._id];
                    console.log("socketId", socketId);
                    if (socketId) {
                        console.log("Se identifico un socketId igual a ", socketId);
                        __1.io.to(socketId).emit("notification", notification);
                        console.log("Se emitió una notificacion");
                    }
                }
            }
            // Send to FRONT
            return res.status(201).send({
                data: savedDream,
                message: "Dream created correctly 😎",
                ok: true,
            });
        }
        catch (e) {
            console.log(e);
            return res.status(500).send({
                message: "An unexpected error has occurred, please try again later.",
                ok: false,
            });
        }
    }),
    editDream: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const editedDream = req.body;
            console.log({ editedDream: editedDream });
            // creating DREAM
            const editedDreamMongo = yield Dream_1.default.findByIdAndUpdate(editedDream._id, { $set: editedDream }, { new: true }).populate("user");
            if (!editedDreamMongo) {
                res.status(401).send({
                    error: editedDreamMongo,
                    message: "No dream was edited while saving changes ❌",
                });
            }
            console.log("editedDreamMongo:", editedDreamMongo);
            //Notifications handdling
            if ((editedDreamMongo === null || editedDreamMongo === void 0 ? void 0 : editedDreamMongo.people) && editedDreamMongo.people.fromApp && editedDreamMongo.people.fromApp.length > 0) {
                for (const taggedUser of editedDreamMongo.people.fromApp) {
                    const userFound = yield User_1.default.findById(taggedUser.person);
                    if (!userFound) {
                        console.log("User not found", userFound);
                        res.status(401).send({
                            error: userFound,
                            message: "No user found while tagging users from app on the edition of your dream... 🚨",
                            ok: false
                        });
                    }
                    const notification = new Notification_1.default({
                        user: userFound._id,
                        type: 'dream',
                        redirectionalId: editedDreamMongo._id,
                        message: `${editedDreamMongo.user.username} has dreamed about you in a his dream 🌛`,
                    });
                    yield notification.save();
                    if (userFound) {
                        const socketId = mapUsersIdSocket_1.default[userFound._id];
                        console.log(socketId);
                        if (socketId) {
                            __1.io.to(socketId).emit("notification", notification);
                        }
                    }
                }
            }
            //Send to FRONT
            return res.status(201).send({
                data: editedDreamMongo,
                message: "Dream edited correctly 😎",
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
    removeDream: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { dreamId } = req.query;
            console.log("req.query", req.query);
            console.log({
                dreamId: dreamId,
            });
            if (!dreamId) {
                return res.status(400).send("dreamId is required to remove Dream");
            }
            if (typeof dreamId !== "string") {
                return res.status(400).send("dreamId must be a string.");
            }
            const removedDream = yield Dream_1.default.findByIdAndDelete(dreamId);
            console.log("removedDream", removedDream);
            if (!removedDream) {
                return res.status(400).send({
                    error: "Unable to remove dream, please REVIEW THE Dream ID",
                    message: removedDream,
                    ok: false,
                });
            }
            return res.status(201).send({
                data: removedDream,
                message: "Dream removed 😎",
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
                // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
            }
        }
    }),
    getUserDreamsLenght: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.query;
            console.log("req.query", req.query);
            console.log({
                userId: userId,
            });
            if (!userId) {
                return res
                    .status(400)
                    .send("userId is required to found dreams lenght");
            }
            if (typeof userId !== "string") {
                return res.status(400).send("userId must be a string.");
            }
            const getDreams = yield Dream_1.default.find({ user: userId });
            console.log("getDreams", getDreams);
            if (!getDreams) {
                return res.status(400).send({
                    error: "Unable to find dreams length",
                    message: getDreams,
                    ok: false,
                });
            }
            return res.status(201).send({
                data: getDreams.length,
                message: "Dream length found 😎",
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
                // process.exit(1);  // Salir del proceso si la conexión a la base de datos falla
            }
        }
    }),
};
exports.default = dreamCtrl;
