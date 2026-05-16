import express from "express";
import {
	authenticate,
	requireRole,
	type AuthenticatedRequest,
} from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { vacationController } from "../controllers/vacationController.js";
import { UserRole } from "../entities/User.js";

const router = express.Router();

// Get all vacation requests
router.get(
	"/vacations",
	authenticate,
	requireRole(UserRole.VALIDATOR),
	asyncHandler(vacationController.getAllVacations),
);

// Approve/reject vacation request
router.patch(
	"/vacations/:id",
	authenticate,
	requireRole(UserRole.VALIDATOR),
	asyncHandler(vacationController.setVacationStatus),
);

export default router;
