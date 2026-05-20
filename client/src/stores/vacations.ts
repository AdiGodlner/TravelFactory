import { defineStore } from "pinia";
import {
	getMyVacations,
	createVacation,
	deleteVacation,
	getAllVacations,
	setVacationStatus,
} from "../api/vacations";
import type { User } from "./auth";
export type VacationStatus = "pending" | "approved" | "rejected";

export type Vacation = {
	id: string;
	startDate: string;
	endDate: string;
	reason?: string;
	status: VacationStatus;
	comments?: string;
	user?: User;
};

export const useVacationStore = defineStore("vacations", {
	state: () => ({
		allVacations: [] as Vacation[],
		vacations: [] as Vacation[],
		loading: false,
		loaded: false,
	}),

	actions: {
		// requester requests
		async fetchMyVacations() {
			if (this.loading || this.loaded) {
				//  prevent race conditions
				// and only fetch on first load otherwise manage in store
				return;
			}

			this.loading = true;

			try {
				this.vacations = await getMyVacations();
				this.loaded = true;
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
				const newVacation = await createVacation(payload);
				this.vacations.unshift(newVacation);
				return newVacation;
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
