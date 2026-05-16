import { defineStore } from "pinia";
import {
	getMyVacations,
	createVacation,
	deleteVacation,
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
		vacations: [] as Vacation[],
		loading: false,
	}),

	actions: {
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
	},
});
