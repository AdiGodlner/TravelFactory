import { AppDataSource } from "../data-src.js";
import { User, UserRole } from "../entities/User.js";
import { AppError } from "../utils/AppError.js";

const userRepo = AppDataSource.getRepository(User);

export const authService = {
	async loginOrCreate(name: string, role: UserRole) {
		console.log("in login or create");
		const validRoles = Object.values(UserRole);

		if (!validRoles.includes(role)) {
			throw new AppError(`Role must be one of: ${validRoles.join(", ")}`, 400);
		}

		const existingUser = await userRepo.findOne({
			where: { name },
		});

		// user exists but role mismatch
		if (existingUser && existingUser.role !== role) {
			throw new AppError("User exists with different role", 403);
		}

		// user exists and role matches
		if (existingUser) {
			return existingUser;
		}

		// if user does not exist create new user
		const newUser = userRepo.create({
			name,
			role,
		});

		return await userRepo.save(newUser);
	},
};
