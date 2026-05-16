import { api } from "./client";

export async function getMyVacations() {
	const res = await api.get("/user/vacations");
	return res.data;
}

export async function createVacation(data: {
	startDate: string;
	endDate: string;
	reason?: string;
}) {
	const res = await api.post("/user/vacations", data);
	return res.data;
}

export async function deleteVacation(id: string) {
	const res = await api.delete(`/user/vacations/${id}`);
	return res.data;
}
