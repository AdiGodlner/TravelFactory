import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import { vacationService } from "../services/vacationService.js";
import { VacationStatus } from "../entities/vacationRequest.js";
import { assertString } from "../utils/utils.js";

export const vacationController = {
	async getAllVacations(req: AuthenticatedRequest, res: Response) {
		const data = await vacationService.getAll();
		res.json(data);
	},

	async getUserVacations(req: AuthenticatedRequest, res: Response) {
		const uid = req.user!.id;
		const data = await vacationService.getByUserId(uid);
		res.json(data);
	},

	async create(req: AuthenticatedRequest, res: Response) {
		const uid = req.user!.id;
		const { startDate, endDate, reason } = req.body;

		const result = await vacationService.create(
			uid,
			startDate,
			endDate,
			reason,
		);

		res.status(201).json(result);
	},

	async setVacationStatus(req: AuthenticatedRequest, res: Response) {
		const { id } = req.params;

		assertString(id, "Missing or invalid vacation id");
		const { status, comments: rawComments } = req.body;
		const comments = typeof rawComments === "string" ? rawComments : undefined;
		const result = await vacationService.setStatus(
			id,
			status as VacationStatus,
			comments,
		);

		res.json(result);
	},

	async delete(req: AuthenticatedRequest, res: Response) {
		const uid = req.user!.id;
		const { id } = req.params;
		assertString(id, "Missing or invalid vacation id");

		const result = await vacationService.delete(id, uid);

		res.json(result);
	},
};
