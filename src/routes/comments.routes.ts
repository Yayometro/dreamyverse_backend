import { Router } from "express";
import commentCtrl from "../controllers/comments.controllers";

//Const
const commentsRouter = Router();
const routeGeneral = "/api/comments/"

//Routes:
commentsRouter.route(routeGeneral+'newComment')
   .post(commentCtrl.createComment)
commentsRouter.route(routeGeneral+'getCommentsFromDreamPost')
   .get(commentCtrl.getAllCommentsFromDreamCard)
commentsRouter.route(routeGeneral+'removeCommentDream')
   .post(commentCtrl.removeCommentDream)
commentsRouter.route(routeGeneral+'editCommentDream')
   .post(commentCtrl.editCommentDream)

export default commentsRouter