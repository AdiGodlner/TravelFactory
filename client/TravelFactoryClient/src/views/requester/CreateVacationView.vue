<style scoped>
.create-page {
	max-width: 520px;
	margin: 60px auto;

	padding: 24px;

	background: white;
	border: 1px solid var(--border);
	border-radius: 10px;
}

h1 {
	margin-bottom: 20px;
	font-size: 1.5rem;
}

.create-form {
	display: flex;
	flex-direction: column;
	gap: 14px;
}

.field {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

label {
	font-size: 0.9rem;
	color: var(--text-muted);
}

input,
textarea {
	padding: 10px;
	border: 1px solid var(--border);
	border-radius: 6px;

	font-size: 1rem;
	outline: none;
}

textarea {
	resize: vertical;
	min-height: 120px;
}
input:focus,
textarea:focus {
	border-color: var(--surface);
}

button {
	padding: 10px;
	border-radius: 6px;

	background: var(--surface);
	color: var(--text-on-surface);

	transition: background var(--transition-medium);
}

button:hover {
	background: var(--surface-soft);
}

button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

.error {
	color: var(--danger);
	font-size: 0.9rem;
}

.success {
	color: var(--success);
	font-size: 0.9rem;
}
</style>
<template>
	<div class="create-page">
		<h1>Create Vacation Request</h1>

		<form class="create-form" @submit.prevent="submit">
			<div class="field">
				<label>Start Date</label>
				<input v-model="startDate" type="date" required />
			</div>

			<div class="field">
				<label>End Date</label>
				<input v-model="endDate" type="date" required />
			</div>

			<div class="field">
				<label>Reason</label>
				<textarea v-model="reason"></textarea>
			</div>

			<button :disabled="loading">
				{{ loading ? "Submitting..." : "Submit" }}
			</button>

			<p v-if="error" class="error">{{ error }}</p>

			<p v-if="success" class="success">Vacation request created!</p>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useVacationStore } from "../../stores/vacations";
import { getErrorMessage } from "../../utils/error";

const store = useVacationStore();

const startDate = ref("");
const endDate = ref("");
const reason = ref("");

const loading = ref(false);
const error = ref("");
const success = ref(false);

async function submit() {
	error.value = "";
	success.value = false;

	if (!startDate.value || !endDate.value) {
		error.value = "Start and End date are required";
		return;
	}
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const start = new Date(startDate.value);
	start.setHours(0, 0, 0, 0);
	if (start < today) {
		error.value = "Start date cannot be in the past";
		return;
	}
	if (new Date(endDate.value) < start) {
		error.value = "End date must be after start date";
		return;
	}

	try {
		loading.value = true;

		await store.create({
			startDate: startDate.value,
			endDate: endDate.value,
			reason: reason.value || undefined,
		});
		// on success reset form
		startDate.value = "";
		endDate.value = "";
		reason.value = "";
		success.value = true;
	} catch (err: any) {
		error.value = getErrorMessage(err, "Failed to create request");
	} finally {
		loading.value = false;
	}
}
</script>
