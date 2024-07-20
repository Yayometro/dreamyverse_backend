"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messages_controllers_1 = __importDefault(require("../controllers/messages.controllers"));
//Const
const messageRouter = (0, express_1.Router)();
const routeGeneral = "/api/messages/";
//Routes:
messageRouter.route(routeGeneral + 'getConversationMessages')
    .get(messages_controllers_1.default.getConversationMessages);
messageRouter.route(routeGeneral + 'createMessage')
    .post(messages_controllers_1.default.createMessage);
messageRouter.route(routeGeneral + 'editMessage')
    .post(messages_controllers_1.default.editMessage);
messageRouter.route(routeGeneral + 'markAsRead')
    .post(messages_controllers_1.default.markAsRead);
messageRouter.route(routeGeneral + 'removeMessage')
    .post(messages_controllers_1.default.removeMessage);
exports.default = messageRouter;
