<template>
	<div>
		<h1>Create Vacation Request</h1>

		<form @submit.prevent="submit">
			<div>
				<label>Start Date</label>
				<input v-model="startDate" type="date" required />
			</div>

			<div>
				<label>End Date</label>
				<input v-model="endDate" type="date" required />
			</div>

			<div>
				<label>Reason</label>
				<textarea v-model="reason"></textarea>
			</div>

			<button :disabled="loading">
				{{ loading ? "Submitting..." : "Submit" }}
			</button>

			<p v-if="error">{{ error }}</p>

			<p v-if="success">Vacation request created!</p>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useVacationStore } from "../../stores/vacations";
import { useRouter } from "vue-router";

const store = useVacationStore();
const router = useRouter();

const startDate = ref("");
const endDate = ref("");
const reason = ref("");

const loading = ref(false);
const error = ref("");
const success = ref(false);

async function submit() {
	error.value = "";
	success.value = false;
	loading.value = true;

	try {
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
	} catch (e: any) {
		error.value = e?.response?.data?.message || "Failed to create request";
	} finally {
		loading.value = false;
	}
}
</script>
