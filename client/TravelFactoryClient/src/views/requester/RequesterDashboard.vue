<template>
	<div>
		<h1>My Vacation Requests</h1>

		<p v-if="loading">Loading...</p>

		<p v-if="!loading && vacations.length === 0">
			No vacation requests yet.
		</p>

		<ul>
			<li v-for="v in vacations" :key="v.id">
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
import { onMounted, computed } from "vue";
import { useVacationStore } from "../../stores/vacations";

const store = useVacationStore();

const vacations = computed(() => store.vacations);
const loading = computed(() => store.loading);

onMounted(() => {
	store.fetchMyVacations();
});

async function remove(id: string) {
	try {
		await store.remove(id);
	} catch (e: any) {
		alert(e?.response?.data?.message || "Failed to delete vacation");
	}
}
</script>
