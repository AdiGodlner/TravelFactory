import { api } from "./client";

export async function createVacation(data: {
	startDate: string;
	endDate: string;
	reason?: string;
}) {
	const res = await api.post("/user/vacations", data);
	return res.data;
}
