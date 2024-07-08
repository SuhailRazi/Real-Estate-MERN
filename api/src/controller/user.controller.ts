import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

const isValidObjectId = (id: string) => {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
};

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

export const getCurrentUser = async (req: Request, res: Response) => {
  const id = res.locals.userId;
  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get currentUser user" });
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
    res.status(500).json({ message: "Failed to get the requested user" });
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

export const savePosts = async (req: Request, res: Response) => {
  const postId = req.body.postId;
  const userId = res.locals.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: userId,
          postId,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to save posts" });
  }
};

export const profilePosts = async (req: Request, res: Response) => {
  const tokenUserId = res.locals.userId;

  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });

    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        Post: true,
      },
    });

    const savedPosts = saved.map((item) => item.Post);

    res.status(200).json({ userPosts, savedPosts });
  } catch (error) {
    res.status(500).json({ message: "Failed to get the saved posts" });
  }
};
