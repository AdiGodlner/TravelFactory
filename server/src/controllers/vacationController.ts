import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware.js";

export const vacationController = {
	getAllvacations(req: AuthenticatedRequest, res: Response) {
		res.json({
			message: `All vacations `,
		});
	},

	getUserVacations(req: AuthenticatedRequest, res: Response) {
		console.log(" in get users vacations");

		res.json({
			message: `All vacations for user ${req.user?.id}`,
		});
	},

	create(req: AuthenticatedRequest, res: Response) {
		res.json({
			message: `Vacation created by user ${req.user?.id}`,
		});
	},

	setVacationStatus(req: AuthenticatedRequest, res: Response) {
		res.json({
			message: `Vacation ${req.params.id} updated`,
		});
	},

	delete(req: AuthenticatedRequest, res: Response) {
		res.json({
			message: `Vacation ${req.params.id} deleted`,
		});
	},
};
