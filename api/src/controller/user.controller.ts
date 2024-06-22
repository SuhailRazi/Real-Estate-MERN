import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    const withoutPassword = users.map((user) => {
      return { ...user, password: undefined };
    });
    res.status(200).json(withoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const tokenUserId = res.locals.userId;
  const { password, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "You are not authorized" });
  }
  try {
    let updatedPassword = null;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const tokenUserId = res.locals.userId;
  if (id !== tokenUserId) {
    return res.status(403).json({ message: "You are not authorized" });
  }
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get users" });
  }
};
