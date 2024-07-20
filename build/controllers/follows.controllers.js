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
const Follow_1 = __importDefault(require("../models/Follow"));
const Notification_1 = __importDefault(require("../models/Notification"));
const Dream_1 = __importDefault(require("../models/Dream"));
const mapUsersIdSocket_1 = __importDefault(require("../helpers/mapUsersIdSocket"));
const __1 = require("..");
//Const
const followsCtrl = {
    newFollow: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const follow = req.body;
            console.log("req.query newFollow", req.body);
            console.log({
                follow: follow,
            });
            if (!follow) {
                return res.status(400).send("follow is required to create follow");
            }
            if (typeof follow !== "object") {
                return res.status(400).send("Follow must be an object.");
            }
            const newFollow = new Follow_1.default(follow);
            console.log("newFollow", newFollow);
            const savedFollow = yield (yield newFollow.save()).populate("follower");
            console.log("savedFollow", savedFollow);
            if (!savedFollow) {
                return res
                    .status(400)
                    .send({
                    error: "Follow could not being saved",
                    message: newFollow,
                });
            }
            //HANLDE NOTIFICATION
            const typeFollow = savedFollow.user ? "user" : savedFollow.dream ? "dream" : "post";
            let dream;
            let message;
            let userId;
            if (typeFollow === "dream") {
                dream = yield Dream_1.default.findById(savedFollow.dream);
                if (!dream) {
                    return res
                        .status(400)
                        .send({
                        message: "Dream was not found while creating new notification for a new follow",
                        error: newFollow,
                    });
                }
                message = `${savedFollow.follower.username} is following one of your dreams. Click to see one.`;
                userId = dream.user;
            }
            else if (typeFollow === "user") {
                message = `${savedFollow.follower.username} is following you now!`;
                userId = savedFollow.user;
            }
            const notification = new Notification_1.default({
                user: userId,
                type: typeFollow,
                redirectionalId: typeFollow === "user" ? savedFollow.follower.username : typeFollow === "dream" ? savedFollow.dream : "post",
                message: message,
            });
            yield notification.save();
            if (!notification) {
                console.log("!notification", notification);
                return res
                    .status(400)
                    .send({
                    message: "Notification was not saved while creating new follow",
                    error: notification,
                });
            }
            //HANDLE SOCKET NOTIFICATION
            const socketId = mapUsersIdSocket_1.default[userId];
            console.log("socketId", socketId);
            if (socketId) {
                console.log("Se identifico un socketId igual a ", socketId);
                __1.io.to(socketId).emit("notification", notification);
                console.log("Se emitió una notificacion");
            }
            //FINALLY SEND RESPONSE
            return res.status(201).send({
                data: savedFollow,
                message: "Follow created 😎",
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
    getUserFollowers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.query;
            console.log("req.query", req.query);
            console.log({
                userId: userId,
            });
            if (!userId) {
                return res.status(400).send("userId is required to create follow");
            }
            if (typeof userId !== "string") {
                return res.status(400).send("userId must be a string.");
            }
            const findUserFollowers = yield Follow_1.default.find({ user: userId }).populate("follower");
            console.log("findUserFollowers", findUserFollowers);
            if (!findUserFollowers) {
                return res
                    .status(400)
                    .send({
                    error: "Unable to find user followers, please REVIEW THE USER ID",
                    message: findUserFollowers,
                });
            }
            if (findUserFollowers.length <= 0) {
                return res.status(201).send({
                    data: findUserFollowers,
                    message: "No users following you",
                    ok: false,
                });
            }
            return res.status(201).send({
                data: findUserFollowers,
                message: "Users followers found 😎",
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
    getListOfUsersFollowedByUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.query;
            console.log("req.query", req.query);
            console.log({
                userId: userId,
            });
            if (!userId) {
                return res.status(400).send("userId is required to create follow");
            }
            if (typeof userId !== "string") {
                return res.status(400).send("userId must be a string.");
            }
            const findFollowsFromUser = yield Follow_1.default.find({
                follower: userId,
                $or: [
                    { dream: { $exists: false } },
                    { post: { $exists: false } }
                ]
            }).populate("user");
            console.log("findFollowsFromUser", findFollowsFromUser);
            if (!findFollowsFromUser) {
                return res
                    .status(400)
                    .send({
                    error: "Unable to find user followers",
                    ok: false
                });
            }
            if (findFollowsFromUser.length <= 0) {
                return res.status(201).send({
                    data: findFollowsFromUser,
                    message: "User is following none",
                    ok: false,
                });
            }
            return res.status(201).send({
                data: findFollowsFromUser,
                message: "List of users followed by the user, found 😎",
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
    getUsersFollowingDream: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { dreamId } = req.query;
            console.log("req.query", req.query);
            console.log({
                dreamId: dreamId,
            });
            if (!dreamId) {
                return res.status(400).send("dreamId is required to create follow");
            }
            if (typeof dreamId !== "string") {
                return res.status(400).send("dreamId must be a string.");
            }
            const findDreamFollowers = yield Follow_1.default.find({ dream: dreamId }).populate("follower");
            console.log("findDreamFollowers", findDreamFollowers);
            if (!findDreamFollowers) {
                return res
                    .status(400)
                    .send({
                    error: "Unable to find dreams users followers, please REVIEW THE USER ID",
                    message: findDreamFollowers,
                });
            }
            if (findDreamFollowers.length <= 0) {
                return res.status(201).send({
                    data: findDreamFollowers,
                    message: "This dream is not being followed",
                    ok: false,
                });
            }
            return res.status(201).send({
                data: findDreamFollowers,
                message: "List of dreams followers, found 😎",
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
    amIFollowingThisUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { follower, followed } = req.query;
            console.log("req.query", req.query);
            console.log({
                follower: follower,
                followed: followed
            });
            if (!follower) {
                return res.status(400).send("follower is required to create follow");
            }
            if (!followed) {
                return res.status(400).send("followed is required to create follow");
            }
            if (typeof follower !== "string") {
                return res.status(400).send("follower must be a string.");
            }
            if (typeof followed !== "string") {
                return res.status(400).send("followed must be a string.");
            }
            const amIFollowing = yield Follow_1.default.findOne({ follower: follower, user: followed });
            console.log("amIFollowing", amIFollowing);
            if (!amIFollowing) {
                return res
                    .status(201)
                    .send({
                    error: amIFollowing,
                    message: "Unable to know if user is following him/her, please REVIEW THE USER ID",
                    ok: false
                });
            }
            return res.status(201).send({
                data: amIFollowing,
                message: "Yes user is following, found 😎",
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
    amIFollowingThisDream: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { follower, followed } = req.query;
            console.log("req.query", req.query);
            console.log({
                follower: follower,
                followed: followed
            });
            if (!follower) {
                return res.status(400).send("follower is required to find follow");
            }
            if (!followed) {
                return res.status(400).send("followed is required to find follow");
            }
            if (typeof follower !== "string") {
                return res.status(400).send("follower must be a string.");
            }
            if (typeof followed !== "string") {
                return res.status(400).send("followed must be a string.");
            }
            const amIFollowing = yield Follow_1.default.findOne({ follower: follower, dream: followed });
            console.log("amIFollowing", amIFollowing);
            if (!amIFollowing) {
                return res
                    .status(201)
                    .send({
                    error: amIFollowing,
                    message: "Unable to know if user is following dream, please REVIEW THE USER ID",
                    ok: false
                });
            }
            return res.status(201).send({
                data: amIFollowing,
                message: "Yes user is following, found 😎",
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
    removeFollow: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { followId } = req.query;
            // console.log("req.query", req.query);
            console.log("followId", followId);
            if (!followId) {
                return res.status(400).send("followId is required to remove follow");
            }
            if (typeof followId !== "string") {
                return res.status(400).send("followId must be a string.");
            }
            const removedFollow = yield Follow_1.default.findByIdAndDelete(followId);
            console.log("removedFollow", removedFollow);
            if (!removedFollow) {
                return res
                    .status(400)
                    .send({
                    error: "Unable to remove follow, please REVIEW THE FOLLOW ID",
                    message: removedFollow,
                    ok: false
                });
            }
            return res.status(201).send({
                data: removedFollow,
                message: "Follow removed 😎",
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
exports.default = followsCtrl;
