import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async Express route handlers so errors are forwarded to Express error middleware.
 */
export function asyncHandler(
	fn: (
		req: Request,
		res: Response,
		next: NextFunction,
	) => Promise<unknown> | unknown,
): RequestHandler {
	return function wrappedHandler(
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}
