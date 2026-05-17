import request from "supertest";
import { app } from "../../src/app.js";

export async function login(name: string, role: "requester" | "validator") {
	const res = await request(app).post("/auth/login").send({ name, role });

	return {
		token: res.body.token,
		user: res.body.user,
	};
}
