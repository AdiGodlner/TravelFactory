import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { login } from "./helpers/auth.js";
import { AppDataSource } from "../src/data-src.js";
import { beforeEach } from "vitest";
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

describe("Vacations - requester", () => {
	it("should create a vacation request", async () => {
		const { token } = await login("req1", "requester");

		const res = await request(app)
			.post("/user/vacations")
			.set("Authorization", `Bearer ${token}`)
			.send({
				startDate: "2027-06-01",
				endDate: "2027-06-05",
				reason: "holiday",
			});

		expect(res.status).toBe(201);
		expect(res.body).toBeDefined();
	});

	it("should reject invalid date range", async () => {
		const { token } = await login("req2", "requester");

		const res = await request(app)
			.post("/user/vacations")
			.set("Authorization", `Bearer ${token}`)
			.send({
				startDate: "2026-06-10",
				endDate: "2026-06-01", // invalid
				reason: "bad",
			});

		expect(res.status).toBe(400);
	});

	it("should delete pending vacation", async () => {
		const { token } = await login("req3", "requester");

		// create
		const create = await request(app)
			.post("/user/vacations")
			.set("Authorization", `Bearer ${token}`)
			.send({
				startDate: "2026-06-01",
				endDate: "2026-06-05",
			});

		const id = create.body.id;

		// delete
		const res = await request(app)
			.delete(`/user/vacations/${id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
	});
	it("should fetch all vacations", async () => {
		const { token } = await login("val1", "validator");

		const res = await request(app)
			.get("/validator/vacations")
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(Array.isArray(res.body)).toBe(true);
	});
	it("should approve vacation", async () => {
		// 1. requester creates vacation
		const requester = await login("req-approve", "requester");

		const created = await request(app)
			.post("/user/vacations")
			.set("Authorization", `Bearer ${requester.token}`)
			.send({
				startDate: "2026-06-01",
				endDate: "2026-06-05",
			});

		const vacationId = created.body.id;

		// 2. validator approves it
		const validator = await login("val-approve", "validator");

		const res = await request(app)
			.patch(`/validator/vacations/${vacationId}`)
			.set("Authorization", `Bearer ${validator.token}`)
			.send({
				status: "approved",
			});

		expect(res.status).toBe(200);
	});

	it("should reject without comment fail", async () => {
		// create vacation
		const requester = await login("req-reject", "requester");

		const created = await request(app)
			.post("/user/vacations")
			.set("Authorization", `Bearer ${requester.token}`)
			.send({
				startDate: "2026-06-01",
				endDate: "2026-06-05",
			});

		const vacationId = created.body.id;

		// validator rejects WITHOUT comment
		const validator = await login("val-reject", "validator");

		const res = await request(app)
			.patch(`/validator/vacations/${vacationId}`)
			.set("Authorization", `Bearer ${validator.token}`)
			.send({
				status: "rejected",
			});

		expect(res.status).toBe(400);
	});
});
