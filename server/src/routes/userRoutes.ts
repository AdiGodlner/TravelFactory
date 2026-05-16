import express from "express";

import {
	authenticate,
	type AuthenticatedRequest,
} from "../middleware/authMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { vacationController } from "../controllers/vacationController.js";

const router = express.Router();

// Get all vacations for current user
router.get(
	"/vacations",
	authenticate,
	asyncHandler(vacationController.getUserVacations),
);

// Create vacation request
router.post(
	"/vacations",
	authenticate,
	asyncHandler(vacationController.create),
);

// Delete vacation request
router.delete(
	"/vacations/:id",
	authenticate,
	asyncHandler(vacationController.delete),
);

export default router;
