import { Request, Response } from "express";
import taskModel from "../model/task";
import { ITask } from "../model/task";

export const add_task = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const task: ITask | null = await taskModel.create({
      ...req.body,
      adminId: req.user,
    });
    return res
      .status(201)
      .send({ status: true, data: task, message: "Task added successfully" });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};

export const get_task = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const updatedTask: ITask[] | null = await taskModel.find();
    return res
      .status(200)
      .send({
        status: true,
        data: updatedTask,
        message: "Task updated successfully",
      });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};

export const edit_task = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const updatedTask = await taskModel.findOneAndUpdate(
      { _id: req.body.taskId },
      {
        task_name: req.body.task_name,
        due_date: req.body.due_date,
        status: req.body.status,
      }
    );
    return res
      .status(200)
      .send({
        status: true,
        data: updatedTask,
        message: "Task updated successfully",
      });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};

export const get_user_task = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const task: ITask[] | null = await taskModel.find({
      userId: req.user,
    });
    return res
      .status(200)
      .send({
        status: true,
        data: task,
        message: "Task updated successfully",
      });
  } catch (err: any) {
    console.log(err.message);
    return res.status(500).send(err.message);
  }
};
