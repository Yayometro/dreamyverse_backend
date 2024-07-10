import { Router } from "express";
import dreamCtrl from "../controllers/dreams.controllers";

//Const
const dreamsRouter = Router();
const routeGeneral = "/api/dreams/"

//Routes:
dreamsRouter.route(routeGeneral+'newDream')
   .post(dreamCtrl.createDream)
dreamsRouter.route(routeGeneral+'getUserDreams')
   .get(dreamCtrl.getUserDreams)
dreamsRouter.route(routeGeneral+'getDream')
   .get(dreamCtrl.getDream)
dreamsRouter.route(routeGeneral+'removeDream')
   .post(dreamCtrl.removeDream)
dreamsRouter.route(routeGeneral+'editDream')
   .post(dreamCtrl.editDream)
dreamsRouter.route(routeGeneral+'getUserDreamsLenght')
   .get(dreamCtrl.getUserDreamsLenght)
dreamsRouter.route(routeGeneral+'getDiscovery')
   .get(dreamCtrl.getAllPublicDreams)
dreamsRouter.route(routeGeneral+'getHomeDreamsFeed')
   .get(dreamCtrl.getHomeDreamsFeed)


export default dreamsRouter