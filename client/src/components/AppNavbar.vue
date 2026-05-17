<style scoped>
nav {
	min-height: 60px;
	display: flex;
	align-items: center;

	justify-content: space-between;

	gap: 20px;

	padding: 0 24px;

	background: var(--surface);
	color: var(--text-on-surface);
}

nav a {
	padding: 8px 12px;
	font-size: 1rem;
	color: var(--text-on-surface);

	transition:
		background var(--transition-medium),
		opacity var(--transition-medium),
		transform var(--transition-fast);
}

nav a:hover {
	background: var(--hover-bg);
}

nav a.router-link-active {
	text-decoration: underline;
	font-weight: bold;
}

.nav-left,
.nav-right {
	display: flex;
	align-items: center;
	gap: 20px;
}
.nav-right button {
	background: rgba(255, 255, 255, 0.08);
	color: var(--text-on-surface);

	padding: 8px 14px;
	border-radius: 6px;

	transition:
		background var(--transition-medium),
		transform var(--transition-fast);
}
.nav-right button:hover {
	background: var(--hover-bg);
}
.nav-right button:active {
	transform: scale(1.1);
}
</style>
<template>
	<nav>
		<div class="nav-left">
			<router-link v-if="isRequester" to="/requester">
				My Vacations
			</router-link>

			<router-link v-if="isRequester" to="/requester/create">
				New Request
			</router-link>

			<router-link v-if="isValidator" to="/validator">
				Validator Dashboard
			</router-link>
		</div>
		<div class="nav-right">
			<button v-if="isLoggedIn" @click="handleLogout">Logout</button>
		</div>
	</nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

const isRequester = computed(() => auth.user?.role === "requester");

const isValidator = computed(() => auth.user?.role === "validator");
const isLoggedIn = computed(() => !!auth.user);

function handleLogout() {
	auth.logout();
	router.push("/");
}
</script>
