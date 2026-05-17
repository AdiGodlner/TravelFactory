import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import validatorRoutes from "./routes/validatorRoutes.js";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(
	cors({
		origin: env.CLIENT_URL,
		credentials: true,
	}),
);

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Server is working!");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/validator", validatorRoutes);

// error handler LAST
app.use(errorHandler);
