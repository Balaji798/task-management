import { Request, Response } from "express";
import userModel from "../model/user";
import adminModel, { IAdmin } from "../model/admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { IUser } from "../model/user";

interface UserPayload {
  userId: string | unknown;
  email: string;
}

export const signup = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const reqUser: IAdmin | null = await adminModel.findOne({ email });

    if (reqUser) {
      return res.status(200).send({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: IAdmin = new adminModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    user.save();
    if (user) {
      const payload: UserPayload = { userId: user?._id, email };

      const generatedToken = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY || ""
      );

      return res
        .status(201)
        .send({
          status: true,
          data: { user: user, token: generatedToken },
          message: "Signup successful",
        });
    }

    return res.status(400).send({ error: "User could not be created" });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};

export const add_user = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const reqUser: IUser | null = await userModel.findOne({ email });

    if (reqUser) {
      return res.status(200).send({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user: IUser = new userModel({
      adminId: req.user,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    user.save();
    if (user) {
      const payload: UserPayload = { userId: user?._id, email };

      const generatedToken = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY || ""
      );

      return res
        .status(201)
        .send({ status: true, user: user, message: "User Added successfully" });
    }

    return res.status(400).send({ error: "User could not be created" });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;
    const userData: IUser | null = (await userModel.findOne({
      email,
    })) as IUser | null;
    if (!userData) {
      const admin: IUser | null = (await adminModel.findOne({
        email,
      })) as IUser | null;
      if (!admin) {
        return res
          .status(404)
          .send({ message: "You are not signed up. Sign up first" });
      }
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(400).send({ message: "Invalid Password" });
      }
      const payload: UserPayload = { userId: admin?._id.toString(), email }; // Ensure userId is a string

      const generatedToken = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY || ""
      );

      return res
        .status(201)
        .send({
          status: true,
          data: { user: userData, token: generatedToken, type: "admin" },
          message: "Login Successful",
        });
    }

    const validPassword = await bcrypt.compare(password, userData.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid Password" });
    }
    const payload: UserPayload = { userId: userData?._id.toString(), email }; // Ensure userId is a string

    const generatedToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || "");

    return res
      .status(201)
      .send({
        status: true,
        data: { user: userData, token: generatedToken, type: "user" },
        message: "Login Successful",
      });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};

export const get_users = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users: IUser[] = await userModel.find({adminId:req.user});
    return res.status(200).json({status:true,data:users,message:"User fetch successfully"});
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};
