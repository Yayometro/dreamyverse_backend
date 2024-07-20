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
const Conversation_1 = __importDefault(require("../models/Conversation"));
const mongoose_1 = require("mongoose");
const Message_1 = __importDefault(require("../models/Message"));
const conversationsCtrl = {
    getAllUserConversations: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.query;
            if (typeof id !== "string") {
                return res.status(400).send({
                    message: "id must be a string.",
                    ok: false,
                });
            }
            const userId = id;
            const findAllConversations = yield Conversation_1.default.find({
                participants: { $in: [userId] },
                //$in operation find DOCS where the userID is present.
            }).populate("participants");
            if (!findAllConversations || findAllConversations.length === 0) {
                return res.status(201).send({
                    data: findAllConversations,
                    message: "No conversations found for the user.",
                    ok: false,
                });
            }
            return res.status(200).send({
                data: findAllConversations,
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
    clearConversationForUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { convId, userId } = req.query;
            if (typeof convId !== "string" && typeof userId !== "string") {
                return res.status(400).send({
                    error: "id for conversation and user must be a string.",
                    message: "id for conversation and user must be a string.",
                    ok: false,
                });
            }
            const userObjectId = userId;
            const findAllConversationsAndUpdateThem = yield Message_1.default.updateMany({ conversation: convId }, { $addToSet: { "removed.for": userObjectId } }
            //addToSet is an operator and helps to check if the userID is already inside in remove.for and if not, then adds the id.
            );
            console.log("findAllConversationsAndUpdateThem", findAllConversationsAndUpdateThem);
            if (!findAllConversationsAndUpdateThem) {
                return res.status(404).send({
                    error: findAllConversationsAndUpdateThem,
                    message: "Something went wrong while we were clening this conversation, please try again later..",
                    ok: false,
                });
            }
            return res.status(200).send({
                data: true,
                message: "The user removed all the conversation messages on it's side successfully 👌",
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
    editConversation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const conversation = req.body;
            if (typeof conversation !== "object") {
                return res.status(400).send({
                    message: "Invalid conversation data.",
                    ok: false,
                });
            }
            if (!(conversation === null || conversation === void 0 ? void 0 : conversation.participants) ||
                !Array.isArray(conversation.participants)) {
                return res.status(400).send({
                    error: "Participants list is required.",
                    message: "Participants list is required.",
                    ok: false,
                });
            }
            if (conversation.participants.length <= 1) {
                return res.status(400).send({
                    error: "The participants on a conversation must be at least 2.",
                    message: "The participants on a conversation must be at least 2.",
                    ok: false,
                });
            }
            let conversationUpdated;
            if (conversation.participants.length > 2) {
                conversationUpdated = yield Conversation_1.default.findByIdAndUpdate(conversation._id, {
                    participants: conversation.participants,
                });
                if (!conversationUpdated) {
                    return res.status(404).send({
                        error: conversationUpdated,
                        message: "Something went wrong while updating the conversation participants.",
                        ok: false,
                    });
                }
            }
            conversationUpdated = yield Conversation_1.default.findByIdAndUpdate(conversation._id, {
                isBlocked: conversation === null || conversation === void 0 ? void 0 : conversation.isBlocked,
                isMuted: conversation === null || conversation === void 0 ? void 0 : conversation.isMuted,
            }, { new: true });
            if (!conversationUpdated) {
                return res.status(404).send({
                    error: conversationUpdated,
                    message: "Something went wrong while updating the conversation settings.",
                    ok: false,
                });
            }
            return res.status(200).send({
                data: conversationUpdated,
                message: "Conversation updated successfully.",
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
    createUserConversation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const conversation = req.body;
            if (typeof conversation !== "object") {
                return res.status(400).send({
                    message: "No conversations found for the user.",
                    ok: false,
                });
            }
            if (!(conversation === null || conversation === void 0 ? void 0 : conversation.participants) ||
                !Array.isArray(conversation.participants)) {
                return res.status(400).send({
                    error: "Participants list is required.",
                    message: "Participants list is required.",
                    ok: false,
                });
            }
            if (conversation.participants.lenght <= 1) {
                return res.status(404).send({
                    error: "The participants on a conversation must be at least 2, please review the participant list an try again later.",
                    message: "The participants on a conversation must be at least 2, please review the participant list an try again later.",
                    ok: false,
                });
            }
            const newConversation = new Conversation_1.default(conversation);
            const savedConversation = yield newConversation.save();
            if (!savedConversation) {
                return res.status(404).send({
                    error: savedConversation,
                    message: "Something went wrong trying to save the new conversation, review the error.",
                    ok: false,
                });
            }
            return res.status(200).send({
                data: savedConversation,
                message: "New conversation created.",
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
    conversationAlreadyExist: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { idOne, idTwo } = req.query;
            if (typeof idOne !== "string" || typeof idTwo !== "string") {
                return res.status(400).send({
                    message: "IDs must be strings to know if the conversation already exists.",
                    ok: false,
                });
            }
            const userIdOne = new mongoose_1.Types.ObjectId(idOne);
            const userIdTwo = new mongoose_1.Types.ObjectId(idTwo);
            const findConversation = yield Conversation_1.default.aggregate([
                {
                    $match: {
                        participants: { $all: [userIdOne, userIdTwo] }
                    }
                },
                {
                    $project: {
                        participants: 1,
                        size: { $size: "$participants" }
                    }
                },
                {
                    $match: {
                        size: 2
                    }
                }
            ]);
            if (findConversation.length === 0) {
                return res.status(200).send({
                    data: 0,
                    message: "This conversation between these two users does not exist already",
                    ok: false,
                });
            }
            return res.status(200).send({
                data: findConversation[0],
                message: "Conversation exists",
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
    getAllMessagesPerConversation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.query;
            if (typeof id !== "string") {
                return res.status(400).send({
                    message: "Id must be strings to know if the conversation already exists.",
                    ok: false,
                });
            }
            const findAllConversationMessages = yield Message_1.default.find({ conversation: id }).populate("fromUser");
            if (findAllConversationMessages.length === 0) {
                return res.status(200).send({
                    data: 0,
                    message: "This conversation has no messages yet, be the first one to talk!",
                    ok: false,
                });
            }
            return res.status(200).send({
                data: findAllConversationMessages,
                message: "Conversation messages get it",
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
exports.default = conversationsCtrl;
