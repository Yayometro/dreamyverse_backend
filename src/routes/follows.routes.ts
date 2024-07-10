import { Router } from "express";
import followsCtrl from "../controllers/follows.controllers";

//Const
const followsRouter = Router();
const routeGeneral = "/api/follows/"

//Routes:
followsRouter.route(routeGeneral+'newFollow')
.post(followsCtrl.newFollow)
followsRouter.route(routeGeneral+'removeFollow')
.post(followsCtrl.removeFollow)
followsRouter.route(routeGeneral+'getListOfUsersFollowedByUser')
.get(followsCtrl.getListOfUsersFollowedByUser)
followsRouter.route(routeGeneral+'getUserFollowers')
.get(followsCtrl.getUserFollowers)
followsRouter.route(routeGeneral+'getUsersFollowingDream')
.get(followsCtrl.getUsersFollowingDream)
followsRouter.route(routeGeneral+'amIFollowingThisUser')
.get(followsCtrl.amIFollowingThisUser)
followsRouter.route(routeGeneral+'amIFollowingThisDream')
.get(followsCtrl.amIFollowingThisDream)


export default followsRouter