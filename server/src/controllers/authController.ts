import type { Request, Response } from "express";
import { authService } from "../services/authService.js";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

export const authController = {
	async login(req: Request, res: Response) {
		const { name, role } = req.body ?? {};
		if (!name || !role) {
			throw new AppError("Name and role required", 400);
		}

		const user = await authService.loginOrCreate(name, role);

		const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
			expiresIn: "24h",
		});

		res.json({ token, user });
	},
};
