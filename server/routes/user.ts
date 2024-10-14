import express, { Request, Response,NextFunction } from 'express';
const router = express.Router();

import { add_user, get_users, login, signup } from "../controllers/user";
import {authenticateAdmin} from "../middleware/authenticateUser";

router.post('/signup',signup as unknown as (req:Request, res:Response)=>void);
router.post("/login",login as unknown as (req:Request, res:Response)=>void);
router.post("/add_user",authenticateAdmin as unknown as (req: Request, res: Response, next: NextFunction) => void, add_user as unknown as (req:Request, res:Response)=>void)
router.get("/get_users",authenticateAdmin as unknown as (req: Request, res: Response, next: NextFunction) => void,get_users as unknown as (req:Request, res:Response)=>void);

export default router;