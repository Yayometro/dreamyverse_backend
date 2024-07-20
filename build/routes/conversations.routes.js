"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversations_controllers_1 = __importDefault(require("../controllers/conversations.controllers"));
//Const
const conversationRouter = (0, express_1.Router)();
const routeGeneral = "/api/conversations/";
//Routes:
conversationRouter.route(routeGeneral + 'getAllUserConversations')
    .get(conversations_controllers_1.default.getAllUserConversations);
conversationRouter.route(routeGeneral + 'conversationAlreadyExist')
    .get(conversations_controllers_1.default.conversationAlreadyExist);
conversationRouter.route(routeGeneral + 'createUserConversation')
    .post(conversations_controllers_1.default.createUserConversation);
conversationRouter.route(routeGeneral + 'getAllMessagesPerConversation')
    .get(conversations_controllers_1.default.getAllMessagesPerConversation);
conversationRouter.route(routeGeneral + 'clearConversationForUser')
    .post(conversations_controllers_1.default.clearConversationForUser);
conversationRouter.route(routeGeneral + 'editConversation')
    .post(conversations_controllers_1.default.editConversation);
exports.default = conversationRouter;
