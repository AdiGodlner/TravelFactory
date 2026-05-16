import { defineStore } from "pinia";
import { login as loginApi } from "../api/auth";

type User = {
	id: string;
	role: "requester" | "validator";
};

export const useAuthStore = defineStore("auth", {
	state: () => ({
		token: null as string | null,
		user: null as User | null,
	}),

	actions: {
		setAuth(token: string, user: User) {
			this.token = token;
			this.user = user;
		},

		async login(name: string, role: string) {
			const data = await loginApi(name, role);

			this.setAuth(data.token, data.user);

			return data.user;
		},

		logout() {
			this.token = null;
			this.user = null;
		},
	},
});
