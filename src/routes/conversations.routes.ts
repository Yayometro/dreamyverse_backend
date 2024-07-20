
import { Router } from "express";
import conversationsCtrl from "../controllers/conversations.controllers";


//Const
const conversationRouter = Router();
const routeGeneral = "/api/conversations/"

//Routes:
conversationRouter.route(routeGeneral+'getAllUserConversations')
.get(conversationsCtrl.getAllUserConversations)
conversationRouter.route(routeGeneral+'conversationAlreadyExist')
.get(conversationsCtrl.conversationAlreadyExist)
conversationRouter.route(routeGeneral+'createUserConversation')
.post(conversationsCtrl.createUserConversation)
conversationRouter.route(routeGeneral+'getAllMessagesPerConversation')
.get(conversationsCtrl.getAllMessagesPerConversation)
conversationRouter.route(routeGeneral+'clearConversationForUser')
.post(conversationsCtrl.clearConversationForUser)
conversationRouter.route(routeGeneral+'editConversation')
.post(conversationsCtrl.editConversation)

export default conversationRouter