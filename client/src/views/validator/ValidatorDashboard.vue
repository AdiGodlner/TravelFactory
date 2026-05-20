<style scoped>
h2 {
	margin-bottom: var(--space-10);
}

textarea {
	resize: vertical;
	min-height: 120px;
}
/* FILTERS */

.filters {
	display: flex;
	justify-content: center;
	gap: var(--space-5);
	padding: var(--space-6);
	flex-wrap: wrap;
	margin-bottom: var(--space-6);
}

.radio {
	display: flex;
	align-items: center;
	gap: var(--space-2);

	font-size: var(--font-md);
	color: var(--text);
}

/* ACTIONS */

.actions {
	display: flex;
	gap: var(--space-3);

	margin-top: var(--space-2);
}

/* modal */

.dialog-backdrop {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);

	display: flex;
	align-items: center;
	justify-content: center;
}

.dialog {
	background: var(--bg);
	padding: var(--space-12);
	border-radius: var(--radius-xl);
	border: 4px solid var(--danger);
	max-width: 500px;
	width: 100%;
}

.modal-actions {
	display: flex;
	gap: var(--space-3);

	margin-top: var(--space-10);
}
.cancel-btn {
	border: var(--border);
	background-color: var(--row-light);
}
.cancel-btn:hover {
	background-color: var(--row-dark);
}
</style>
<template>
	<div class="layout-full">
		<h1>Validator Dashboard</h1>
		<fieldset class="filters">
			<legend>Filter vacation requests by status</legend>
			<div class="radio">
				<input
					id="status-all"
					type="radio"
					value="all"
					v-model="statusFilter"
				/>
				<label for="status-all"> All </label>
			</div>
			<div class="radio">
				<input
					id="status-pending"
					type="radio"
					value="pending"
					v-model="statusFilter"
				/>
				<label for="status-pending"> Pending </label>
			</div>
			<div class="radio">
				<input
					id="status-approved"
					type="radio"
					value="approved"
					v-model="statusFilter"
				/>
				<label for="status-approved"> Approved </label>
			</div>

			<div class="radio">
				<input
					id="status-rejected"
					type="radio"
					value="rejected"
					v-model="statusFilter"
				/>
				<label for="status-rejected"> Rejected </label>
			</div>
		</fieldset>
		<p v-if="loading" role="status">Loading...</p>

		<div v-if="serverError" role="alert" class="error-summary summary">
			<p>{{ serverError }}</p>
		</div>
		<div
			v-if="vacationListUpdated"
			tabindex="-1"
			role="status"
			class="success-summary summary"
			ref="pageStatus"
		>
			<p>Vacation request updated</p>
		</div>

		<ul class="vacation-list">
			<li v-for="v in filteredVacations" :key="v.id" class="vacation-row">
				<div>
					<strong> {{ v.user?.name }} </strong>
				</div>

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
					<button @click="approve(v.id)" class="success-btn">Approve</button>

					<button @click="openRejectDialog(v.id, $event)" class="danger-btn">
						Reject
					</button>
				</div>

				<div v-if="v.comments">Comments: {{ v.comments }}</div>
			</li>
		</ul>
		<!-- reject modal -->
		<div
			v-if="rejectingId"
			ref="dialogRef"
			class="dialog-backdrop"
			role="dialog"
			aria-modal="true"
			aria-labelledby="reject-title"
			aria-describedby="reject-desc"
			@click.self="closeDialog()"
		>
			<div class="dialog layout-center">
				<h2 id="reject-title">Reject Vacation Request</h2>

				<div
					v-if="onRejectServerError"
					role="alert"
					class="error-summary summary"
				>
					<p>{{ onRejectServerError }}</p>
				</div>
				<div class="field">
					<label for="reject-comment" class="label">
						Rejection comment <span class="required">*</span>
					</label>
					<span
						role="alert"
						id="reject-error"
						class="error-message"
						v-if="!!rejectError"
					>
						{{ rejectError }}
					</span>
					<textarea
						ref="commentRef"
						id="reject-comment"
						v-model="rejectionComment"
						aria-describedby="reject-help reject-error"
						:class="{ invalid: !!rejectError }"
						@blur="isRejectCommentTouched = true"
					></textarea>

					<small id="reject-help"
						>Explain why this request is being rejected.
					</small>
				</div>

				<div class="modal-actions">
					<button @click="confirmReject" class="danger-btn">
						Confirm Reject
					</button>

					<button @click="closeDialog()" class="cancel-btn" type="button">
						Cancel
					</button>
				</div>
			</div>
		</div>
		<!-- reject modal -->
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount, nextTick } from "vue";
import { useVacationStore } from "../../stores/vacations";
import { getErrorMessage } from "../../utils/error";

