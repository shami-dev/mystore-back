import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.info(`🚀 Express server running on http://localhost:${PORT}`);
});
