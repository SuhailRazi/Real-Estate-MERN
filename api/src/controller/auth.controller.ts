import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Hash password
  const hashPassword = await bcrypt.hash(password, 10);
  console.log(hashPassword);
};

export const login = (req: Request, res: Response) => {};

export const logout = (req: Request, res: Response) => {};
