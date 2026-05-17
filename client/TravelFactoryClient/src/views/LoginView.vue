<style scoped>
.login-page {
	display: flex;
	justify-content: center;
	align-items: center;

	min-height: calc(100vh - 160px);

	padding: 24px;
}

.login-card {
	width: 100%;
	max-width: 420px;

	display: flex;
	flex-direction: column;
	gap: 16px;

	padding: 28px;

	background: white;

	border: 1px solid var(--border);
	border-radius: 10px;

	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

h2 {
	text-align: center;
	margin-bottom: 8px;
}

input,
select {
	padding: 10px 12px;

	border: 1px solid var(--border);
	border-radius: 6px;

	font-size: 1rem;

	outline: none;

	transition:
		border-color var(--transition-medium),
		background var(--transition-medium);
}

input:focus,
select:focus {
	border-color: var(--surface-soft);
}

button {
	padding: 10px 14px;

	border-radius: 6px;

	background: var(--surface);
	color: var(--text-on-surface);

	transition:
		background var(--transition-medium),
		transform var(--transition-fast);
}

button:hover {
	background: var(--surface-soft);
}

button:active {
	transform: scale(0.98);
}
</style>
<template>
	<div class="login-page">
		<div class="login-card">
			<h2>Login</h2>

			<input v-model="name" placeholder="Name" />

			<select v-model="role">
				<option value="requester">Requester</option>
				<option value="validator">Validator</option>
			</select>

			<button @click="handleLogin">Login</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const name = ref("");
const role = ref("requester");

const auth = useAuthStore();
const router = useRouter();

async function handleLogin() {
	if (!name.value) return;

	const user = await auth.login(name.value, role.value);

	// redirect based on role
	if (user.role === "validator") {
		router.push("/validator");
	} else {
		router.push("/requester");
	}
}
</script>
