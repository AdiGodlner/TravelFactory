import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { VacationRequest } from "./entities/vacationRequest.js";
import { env } from "./config/env.js";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: env.DB_HOST,
	port: env.DB_PORT,
	username: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
	entities: [User, VacationRequest],
	synchronize: true,
	logging: true,
});
