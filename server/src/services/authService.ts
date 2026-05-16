// services/authService.ts
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-src.js";
import { User } from "../entities/User.js";

const userRepo = AppDataSource.getRepository(User);

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function loginOrCreate(name: string) {
	let user = await userRepo.findOne({
		where: { name },
	});

	if (!user) {
		user = userRepo.create({ name });
		await userRepo.save(user);
	}

	const token = jwt.sign(
		{
			userId: user.id,
		},
		JWT_SECRET,
		{
			expiresIn: "7d",
		},
	);

	return token;
}
