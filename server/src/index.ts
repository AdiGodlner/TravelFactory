import "reflect-metadata";
import express from "express";
import "dotenv/config";
import { AppDataSource } from "./data-src.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import validatorRoutes from "./routes/validatorRoutes.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";
import { app } from "./app.js";

async function bootstrap() {
	try {
		await AppDataSource.initialize();
		console.log("Database initialized");

		const PORT = env.PORT;
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error("Failed to initialize DB:", err);
		process.exit(1);
	}
}

bootstrap();
