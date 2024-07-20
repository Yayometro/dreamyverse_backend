"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comments_controllers_1 = __importDefault(require("../controllers/comments.controllers"));
//Const
const commentsRouter = (0, express_1.Router)();
const routeGeneral = "/api/comments/";
//Routes:
commentsRouter.route(routeGeneral + 'newComment')
    .post(comments_controllers_1.default.createComment);
commentsRouter.route(routeGeneral + 'getCommentsFromDreamPost')
    .get(comments_controllers_1.default.getAllCommentsFromDreamCard);
commentsRouter.route(routeGeneral + 'removeCommentDream')
    .post(comments_controllers_1.default.removeCommentDream);
commentsRouter.route(routeGeneral + 'editCommentDream')
    .post(comments_controllers_1.default.editCommentDream);
exports.default = commentsRouter;
