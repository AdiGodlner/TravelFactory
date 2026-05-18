<style scoped>
.login-page {
	padding: var(--space-6);
}
.login-card {
	width: 100%;
	max-width: 420px;

	display: flex;
	flex-direction: column;
	gap: var(--space-5);

	padding: var(--space-8);

	background: var(--row-light);

	border: 1px solid var(--border);
	border-radius: var(--radius-lg);

	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

h2 {
	text-align: center;
	margin-bottom: var(--space-2);
}
</style>
<template>
	<div class="login-page layout-center">
		<div class="login-card">
			<h2>Login</h2>
			<form @submit.prevent="handleLogin" class="form">
				<div class="field">
					<label for="name" class="label">Name</label>
					<input v-model="name" placeholder="Name" />
				</div>
				<div class="field">
					<label for="role" class="label">Role</label>
					<select v-model="role">
						<option value="requester">Requester</option>
						<option value="validator">Validator</option>
					</select>
				</div>

				<p v-if="error" class="error">
					{{ error }}
				</p>

				<button type="submit" :disabled="loading" class="submit-btn">
					Login
				</button>
			</form>
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
