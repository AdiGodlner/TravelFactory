import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

export function errorHandler(
	err: unknown,
	req: Request,
	res: Response,
	_next: NextFunction,
) {
	const isProd = env.NODE_ENV === "prod";
	console.log("in error handler");
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
