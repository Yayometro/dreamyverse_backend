import { Router } from "express";
import dashboardController from "../controllers/dashboard.controllers";

//Const
 const dashboardRouter = Router();

 //Routes:
 dashboardRouter.route('/dashboard')
    .get(dashboardController.init)

export default dashboardRouter