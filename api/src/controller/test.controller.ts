import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define a type for the payload
interface CustomJwtPayload extends JwtPayload {
  roles?: string[];
}
export const shouldBeLoggedIn = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  console.log(token);

  if (!token) return res.status(401).json({ message: "Not Authenticated" });

  jwt.verify(
    token,
    process.env.JWT_SECRET_KEY ?? "secretKey",
    async (err: Error | null) => {
      if (err) return res.status(401).json({ message: "Not Authenticated" });
    }
  );

  res.status(200).json({ message: "You are authenticated" });
};

export const shouldBeAdmin = async (req: Request, res: Response) => {};
