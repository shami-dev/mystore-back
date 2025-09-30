import express, { Request, Response } from "express";
import { router } from "./routes/products.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express!");
});

app.use("/api/v1/products", router);

app.use(errorHandler);

export default app;

export { app };
