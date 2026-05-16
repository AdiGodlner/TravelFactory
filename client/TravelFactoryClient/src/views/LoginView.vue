<template>
	<div>
		<h2>Login</h2>

		<input v-model="name" placeholder="Name" />

		<select v-model="role">
			<option value="requester">Requester</option>
			<option value="validator">Validator</option>
		</select>

		<button @click="handleLogin">Login</button>
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
