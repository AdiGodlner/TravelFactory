<template>
	<div class="content-narrow layout-center">
		<h1>Login</h1>
		<!-- 1. Global Alert Area for Form-Wide Errors -->
		<div
			v-if="formError"
			class="error-summary"
			role="alert"
			aria-live="assertive"
		>
			{{ formError }}
		</div>
		<form @submit.prevent="handleLogin" class="form" novalidate>
			<div class="field">
				<label for="name" class="label"
					>Name <span class="required">*</span></label
				>
				<input
					v-model.trim="name"
					id="name"
					type="text"
					placeholder="e.g. bob"
					required
					autocomplete="username"
					:aria-invalid="!!displayNameError"
					aria-describedby="name-error"
					@blur="isNameTouched = true"
				/>
				<span
					id="name-error"
					class="error-message"
					:class="{ visible: !!displayNameError }"
					role="alert"
				>
					{{ displayNameError }}
				</span>
			</div>

			<div class="field">
				<label for="role" class="label"
					>Role <span class="required">*</span></label
				>
				<select v-model="role" id="role" required>
					<option value="requester">Requester</option>
					<option value="validator">Validator</option>
				</select>
				<!-- <small v-if="error.role" class="error">{{}}</small> -->
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
	// 2. If touched and left blank, show the immediate message
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
			router.push("/validator");
		} else {
			router.push("/requester");
		}
	} catch (err: any) {
		formError.value = getErrorMessage(
			err,
			"Login failed user exists with a different rolee",
		);
	} finally {
		loading.value = false;
	}
}
</script>
