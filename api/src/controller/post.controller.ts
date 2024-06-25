import prisma from "../lib/prisma";
import { Response, Request } from "express";

export const getAllPost = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const post = await prisma.post.findUnique({
      where: { id },
    });

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const body = req.body;
  const tokenUserId = res.locals.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    res.status(200).json();
  } catch (err) {
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const tokenUserId = res.locals.userId;
  console.log(tokenUserId, id);

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post?.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};
