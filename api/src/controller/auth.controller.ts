import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user and save to database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashPassword,
      },
    });
    res.status(201).json({ message: "User successfully created" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Failed to create user" });
  }
};

export const login = (req: Request, res: Response) => {};

export const logout = (req: Request, res: Response) => {};
