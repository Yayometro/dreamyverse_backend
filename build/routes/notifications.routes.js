"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificatons_controllers_1 = __importDefault(require("../controllers/notificatons.controllers"));
//Const
const notifyRouter = (0, express_1.Router)();
const routeGeneral = "/api/notifications/";
//Routes:
notifyRouter.route(routeGeneral + 'createNotification')
    .post(notificatons_controllers_1.default.createNotification);
notifyRouter.route(routeGeneral + 'getAllUserNotifications')
    .get(notificatons_controllers_1.default.getAllUserNotifications);
notifyRouter.route(routeGeneral + 'removeNotification')
    .post(notificatons_controllers_1.default.removeNotification);
notifyRouter.route(routeGeneral + 'removeAllNotifications')
    .post(notificatons_controllers_1.default.removeAllNotifications);
exports.default = notifyRouter;
