import prisma from "../lib/prisma";
import { Response, Request } from "express";

export const getChats = async (req: Request, res: Response) => {
  const tokenUserId = res.locals.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Failed to get chats" });
  }
};

export const getOneChat = async (req: Request, res: Response) => {
  const tokenUserId = res.locals.userId;
  const chatId = req.params.id;
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Failed to get chats" });
  }
};

export const readChat = async (req: Request, res: Response) => {
  const tokenUserId = res.locals.userId;
  const chatId = req.params.id;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: chatId,
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      data: {
        seenBy: {
          set: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Failed to get chats" });
  }
};

export const addChat = async (req: Request, res: Response) => {
  const tokenUserId = res.locals.userId;
  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, req.body.receiverId],
      },
    });
    res.status(200).json(newChat);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Failed to get chats" });
  }
};
