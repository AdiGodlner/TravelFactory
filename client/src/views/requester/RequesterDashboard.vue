<style scoped>
.vacation-row button {
	margin-top: 8px;
	align-self: flex-start;

	padding: 6px 10px;
	border-radius: 6px;

	background: var(--danger);
	color: var(--text-on-surface);

	transition: background var(--transition-medium);
}
.vacation-row button:hover {
	background: var(--danger-hover);
}
.vacation-row button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
	background: var(--btn-disabled);
}
</style>

<template>
	<div class="dashboard">
		<h1>My Vacation Requests</h1>

		<p v-if="loading">Loading...</p>

		<p v-if="!loading && vacations.length === 0">
			No vacation requests yet.
		</p>
		<p v-if="fetchError" class="error">
			{{ fetchError }}
		</p>
		<ul class="vacation-list">
			<li v-for="v in vacations" :key="v.id" class="vacation-row">
				<div>
					<strong>{{ v.startDate }} → {{ v.endDate }}</strong>
				</div>

				<div>Status: {{ v.status }}</div>

				<div v-if="v.reason">Reason: {{ v.reason }}</div>

				<div v-if="v.comments">Comments: {{ v.comments }}</div>
				<button v-if="v.status === 'pending'" @click="remove(v.id)">
					Delete request
				</button>
				<!-- disabled state if request is not pending -->
				<button v-else disabled>Delete locked</button>
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
