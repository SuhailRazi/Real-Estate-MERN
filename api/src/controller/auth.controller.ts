import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";

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

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(401).json({ message: "User not registered" });

    // check if user password is correct
    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid)
      res.status(401).json({ message: "Password is wrong" });

    // generate token and send to user
    const tokenAge = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY ?? "secretKey",
      {
        expiresIn: tokenAge,
      }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true, only for production mode
        maxAge: tokenAge,
      })
      .status(200)
      .json({ message: "login success", userInfo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login" });
  }
};

export const logout = (req: Request, res: Response) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "User logged out successfully" });
};
