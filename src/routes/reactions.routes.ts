import { Router } from "express";
import reactionsCtrl from "../controllers/reactions.controllers";

//Const
const reactionsRouter = Router();
const routeGeneral = "/api/reactions/"

//Routes:
reactionsRouter.route(routeGeneral+'newReaction')
.post(reactionsCtrl.newReaction)
reactionsRouter.route(routeGeneral+'isThisPostLikedByTheUser')
.get(reactionsCtrl.isThisPostLikedByTheUser)
reactionsRouter.route(routeGeneral+'getAllReactionsFromThisDream')
.get(reactionsCtrl.getAllReactionsFromThisDream)
reactionsRouter.route(routeGeneral+'removeReaction')
.post(reactionsCtrl.removeReaction)


export default reactionsRouter