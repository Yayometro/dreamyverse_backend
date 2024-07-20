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
const Notification_1 = __importDefault(require("../models/Notification"));
const mapUsersIdSocket_1 = __importDefault(require("../helpers/mapUsersIdSocket"));
const __1 = require("..");
const notifyCtrl = {
    createNotification: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const notification = req.body;
            if (typeof notification !== "object") {
                return res.status(400).send({
                    message: "notification must be a object.",
                    ok: false
                });
            }
            const newNotification = new Notification_1.default(notification);
            if (!newNotification) {
                return res.status(401).send({
                    message: "Something went wrong while trying create your notification, pelase reload the app or try again later",
                    error: newNotification,
                    ok: false
                });
            }
            const savedNotification = yield newNotification.save();
            if (!savedNotification) {
                return res.status(401).send({
                    message: "Something went wrong while trying save your notification, pelase reload the app or try again later",
                    error: newNotification,
                    ok: false
                });
            }
            // SEND SOCKET
            const receiverSocketId = mapUsersIdSocket_1.default[savedNotification.user];
            console.log("receiverSocketId", receiverSocketId);
            if (receiverSocketId) {
                console.log("SOCKET NOTIFICATOR ACTIVATED!");
                console.log("New notification by socket io send it");
                __1.io.to(receiverSocketId).emit("notification", savedNotification);
            }
            else {
                console.log("No receiver socket found for user", savedNotification.user);
            }
            return res.status(200).send({
                data: savedNotification,
                message: "User notification was created correctly...",
                ok: true
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                return res.status(500).send({
                    error: e,
                    message: e.message,
                    ok: false,
                });
            }
            else {
                console.error(e);
                return res.status(500).send({
                    error: e,
                    message: "An unexpected error has occurred, please try again later.",
                    ok: false,
                });
            }
        }
    }),
    getAllUserNotifications: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.query;
            if (typeof userId !== 'string') {
                return res.status(400).send({
                    message: "UserID must be a string.",
                    ok: false
                });
            }
            const allUsersNotifications = yield Notification_1.default.find({ user: userId });
            if (!allUsersNotifications) {
                return res.status(401).send({
                    message: "Something went wrong while trying to get all your notifications, pelase reload the app or try again later",
                    error: allUsersNotifications,
                    ok: false
                });
            }
            return res.status(200).send({
                data: allUsersNotifications,
                message: "User notifications get correctly...",
                ok: true
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                return res.status(500).send({
                    error: e,
                    message: e.message,
                    ok: false,
                });
            }
            else {
                console.error(e);
                return res.status(500).send({
                    error: e,
                    message: "An unexpected error has occurred, please try again later.",
                    ok: false,
                });
            }
        }
    }),
    removeNotification: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.query;
            if (typeof id !== 'string') {
                return res.status(400).send({
                    message: "Id must be a string.",
                    ok: false
                });
            }
            const allUsersNotifications = yield Notification_1.default.findByIdAndDelete(id);
            if (!allUsersNotifications) {
                return res.status(401).send({
                    message: "Something went wrong while trying delete notifications, pelase reload the app or try again later. Not ID",
                    error: allUsersNotifications,
                    ok: false
                });
            }
            return res.status(200).send({
                data: allUsersNotifications,
                message: "Notification was removed correctly 😎",
                ok: true
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                return res.status(500).send({
                    error: e,
                    message: e.message,
                    ok: false,
                });
            }
            else {
                console.error(e);
                return res.status(500).send({
                    error: e,
                    message: "An unexpected error has occurred, please try again later.",
                    ok: false,
                });
            }
        }
    }),
    removeAllNotifications: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.query;
            if (typeof userId !== 'string') {
                return res.status(400).send({
                    message: "UserID must be a string.",
                    ok: false
                });
            }
            const allUsersNotifications = yield Notification_1.default.deleteMany({ user: userId });
            if (!allUsersNotifications) {
                return res.status(401).send({
                    message: "Something went wrong while trying delete all yournotifications, pelase reload the app or try again later. Not UserId",
                    error: allUsersNotifications,
                    ok: false
                });
            }
            return res.status(200).send({
                data: allUsersNotifications,
                message: "All motification were clear 😎",
                ok: true
            });
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                return res.status(500).send({
                    error: e,
                    message: e.message,
                    ok: false,
                });
            }
            else {
                console.error(e);
                return res.status(500).send({
                    error: e,
                    message: "An unexpected error has occurred, please try again later.",
                    ok: false,
                });
            }
        }
    }),
};
exports.default = notifyCtrl;
