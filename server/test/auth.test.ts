import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { beforeAll } from "vitest";
import { AppDataSource } from "../src/data-src.js";
import { login } from "./helpers/auth.js";

beforeAll(async () => {
	if (!AppDataSource.isInitialized) {
		await AppDataSource.initialize();
	}
});

beforeEach(async () => {
	await AppDataSource.query(`
		TRUNCATE TABLE
			vacation_requests,
			users
		RESTART IDENTITY CASCADE;
	`);
});

describe("Auth flow", () => {
	it("should login and return JWT + user", async () => {
		const res = await request(app).post("/auth/login").send({
			name: "testuser",
			role: "requester",
		});

		expect(res.status).toBe(200);

		expect(res.body.token).toBeDefined();

		expect(res.body.user).toBeDefined();
		expect(res.body.user.name).toBe("testuser");
		expect(res.body.user.role).toBe("requester");
	});

	it("should reject same user with different role", async () => {
		// first create user
		await login("test-user", "requester");
		// attempt same username with different role
		const res = await request(app).post("/auth/login").send({
			name: "test-user",
			role: "validator",
		});

		expect(res.status).toBe(403);
		expect(res.body.message).toBeDefined();
	});
});
