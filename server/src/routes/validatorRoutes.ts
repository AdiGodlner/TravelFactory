import express from "express";
import {
	authenticate,
	requireValidator,
	type AuthenticatedRequest,
} from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { vacationController } from "../controllers/vacationController.js";

const router = express.Router();

// Get all vacation requests
router.get(
	"/vacations",
	authenticate,
	requireValidator,
	asyncHandler(vacationController.getAllVacations),
);

// Approve/reject vacation request
router.patch(
	"/vacations/:id",
	authenticate,
	requireValidator,
	asyncHandler(vacationController.setVacationStatus),
);

export default router;
