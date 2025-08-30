import { Router } from "express";
import serviceRouter from "./service.routes.js";
import userRouter from "./user.routes.js";
import appointmentRouter from "./appointment.routes.js";
import salesRouter from "./dailySales.routes.js";
import transactionRouter from "./transaction.routes.js";
import dashboardRouter from "./dashboard.routes.js";

const mainRouter = Router();

mainRouter.use("/services", serviceRouter);
mainRouter.use("/users", userRouter);
mainRouter.use("/appointments", appointmentRouter);
mainRouter.use('/dailySales',salesRouter);
mainRouter.use("/transactions",transactionRouter)
mainRouter.use("/dashboard", dashboardRouter)

export default mainRouter;
