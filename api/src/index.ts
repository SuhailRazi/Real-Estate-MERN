import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import testRoutes from "./routes/test.route";
import postRoutes from "./routes/post.route";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(cookieParser());
app.get("/api", (_req: Request, res: Response) => {
  res.send("Welcome to Real estate API using TypeScript");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/test", testRoutes);
app.use("/api/post", postRoutes);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
