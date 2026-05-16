import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export function errorHandler(
	err: unknown,
	req: Request,
	res: Response,
	_next: NextFunction,
) {
	const isProd = process.env.NODE_ENV === "production";

	let statusCode = 500;
	let message = "Internal Server Error";

	if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
	} else if (err instanceof Error) {
		message = err.message;
	}

	console.error(err);

	res.status(statusCode).json({
		message,
		...(isProd ? {} : { stack: err instanceof Error ? err.stack : undefined }),
	});
}
