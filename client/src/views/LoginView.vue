<template>
	<div class="content-narrow layout-center">
		<h1>Login</h1>
		<!-- 1. Global Alert Area for Form-Wide Errors -->
		<div
			v-if="formError"
			class="error-summary summary"
			role="alert"
			aria-live="assertive"
		>
			<p>{{ formError }}</p>
		</div>
		<form class="form" novalidate @submit.prevent="handleLogin">
			<div class="field">
				<label for="name" class="label"
					>Name <span class="required">*</span></label
				>
				<span
					v-if="!!displayNameError"
					id="name-error"
					class="error-message"
					role="alert"
				>
					{{ displayNameError }}
				</span>
				<input
					id="name"
					v-model.trim="name"
					type="text"
					placeholder="e.g. bob"
					:class="{ invalid: !!displayNameError }"
					required
					autocomplete="username"
					:aria-invalid="!!displayNameError"
					aria-describedby="name-error"
					@blur="isNameTouched = true"
				/>
			</div>

			<div class="field">
				<label for="role" class="label"
					>Role <span class="required">*</span></label
				>
				<select id="role" v-model="role" required>
					<option value="requester">Requester</option>
					<option value="validator">Validator</option>
				</select>
			</div>

			<button
				type="submit"
				:disabled="loading"
				:aria-busy="loading"
				class="submit-btn"
			>
				Login
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { getErrorMessage } from "../utils/error";

const isNameTouched = ref(false);
const formError = ref("");

const loading = ref(false);

const name = ref("");
const role = ref("requester");

const auth = useAuthStore();
const router = useRouter();
// A computed property to decide exactly when to render the error UI
const displayNameError = computed(() => {
	// If touched and left blank, show the immediate message
	if (isNameTouched.value && !name.value.trim()) {
		return "Name is required.";
	}

	return "";
});

async function handleLogin() {
	formError.value = "";
	loading.value = true;
	try {
		if (!name.value.trim()) {
			isNameTouched.value = true;
			// focus back to the invalid element
			document.getElementById("name")?.focus();
			return;
		}

		const user = await auth.login(name.value, role.value);

		// redirect based on role
		if (user.role === "validator") {
			void router.push("/validator");
		} else {
			void router.push("/requester");
		}
	} catch (err: unknown) {
		formError.value = getErrorMessage(
			err,
			"Login failed user exists with a different rolee",
		);
	} finally {
		loading.value = false;
	}
}
</script>
