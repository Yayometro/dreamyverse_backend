import { Router } from "express";
import notifyCtrl from "../controllers/notificatons.controllers";


//Const
const notifyRouter = Router();
const routeGeneral = "/api/notifications/"

//Routes:
notifyRouter.route(routeGeneral+'createNotification')
.post(notifyCtrl.createNotification)
notifyRouter.route(routeGeneral+'getAllUserNotifications')
.get(notifyCtrl.getAllUserNotifications)
notifyRouter.route(routeGeneral+'removeNotification')
.post(notifyCtrl.removeNotification)
notifyRouter.route(routeGeneral+'removeAllNotifications')
.post(notifyCtrl.removeAllNotifications)

export default notifyRouter