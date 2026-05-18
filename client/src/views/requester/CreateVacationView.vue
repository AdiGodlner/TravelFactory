<style scoped>
textarea {
	resize: vertical;
	min-height: 120px;
}
</style>
<template>
	<div class="content-narrow layout-center">
		<h1>Create Vacation Request</h1>

		<form @submit.prevent="submit" class="form">
			<div class="field">
				<label class="label">Start Date</label>
				<input v-model="startDate" type="date" required />
			</div>

			<div class="field">
				<label class="label">End Date</label>
				<input v-model="endDate" type="date" required />
			</div>

			<div class="field">
				<label class="label">Reason</label>
				<textarea v-model="reason"></textarea>
			</div>

			<button :disabled="loading" class="submit-btn">
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

function toLocalDate(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

async function submit() {
	error.value = "";
	success.value = false;

	if (!startDate.value || !endDate.value) {
		error.value = "Start and End date are required";
		return;
	}
	// reset time to midnight same day
	const today = toLocalDate(new Date());
	const start = toLocalDate(new Date(startDate.value));

	if (start < today) {
		error.value = "Start date cannot be in the past";
		return;
	}
	if (toLocalDate(new Date(endDate.value)) < start) {
		error.value = "End date must be equal or after start date";
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
