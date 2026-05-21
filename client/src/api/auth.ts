import type { User } from "../stores/auth";
import { api } from "./client";

export type LoginResponse = {
	token: string;
	user: User;
};

export async function login(name: string, role: string) {
	const res = await api.post<LoginResponse>("/auth/login", {
		name,
		role,
	});

	return res.data;
}
