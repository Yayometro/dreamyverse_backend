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
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
const mapUsersIdSocket_1 = __importDefault(require("../helpers/mapUsersIdSocket"));
const __1 = require("..");
const messageCtrl = {
    getConversationMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.query;
            if (typeof id !== "string") {
                return res.status(400).send({
                    message: "id must be a string.",
                    ok: false,
                });
            }
            const conversatonalMessages = yield Message_1.default.find({ conversation: id });
            if (!conversatonalMessages) {
                return res.status(404).send({
                    error: conversatonalMessages,
                    message: "Messages not obtained, review the error.",
                    ok: false,
                });
            }
            return res.status(200).send({
                data: conversatonalMessages,
                message: "User conversations found.",
                ok: true,
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
    createMessage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const message = req.body;
            if (typeof message !== "object") {
                return res.status(400).send({
                    message: `message must be a object. Instead is a ${typeof message}`,
                    ok: false,
                });
            }
            message;
            console.log("message", message);
            if (!(message === null || message === void 0 ? void 0 : message.conversation)) {
                return res
                    .status(404)
                    .send("The new message must have a conversationID");
            }
            if (!(message === null || message === void 0 ? void 0 : message.fromUser) || !(message === null || message === void 0 ? void 0 : message.receiverUser)) {
                return res
                    .status(404)
                    .send("The new message must have the sender and receiver ID");
            }
            const newMessage = new Message_1.default(message);
            const savedMessage = yield newMessage.save();
            //Populate user who create the message
            yield savedMessage.populate("fromUser");
            if (!savedMessage) {
                return res.status(404).send({
                    error: savedMessage,
                    message: "New message could not be saved, review the error.",
                    ok: false,
                });
            }
            //CONECTION WITH SOCKET IO
            const receiverSocketId = mapUsersIdSocket_1.default[savedMessage.receiverUser];
            if (receiverSocketId) {
                __1.io.to(receiverSocketId).emit("receiveMessage", {
                    iMessage: savedMessage,
                    action: "newMessage",
                    message: undefined,
                });
            }
            return res.status(200).send({
                data: savedMessage,
                message: "User conversations found.",
                ok: true,
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
    editMessage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const message = req.body;
            if (typeof message !== "object") {
                return res.status(400).send({
                    message: "message must be a object.",
                    ok: false,
                });
            }
            if (!(message === null || message === void 0 ? void 0 : message._id)) {
                return res.status(400).send({
                    message: "message must have _id",
                    ok: false,
                });
            }
            //Start update:
            let editedMessage;
            const identifyMessage = yield Message_1.default.findById(message._id);
            if (!identifyMessage) {
                return res.status(404).send({
                    error: identifyMessage,
                    message: "Message origin could not be identified, review the error logs.",
                    ok: false,
                });
            }
            const identifyAutor = yield User_1.default.findById(message.fromUser);
            if (!identifyAutor) {
                return res.status(404).send({
                    error: identifyAutor,
                    message: "The autor of the message could not be identified, review the error logs.",
                    ok: false,
                });
            }
            //Content verification
            if (((_a = message === null || message === void 0 ? void 0 : message.content) === null || _a === void 0 ? void 0 : _a.message) !== (identifyMessage === null || identifyMessage === void 0 ? void 0 : identifyMessage.content.message) ||
                ((_b = message === null || message === void 0 ? void 0 : message.content) === null || _b === void 0 ? void 0 : _b.media) !== (identifyMessage === null || identifyMessage === void 0 ? void 0 : identifyMessage.content.media)) {
                editedMessage = yield Message_1.default.findByIdAndUpdate(message._id, message).populate("fromUser");
                if (!editedMessage) {
                    return res.status(404).send({
                        error: editedMessage,
                        message: "Message could not be edited, review the error logs.",
                        ok: false,
                    });
                }
                //CONECTION WITH SOCKET IO
                const receiverSocketId = mapUsersIdSocket_1.default[editedMessage.receiverUser];
                if (receiverSocketId) {
                    __1.io.to(receiverSocketId).emit("receiveMessage", {
                        iMessage: editedMessage,
                        action: "editContent",
                        message: `${identifyAutor.username} edited the content of one message in your conversation 👀`,
                    });
                }
                return res.status(200).send({
                    data: editedMessage,
                    message: "Message content was modified correctly",
                    ok: true,
                });
            }
            if (((_c = message === null || message === void 0 ? void 0 : message.removed) === null || _c === void 0 ? void 0 : _c.forAll) !== (identifyMessage === null || identifyMessage === void 0 ? void 0 : identifyMessage.removed.forAll)) {
                editedMessage = yield Message_1.default.findByIdAndUpdate(message._id, message).populate("fromUser");
                if (!editedMessage) {
                    return res.status(404).send({
                        error: editedMessage,
                        message: "Message could not be removed for all, review the error logs.",
                        ok: false,
                    });
                }
                //CONECTION WITH SOCKET IO
                const receiverSocketId = mapUsersIdSocket_1.default[editedMessage.receiverUser];
                if (receiverSocketId) {
                    __1.io.to(receiverSocketId).emit("receiveMessage", {
                        iMessage: editedMessage,
                        action: "removeForAll",
                        message: `${identifyAutor.username} remove one message permanently 🫢`,
                    });
                }
                return res.status(200).send({
                    data: editedMessage,
                    message: "The message was removed for all participants in this conversation.",
                    ok: true,
                });
            }
            if (((_d = message === null || message === void 0 ? void 0 : message.removed) === null || _d === void 0 ? void 0 : _d.for) && (identifyMessage === null || identifyMessage === void 0 ? void 0 : identifyMessage.removed.for)) {
                if (((_e = message === null || message === void 0 ? void 0 : message.removed) === null || _e === void 0 ? void 0 : _e.for.length) !== (identifyMessage === null || identifyMessage === void 0 ? void 0 : identifyMessage.removed.for.length)) {
                    editedMessage = yield Message_1.default.findByIdAndUpdate(message._id, message).populate("fromUser");
                    if (!editedMessage) {
                        return res.status(404).send({
                            error: editedMessage,
                            message: "Message could not be removed for the selected users, review the error logs.",
                            ok: false,
                        });
                    }
                    //CONECTION WITH SOCKET IO
                    let definingTypeAction;
                    let definingMessage;
                    if (message === null || message === void 0 ? void 0 : message.type) {
                        if (message.type === "RemovedForMyselfOnly") {
                            definingTypeAction = "removeFor";
                            definingMessage = `${identifyAutor.username} removed one message for him/her only.`;
                        }
                        else if (message.type === "RestoredForMyself") {
                            definingTypeAction = "visibleAgain";
                            definingMessage = `${identifyAutor.username} returned one message as visible again for him/her only`;
                        }
                        else if (message.type === "RemoveForTheOtherOnly") {
                            definingTypeAction = "removeFor";
                            definingMessage = `${identifyAutor.username} remove one message for you only 😬`;
                        }
                        else if (message.type === "RestoredForTheOther") {
                            definingTypeAction = "visibleAgain";
                            definingMessage = `${identifyAutor.username} returned one message as visible again for you 😏`;
                        }
                        else {
                            definingTypeAction = "removeFor";
                            definingMessage = `Message was removed or marked as visible again for ${identifyAutor.username}`;
                        }
                    }
                    const receiverSocketId = mapUsersIdSocket_1.default[editedMessage.receiverUser];
                    if (receiverSocketId) {
                        __1.io.to(receiverSocketId).emit("receiveMessage", {
                            iMessage: editedMessage,
                            action: definingTypeAction,
                            message: definingMessage,
                        });
                    }
                    return res.status(200).send({
                        data: editedMessage,
                        message: `Message removed`,
                        ok: true,
                    });
                }
            }
            //HANDLE MESSAGE UNREAD
            if (message.read !== identifyMessage.read) {
                editedMessage = yield Message_1.default.findByIdAndUpdate(message._id, message);
                if (!editedMessage) {
                    return res.status(404).send({
                        error: editedMessage,
                        message: "Message could not be marked as read. Review the error logs.",
                        ok: false,
                    });
                }
                return res.status(200).send({
                    data: editedMessage,
                    message: `Message marked as read`,
                    ok: true,
                });
            }
            //SAVE
            editedMessage = yield Message_1.default.findByIdAndUpdate(message._id, message);
            if (!editedMessage) {
                return res.status(404).send({
                    error: editedMessage,
                    message: "New message could not be updated, review the error.",
                    ok: false,
                });
            }
            return res.status(200).send({
                data: editedMessage,
                message: "User conversations found.",
                ok: true,
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
    markAsRead: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const messages = req.body;
            if (!Array.isArray(messages) || messages.length === 0) {
                return res.status(400).send({
                    message: "Messages must be a non-empty array.",
                    ok: false,
                });
            }
            // Update messages
            const updatedMessages = yield Message_1.default.updateMany({ _id: { $in: messages.map((m) => m) } }, { $set: { read: true } });
            if (!updatedMessages) {
                return res.status(404).send({
                    error: updatedMessages,
                    message: "Message origin could not be identified, review the error logs.",
                    ok: false,
                });
            }
            return res.status(200).send({
                data: updatedMessages,
                message: "Messages were marked as read",
                ok: true,
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
    removeMessage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.query;
            if (typeof id !== "string") {
                return res.status(400).send({
                    message: "id must be a string.",
                    ok: false,
                });
            }
            const removedMessage = yield Message_1.default.findByIdAndDelete(id).populate("fromUser");
            if (!removedMessage) {
                return res.status(404).send({
                    error: removedMessage,
                    message: "The message could not be removed, review the error.",
                    ok: false,
                });
            }
            //CONECTION WITH SOCKET IO
            const receiverSocketId = mapUsersIdSocket_1.default[removedMessage.receiverUser];
            if (receiverSocketId) {
                __1.io.to(receiverSocketId).emit("receiveMessage", {
                    iMessage: removedMessage,
                    action: "removeForAll",
                    message: `${!removedMessage.fromUser.username
                        ? "User"
                        : removedMessage.fromUser.username} remove one message for all 🙅‍♂️`,
                });
            }
            return res.status(200).send({
                data: removedMessage,
                message: "The message was removed completely",
                ok: true,
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
exports.default = messageCtrl;
