import { Router, type IRouter } from "express";
import healthRouter from "./health";
import statsRouter from "./stats";
import membersRouter from "./members";
import coordinatorsRouter from "./coordinators";
import sectorsRouter from "./sectors";
import eventsRouter from "./events";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statsRouter);
router.use(membersRouter);
router.use(coordinatorsRouter);
router.use(sectorsRouter);
router.use(eventsRouter);

export default router;
