
import { Router } from "express";
import messageCtrl from "../controllers/messages.controllers";

//Const
const messageRouter = Router();
const routeGeneral = "/api/messages/"

//Routes:
messageRouter.route(routeGeneral+'getConversationMessages')
.get(messageCtrl.getConversationMessages)
messageRouter.route(routeGeneral+'createMessage')
.post(messageCtrl.createMessage)
messageRouter.route(routeGeneral+'editMessage')
.post(messageCtrl.editMessage)
messageRouter.route(routeGeneral+'markAsRead')
.post(messageCtrl.markAsRead)
messageRouter.route(routeGeneral+'removeMessage')
.post(messageCtrl.removeMessage)

export default messageRouter