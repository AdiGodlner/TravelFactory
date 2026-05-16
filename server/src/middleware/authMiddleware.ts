import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
	user?: {
		id: number;
		role: string;
	};
}

export const authenticate = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	// TODO replace with real JWT parsing
	console.log(" in authenticate");
	req.user = {
		id: 1,
		role: "validator",
	};

	next();
};

export const requireValidator = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	console.log(" in validate");

	if (req.user?.role !== "validator") {
		return res.status(403).json({
			message: "Access denied",
		});
	}

	next();
};
