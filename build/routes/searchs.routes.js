"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const searchs_controllers_1 = __importDefault(require("../controllers/searchs.controllers"));
//Const
const searchRouter = (0, express_1.Router)();
const routeGeneral = "/api/search/";
//Routes:
searchRouter.route(routeGeneral + 'generalSearch')
    .get(searchs_controllers_1.default.generalSearch);
exports.default = searchRouter;
