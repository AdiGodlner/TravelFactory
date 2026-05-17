import { api } from "./client";

// requester requests
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

// Validator requests
export async function getAllVacations() {
	const res = await api.get("/validator/vacations");
	return res.data;
}

export async function setVacationStatus(
	id: string,
	data: { status: "approved" | "rejected"; comments?: string },
) {
	const res = await api.patch(`/validator/vacations/${id}`, data);

	return res.data;
}
