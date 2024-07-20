"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = __importDefault(require("../controllers/user.controllers"));
//Const
const usersRouter = (0, express_1.Router)();
const routeGeneral = "/api/user/";
//Routes:
usersRouter.route(routeGeneral + 'login')
    .post(user_controllers_1.default.login);
usersRouter.route(routeGeneral + 'register')
    .post(user_controllers_1.default.register);
usersRouter.route(routeGeneral + 'update')
    .post(user_controllers_1.default.update);
usersRouter.route(routeGeneral + 'getUser')
    .get(user_controllers_1.default.getUser);
usersRouter.route(routeGeneral + 'getUserByUsername')
    .get(user_controllers_1.default.getUserByUsername);
usersRouter.route(routeGeneral + 'getUserPost')
    .post(user_controllers_1.default.getUserPost);
usersRouter.route(routeGeneral + 'getUsersById')
    .post(user_controllers_1.default.getUsersById);
exports.default = usersRouter;
