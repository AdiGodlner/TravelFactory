import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";

const routes = [
	{ path: "/", component: LoginView },
	{
		path: "/requester",
		component: () => import("../views/RequesterView.vue"),
	},
	{
		path: "/validator",
		component: () => import("../views/ValidatorView.vue"),
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
