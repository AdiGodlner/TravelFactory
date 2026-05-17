import { defineStore } from "pinia";
import {
	getMyVacations,
	createVacation,
	deleteVacation,
	getAllVacations,
	setVacationStatus,
} from "../api/vacations";
export type VacationStatus = "pending" | "approved" | "rejected";

export type Vacation = {
	id: string;
	startDate: string;
	endDate: string;
	reason?: string;
	status: VacationStatus;
	comments?: string;
};

export const useVacationStore = defineStore("vacations", {
	state: () => ({
		allVacations: [] as Vacation[],
		vacations: [] as Vacation[],
		loading: false,
	}),

	actions: {
		// requester requests
		async fetchMyVacations() {
			this.loading = true;

			try {
				this.vacations = await getMyVacations();
			} finally {
				this.loading = false;
			}
		},

		async create(payload: {
			startDate: string;
			endDate: string;
			reason?: string;
		}) {
			this.loading = true;

			try {
				const res = await createVacation(payload);
				return res;
			} finally {
				this.loading = false;
			}
		},

		async remove(id: string) {
			await deleteVacation(id);

			this.vacations = this.vacations.filter((v) => v.id !== id);
		},

		// validator requests
		async fetchAllVacations() {
			this.loading = true;

			try {
				this.allVacations = await getAllVacations();
			} finally {
				this.loading = false;
			}
		},

		async updateStatus(
			id: string,
			status: "approved" | "rejected",
			comments?: string,
		) {
			const updated = await setVacationStatus(id, {
				status,
				comments,
			});

			// update local state
			const index = this.allVacations.findIndex((v) => v.id === id);

			if (index !== -1) {
				this.allVacations[index] = updated;
			}
		},
	},
});
