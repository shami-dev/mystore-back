import express, { Request, Response } from "express";
import { router } from "./routes/products.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express!");
});

app.use("/api/v1/products", router);

app.use(errorHandler);

export { app };
