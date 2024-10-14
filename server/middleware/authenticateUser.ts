import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
      return res.status(401).send({ settings: { success: "0", message: "Unauthorized request" } });

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).send({ settings: { success: "0", message: "Internal Server Error: Secret Key is not defined" } });
    }

    const user = verify(token, secretKey) as { userId: string };
    req.user = user.userId; // Set the user property
    next();
  } catch (err: any) {
    console.log(err.message);
    return res.status(403).send(err.message);
  }
};

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
      return res.status(401).send({ settings: { success: "0", message: "Unauthorized request" } });

    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).send({ settings: { success: "0", message: "Internal Server Error: Secret Key is not defined" } });
    }

    const user = verify(token, secretKey) as { userId: string };
    req.user = user.userId; // Set the user property
    next();
  } catch (err: any) {
    console.log(err.message);
    return res.status(403).send(err.message);
  }
};