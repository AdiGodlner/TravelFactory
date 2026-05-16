import type { Request, Response, NextFunction } from "express";
import { UserRole } from "../entities/User.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
	user?: {
		id: string;
		role: UserRole;
	};
}

export interface JwtPayload {
	sub: string;
	role: UserRole;
}

export function authenticate(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return next(new AppError("Missing authorization header", 401));
	}
	const [scheme, token] = authHeader.split(" ");
	// Authorization: Bearer <token>
	if (scheme !== "Bearer" || !token) {
		return next(new AppError("Invalid authorization format", 401));
	}

	try {
		const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

		req.user = {
			id: decoded.sub,
			role: decoded.role,
		};

		next();
	} catch {
		return next(new AppError("Invalid or expired token", 401));
	}
}

export function requireValidator(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) {
	if (req.user?.role !== UserRole.VALIDATOR) {
		return next(new AppError("Access denied", 403));
	}

	next();
}
