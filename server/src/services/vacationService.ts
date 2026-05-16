import { AppDataSource } from "../data-src.js";
import {
	VacationRequest,
	VacationStatus,
} from "../entities/vacationRequest.js";
import { AppError } from "../utils/AppError.js";

const repo = AppDataSource.getRepository(VacationRequest);

export const vacationService = {
	async getAll() {
		return repo.find({
			relations: ["user"],
		});
	},

	async getByUserId(userId: string) {
		return repo.find({
			where: { userId },
			relations: ["user"],
		});
	},

	async create(
		userId: string,
		startDate: string,
		endDate: string,
		reason?: string,
	) {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const now = new Date();

		if (end <= start) {
			throw new AppError("End date must be after start date", 400);
		}

		if (start < now) {
			throw new AppError("Start date must be today or in the future", 400);
		}

		const vacation = repo.create({
			userId,
			startDate,
			endDate,
			reason: reason ?? null,
			status: VacationStatus.PENDING,
			comments: "",
		});

		return repo.save(vacation);
	},

	async setStatus(
		vacationId: string,
		status: VacationStatus,
		comments: string | undefined,
	) {
		const vacation = await repo.findOne({ where: { id: vacationId } });

		if (!vacation) {
			throw new AppError("Vacation not found", 404);
		}

		if (vacation.status !== VacationStatus.PENDING) {
			throw new AppError("Only pending requests can be updated", 400);
		}

		if (status === VacationStatus.REJECTED && !comments) {
			throw new AppError("Rejection requires a comment", 400);
		}

		vacation.status = status;
		vacation.comments = comments ?? vacation.comments;

		return repo.save(vacation);
	},

	async delete(vacationId: string, userId: string) {
		const vacation = await repo.findOne({ where: { id: vacationId } });

		if (!vacation) {
			throw new AppError("Vacation not found", 404);
		}

		if (vacation.userId !== userId) {
			throw new AppError("Not allowed", 403);
		}

		if (vacation.status !== VacationStatus.PENDING) {
			throw new AppError("Only pending requests can be deleted", 400);
		}

		await repo.remove(vacation);

		return { success: true };
	},
};
