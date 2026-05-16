import "reflect-metadata";
import express from "express";
import "dotenv/config";
import { AppDataSource } from "./data-src.js";
import { User } from "./entities/User.js";
import { VacationRequest } from "./entities/vacationRequest.js";

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

	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});
}

bootstrap();
