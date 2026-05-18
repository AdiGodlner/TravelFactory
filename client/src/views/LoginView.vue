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

	background: var(--row-light);

	border: 1px solid var(--border);
	border-radius: var(--radius-lg);

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
	border-radius: var(--radius-md);

	font-size: var(--font-md);
}

button {
	padding: 10px 14px;

	border-radius: var(--radius-md);

	background: var(--surface);
	color: var(--text-on-surface);
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
			<p v-if="error" class="error">
				{{ error }}
			</p>
			<button @click="handleLogin" :disabled="loading">Login</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { getErrorMessage } from "../utils/error";

const error = ref("");
const loading = ref(false);

const name = ref("");
const role = ref("requester");

const auth = useAuthStore();
const router = useRouter();

async function handleLogin() {
	error.value = "";
	loading.value = true;
	try {
		if (!name.value) {
			error.value = "Name is required";
			return;
		}

		const user = await auth.login(name.value, role.value);

		// redirect based on role
		if (user.role === "validator") {
			router.push("/validator");
		} else {
			router.push("/requester");
		}
	} catch (err: any) {
		error.value = getErrorMessage(
			err,
			"Login failed user exists with a different rolee",
		);
	} finally {
		loading.value = false;
	}
}
</script>
