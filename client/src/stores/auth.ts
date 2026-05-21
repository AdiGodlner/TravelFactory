import { defineStore } from "pinia";
import { login as loginApi } from "../api/auth";
import { useVacationStore } from "./vacations";

export type User = {
	id: string;
	name?: string;
	role: "requester" | "validator";
};

export const useAuthStore = defineStore("auth", {
	state: () => ({
		token: localStorage.getItem("token"),

		user: JSON.parse(localStorage.getItem("user") || "null") as User | null,
	}),
	getters: {
		isAuthenticated: (state) => !!state.token,
	},
	actions: {
		setAuth(token: string, user: User) {
			this.token = token;
			this.user = user;

			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));
		},

		async login(name: string, role: string) {
			const data = await loginApi(name, role);

			this.setAuth(data.token, data.user);

			return data.user;
		},

		logout() {
			this.token = null;
			this.user = null;
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			// remove user saved data from store when logging out

			const store = useVacationStore();
			store.$reset();
		},
	},
});
