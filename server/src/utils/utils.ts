import { AppError } from "./AppError.js";

export function assertString(
	value: unknown,
	message: string,
): asserts value is string {
	if (typeof value !== "string" || value.length === 0) {
		throw new AppError(message, 400);
	}
}
