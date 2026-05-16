import "reflect-metadata";
import express from "express";
import "dotenv/config";
import { AppDataSource } from "./data-src.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import validatorRoutes from "./routes/validatorRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

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
	app.use(express.json());

	app.get("/", (req, res) => {
		res.send("Server is working!");
	});

	app.use("/auth", authRoutes);
	app.use("/user", userRoutes);
	app.use("/validator", validatorRoutes);

	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});
}

bootstrap();
