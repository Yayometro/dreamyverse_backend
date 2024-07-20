"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reactions_controllers_1 = __importDefault(require("../controllers/reactions.controllers"));
//Const
const reactionsRouter = (0, express_1.Router)();
const routeGeneral = "/api/reactions/";
//Routes:
reactionsRouter.route(routeGeneral + 'newReaction')
    .post(reactions_controllers_1.default.newReaction);
reactionsRouter.route(routeGeneral + 'isThisPostLikedByTheUser')
    .get(reactions_controllers_1.default.isThisPostLikedByTheUser);
reactionsRouter.route(routeGeneral + 'getAllReactionsFromThisDream')
    .get(reactions_controllers_1.default.getAllReactionsFromThisDream);
reactionsRouter.route(routeGeneral + 'removeReaction')
    .post(reactions_controllers_1.default.removeReaction);
exports.default = reactionsRouter;
