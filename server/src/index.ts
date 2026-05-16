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

const app = express();

async function bootstrap() {
	try {
		await AppDataSource.initialize();
		console.log("Database initialized");
		startServer();
	} catch (err) {
		console.error("Failed to initialize DB:", err);
		process.exit(1);
	}
}

function startServer() {
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

	// ERROR HANDLER LAST (VERY IMPORTANT)
	app.use(errorHandler);

	const PORT = env.PORT;
	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});
}

bootstrap();
