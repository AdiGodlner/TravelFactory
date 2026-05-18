<style scoped>
.vacation-row button {
	margin-top: var(--space-3);
	align-self: flex-start;
}
</style>

<template>
	<div class="layout-full">
		<h1>My Vacation Requests</h1>

		<p v-if="loading">Loading...</p>

		<p v-if="!loading && vacations.length === 0">No vacation requests yet.</p>
		<p v-if="fetchError" class="error">
			{{ fetchError }}
		</p>
		<ul class="vacation-list">
			<li v-for="v in vacations" :key="v.id" class="vacation-row">
				<div>
					<strong>{{ v.startDate }} → {{ v.endDate }}</strong>
				</div>

				<div>
					<p>Status: {{ v.status }}</p>
				</div>

				<div v-if="v.reason">
					<p>Reason: {{ v.reason }}</p>
				</div>

				<div v-if="v.comments">Comments: {{ v.comments }}</div>
				<button
					v-if="v.status === 'pending'"
					@click="remove(v.id)"
					class="danger-btn"
				>
					Delete request
				</button>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useVacationStore } from "../../stores/vacations";
import { getErrorMessage } from "../../utils/error";

const store = useVacationStore();

const vacations = computed(() => store.vacations);
const loading = computed(() => store.loading);
const fetchError = ref("");

onMounted(async () => {
	try {
		await store.fetchMyVacations();
	} catch {
		fetchError.value = "Error fetching vacation requests. Please refresh.";
	}
});

async function remove(id: string) {
	try {
		await store.remove(id);
	} catch (err: any) {
		alert(getErrorMessage(err, "Failed to delete vacation"));
	}
}
</script>
