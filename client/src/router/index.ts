import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";

import RequesterDashboard from "../views/requester/RequesterDashboard.vue";
import CreateVacationView from "../views/requester/CreateVacationView.vue";

import ValidatorDashboard from "../views/validator/ValidatorDashboard.vue";

import { useAuthStore } from "../stores/auth";

const router = createRouter({
	history: createWebHistory(),

	routes: [
		{
			path: "/",
			component: LoginView,
		},

		{
			path: "/requester",
			component: RequesterDashboard,
			meta: { role: "requester" },
		},

		{
			path: "/requester/create",
			component: CreateVacationView,
			meta: { role: "requester" },
		},

		{
			path: "/validator",
			component: ValidatorDashboard,
			meta: { role: "validator" },
		},
		{
			path: "/:pathMatch(.*)*",
			redirect: () => {
				const auth = useAuthStore();

				return auth.user ? `/${auth.user.role}` : "/";
			},
		},
	],
});

router.beforeEach((to, _from, next) => {
	const auth = useAuthStore();

	const requiredRole = to.meta.role;

	// public route
	if (!requiredRole) {
		next();
		return;
	}

	// not logged in
	if (!auth.user) {
		next("/");
		return;
	}

	// wrong role
	if (auth.user.role !== requiredRole) {
		next(`/${auth.user.role}`);
		return;
	}

	next();
});

export { router };
