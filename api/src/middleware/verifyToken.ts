import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not Authenticated" });

  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY ?? "secretKey",
    async (err: Error | null, payload: any) => {
      if (err) return res.status(401).json({ message: "Token is not valid" });

      res.locals.userId = payload?.id as string;
      next();
    }
  );
};
