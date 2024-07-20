"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dreams_controllers_1 = __importDefault(require("../controllers/dreams.controllers"));
//Const
const dreamsRouter = (0, express_1.Router)();
const routeGeneral = "/api/dreams/";
//Routes:
dreamsRouter.route(routeGeneral + 'newDream')
    .post(dreams_controllers_1.default.createDream);
dreamsRouter.route(routeGeneral + 'getUserDreams')
    .get(dreams_controllers_1.default.getUserDreams);
dreamsRouter.route(routeGeneral + 'getDream')
    .get(dreams_controllers_1.default.getDream);
dreamsRouter.route(routeGeneral + 'removeDream')
    .post(dreams_controllers_1.default.removeDream);
dreamsRouter.route(routeGeneral + 'editDream')
    .post(dreams_controllers_1.default.editDream);
dreamsRouter.route(routeGeneral + 'getUserDreamsLenght')
    .get(dreams_controllers_1.default.getUserDreamsLenght);
dreamsRouter.route(routeGeneral + 'getDiscovery')
    .get(dreams_controllers_1.default.getAllPublicDreams);
dreamsRouter.route(routeGeneral + 'getHomeDreamsFeed')
    .get(dreams_controllers_1.default.getHomeDreamsFeed);
exports.default = dreamsRouter;
