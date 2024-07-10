import { Router } from "express";
import userCtrl from "../controllers/user.controllers";

//Const
const usersRouter = Router();
const routeGeneral = "/api/user/"

//Routes:
usersRouter.route(routeGeneral+'login')
   .post(userCtrl.login)
usersRouter.route(routeGeneral+'register')
   .post(userCtrl.register)
usersRouter.route(routeGeneral+'update')
   .post(userCtrl.update)
usersRouter.route(routeGeneral+'getUser')
   .get(userCtrl.getUser)
usersRouter.route(routeGeneral+'getUserByUsername')
   .get(userCtrl.getUserByUsername)
usersRouter.route(routeGeneral+'getUserPost')
   .post(userCtrl.getUserPost)
usersRouter.route(routeGeneral+'getUsersById')
   .post(userCtrl.getUsersById)

export default usersRouter