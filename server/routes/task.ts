// server/routes/task.ts
import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import {
  add_task,
  edit_task,
  get_task,
  get_user_task,
} from "../controllers/task";
import {
  authenticateAdmin,
  authenticateUser,
} from "../middleware/authenticateUser";

router.post(
  "/add_task",
  authenticateAdmin as unknown as (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void,
  add_task as unknown as (req: Request, res: Response) => void
);
router.get(
  "/get_task",
  authenticateAdmin as unknown as (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void,
  get_task as unknown as (req: Request, res: Response) => void
);
router.get(
  "/get_user_task",
  authenticateUser as unknown as (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void,
  get_user_task as unknown as (req: Request, res: Response) => void
);
router.post(
  "/update_task",
  authenticateAdmin as unknown as (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void,
  edit_task as unknown as (req: Request, res: Response) => void
);
router.post(
  "/update_task_by_user",
  authenticateUser as unknown as (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void,
  edit_task as unknown as (req: Request, res: Response) => void
);

export default router;
