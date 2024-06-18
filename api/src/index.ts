import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.send("Welcome to Real estate API using TypeScript");
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
