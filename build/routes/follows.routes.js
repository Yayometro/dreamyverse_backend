"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const follows_controllers_1 = __importDefault(require("../controllers/follows.controllers"));
//Const
const followsRouter = (0, express_1.Router)();
const routeGeneral = "/api/follows/";
//Routes:
followsRouter.route(routeGeneral + 'newFollow')
    .post(follows_controllers_1.default.newFollow);
followsRouter.route(routeGeneral + 'removeFollow')
    .post(follows_controllers_1.default.removeFollow);
followsRouter.route(routeGeneral + 'getListOfUsersFollowedByUser')
    .get(follows_controllers_1.default.getListOfUsersFollowedByUser);
followsRouter.route(routeGeneral + 'getUserFollowers')
    .get(follows_controllers_1.default.getUserFollowers);
followsRouter.route(routeGeneral + 'getUsersFollowingDream')
    .get(follows_controllers_1.default.getUsersFollowingDream);
followsRouter.route(routeGeneral + 'amIFollowingThisUser')
    .get(follows_controllers_1.default.amIFollowingThisUser);
followsRouter.route(routeGeneral + 'amIFollowingThisDream')
    .get(follows_controllers_1.default.amIFollowingThisDream);
exports.default = followsRouter;
