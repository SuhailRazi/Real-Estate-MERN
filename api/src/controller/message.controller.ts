import { Request, Response } from "express";

export const addMessage = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Add message route" });
};
