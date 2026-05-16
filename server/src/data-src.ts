import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User.js";
import { VacationRequest } from "./entities/vacationRequest.js";

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`Missing env: ${name}`);
	return value;
}

export const AppDataSource = new DataSource({
	type: "postgres",
	host: requireEnv("DB_HOST"),
	port: Number(requireEnv("DB_PORT")),
	username: requireEnv("DB_USER"),
	password: requireEnv("DB_PASS"),
	database: requireEnv("DB_NAME"),
	entities: [User, VacationRequest],
	synchronize: true,
	logging: true,
});