type FocusTarget = "last" | "status";

const commentRef = ref<HTMLTextAreaElement | null>(null);
const lastFocusedElement = ref<HTMLElement | null>(null);
const pageStatus = ref<HTMLElement | null>(null);
const dialogRef = ref<HTMLElement | null>(null);

const isRejectCommentTouched = ref(false);
const rejectingId = ref<string | null>(null);
const rejectionComment = ref("");
const rejectError = computed(() => {
	console.log(rejectionComment.value.trim() === "");
	console.log("is touched");
	console.log(isRejectCommentTouched.value);

	if (!isRejectCommentTouched.value) {
		return "";
	}

	if (!rejectionComment.value.trim()) {
		return "Rejection comment is required";
	}
	return "";
});

const store = useVacationStore();

const vacations = computed(() => store.allVacations);
const loading = computed(() => store.loading);
const serverError = ref("");
const onRejectServerError = ref("");
const vacationListUpdated = ref(false);

const statusFilter = ref<"all" | "pending" | "approved" | "rejected">("all");

onMounted(async () => {
	// add onKeyDown listener for modal keyboard a11y
	window.addEventListener("keydown", onKeyDown);
	try {
		await store.fetchAllVacations();
	} catch {
		serverError.value = "Error fetching vacation requests. Please refresh.";
	}
});

onBeforeUnmount(() => {
	//  remove keydown listener
	window.removeEventListener("keydown", onKeyDown);
});

async function approve(id: string) {
	try {
		await store.updateStatus(id, "approved");
	} catch (err: any) {
		serverError.value = getErrorMessage(err, "Failed to approve request");
	}
}

const filteredVacations = computed(() => {
	if (statusFilter.value === "all") {
		return vacations.value;
	}

	return vacations.value.filter((v) => v.status === statusFilter.value);
});

function openRejectDialog(id: string, event?: Event) {
	lastFocusedElement.value = event?.currentTarget as HTMLElement;

	vacationListUpdated.value = false;
	rejectingId.value = id;
	rejectionComment.value = "";
	isRejectCommentTouched.value = false;
	onRejectServerError.value = "";

	nextTick(() => {
		commentRef.value?.focus();
	});
}

async function confirmReject() {
	if (!rejectingId.value) return;

	isRejectCommentTouched.value = true;

	if (rejectError.value) {
		return;
	}

	try {
		await store.updateStatus(
			rejectingId.value,
			"rejected",
			rejectionComment.value,
		);

		vacationListUpdated.value = true;
		closeDialog("status");
		rejectionComment.value = "";
	} catch (err: any) {
		onRejectServerError.value = getErrorMessage(
			err,
			"Failed to reject request",
		);
	}
}

function closeDialog(focusTarget: FocusTarget = "last") {
	rejectingId.value = null;
	nextTick(() => {
		if (focusTarget === "last" && lastFocusedElement.value) {
			lastFocusedElement.value.focus();
		} else {
			pageStatus.value?.focus();
		}
		lastFocusedElement.value = null;
	});
}
function onKeyDown(e: KeyboardEvent) {
	if (e.key === "Escape") {
		closeDialog();
	}

	if (e.key === "Tab") {
		const dialog = dialogRef.value;
		if (!dialog) return;

		const focusables = getFocusableElements(dialog);
		if (focusables.length === 0) return;

		const first = focusables[0];
		const last = focusables[focusables.length - 1];

		const active = document.activeElement as HTMLElement;

		if (e.shiftKey) {
			// Shift + Tab
			if (active === first) {
				e.preventDefault();
				last.focus();
			}
		} else if (active === last) {
			// Tab
			e.preventDefault();
			first.focus();
		}
	}
}

function getFocusableElements(el: HTMLElement) {
	return Array.from(
		el.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
		),
	).filter((el) => !el.hasAttribute("disabled"));
}
</script>
