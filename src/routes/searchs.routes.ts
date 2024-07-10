import { Router } from "express";
import searchCtrl from "../controllers/searchs.controllers";


//Const
const searchRouter = Router();
const routeGeneral = "/api/search/"

//Routes:
searchRouter.route(routeGeneral+'generalSearch')
.get(searchCtrl.generalSearch)

export default searchRouter