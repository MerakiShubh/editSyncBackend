import express from "express";
import dotenv from "dotenv";
import { config } from "./src/config/config.js";

dotenv.config();
const app = express();

app.listen(config.get("port"), () => {
  console.log(`⚙️ Server is running at port: ${config.get("port")}`);
});
