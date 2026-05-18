<style scoped>
/* FILTERS */

.filters {
	display: flex;
	justify-content: center;
	gap: 18px;
	flex-wrap: wrap;
	margin-bottom: 24px;
}

.filters label {
	display: flex;
	align-items: center;
	gap: 6px;

	font-size: var(--font-md);
	color: var(--text);
}

/* ACTIONS */

.actions {
	display: flex;
	gap: 10px;

	margin-top: 8px;
}

/* BUTTONS */

.actions button {
	padding: 7px 12px;

	border-radius: var(--radius-md);

	color: var(--text-on-surface);
}

/* approve */

.approve-btn {
	background: var(--surface);
}

.approve-btn:hover {
	background: var(--surface-soft);
}

/* reject */

.reject-btn {
	background: var(--danger);
}

.reject-btn:hover {
	background: var(--danger-hover);
}

/* press effect */
.actions button:active {
	transform: scale(0.98);
}
</style>
<template>
	<div class="dashboard">
		<h1>Validator Dashboard</h1>

		<div class="filters">
			<label>
				<input type="radio" value="all" v-model="statusFilter" />
				All
			</label>

			<label>
				<input type="radio" value="pending" v-model="statusFilter" />
				Pending
			</label>

			<label>
				<input type="radio" value="approved" v-model="statusFilter" />
				Approved
			</label>

			<label>
				<input type="radio" value="rejected" v-model="statusFilter" />
				Rejected
			</label>
		</div>
		<p v-if="loading">Loading...</p>

		<p v-if="fetchError" class="error">
			{{ fetchError }}
		</p>

		<ul class="vacation-list">
			<li v-for="v in filteredVacations" :key="v.id" class="vacation-row">
				<div>
					<strong> {{ v.startDate }} → {{ v.endDate }} </strong>
				</div>

				<div>
					<p>Status: {{ v.status }}</p>
				</div>

				<div v-if="v.reason">
					<p>Reason: {{ v.reason }}</p>
				</div>

				<!-- ACTIONS ONLY FOR PENDING -->
				<div v-if="v.status === 'pending'" class="actions">
					<button @click="approve(v.id)" class="approve-btn">Approve</button>

					<button @click="reject(v.id)" class="reject-btn">Reject</button>
				</div>

				<div v-if="v.comments">Comments: {{ v.comments }}</div>
			</li>
		</ul>
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useVacationStore } from "../../stores/vacations";
import { getErrorMessage } from "../../utils/error";

const store = useVacationStore();

const vacations = computed(() => store.allVacations);
const loading = computed(() => store.loading);
const fetchError = ref("");

const statusFilter = ref<"all" | "pending" | "approved" | "rejected">("all");

onMounted(async () => {
	try {
		await store.fetchAllVacations();
	} catch {
		fetchError.value = "Error fetching vacation requests. Please refresh.";
	}
});

async function approve(id: string) {
	try {
		await store.updateStatus(id, "approved");
	} catch (err: any) {
		alert(getErrorMessage(err, "Failed to approve request"));
	}
}

async function reject(id: string) {
	try {
		const comment = prompt("Enter rejection comment:");

		if (!comment) return;

		await store.updateStatus(id, "rejected", comment);
	} catch (err: any) {
		alert(getErrorMessage(err, "Failed to reject request"));
	}
}

const filteredVacations = computed(() => {
	if (statusFilter.value === "all") {
		return vacations.value;
	}

	return vacations.value.filter((v) => v.status === statusFilter.value);
});
</script>
