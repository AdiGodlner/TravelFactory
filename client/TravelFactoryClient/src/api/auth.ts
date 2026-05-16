import { api } from "./client";

export async function login(name: string, role: string) {
	const res = await api.post("/auth/login", {
		name,
		role,
	});

	return res.data;
}
