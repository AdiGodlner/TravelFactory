import { defineStore } from "pinia";
import { createVacation } from "../api/vacations";

export const useVacationStore = defineStore("vacations", {
	state: () => ({
		loading: false,
	}),

	actions: {
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
	},
});
