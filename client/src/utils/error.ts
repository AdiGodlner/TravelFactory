type ApiError = {
	response?: {
		data?: {
			message?: string;
		};
	};
	message?: string;
};
export function getErrorMessage(err: unknown, msg: string): string {
	if (typeof err === "object" && err !== null) {
		const e = err as ApiError;

		return e.response?.data?.message || e.message || msg;
	}

	if (err instanceof Error) {
		return err.message || msg;
	}

	return msg;
}
