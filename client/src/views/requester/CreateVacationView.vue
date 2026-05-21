<template>
	<div class="content-narrow layout-center">
		<h1>Create Vacation Request</h1>
		<div v-if="error" role="alert" class="error-summary summary">
			<p>{{ error }}</p>
		</div>
		<div
			v-if="success"
			ref="pageStatus"
			class="success-summary summary"
			role="status"
			tabindex="-1"
		>
			<p>Vacation request created!</p>
		</div>
		<form class="form" novalidate @submit.prevent="submit">
			<div class="field">
				<label class="label" for="start-date"
					>Start Date <span class="required">*</span>
				</label>
				<span
					v-if="!!startDateError"
					id="start-date-error"
					role="alert"
					class="error-message"
				>
					{{ startDateError }}
				</span>
				<input
					id="start-date"
					ref="startDateRef"
					v-model="startDate"
					type="date"
					required
					:class="{ invalid: startDateError }"
					:min="minStartDate"
					:aria-invalid="!!startDateError"
					:aria-describedby="startDateError ? 'start-date-error' : undefined"
					@blur="isStartDateTouched = true"
				/>
			</div>

			<div class="field">
				<label class="label" for="end-date"
					>End Date <span class="required">*</span>
				</label>
				<span
					v-if="!!endDateError"
					id="end-date-error"
					role="alert"
					class="error-message"
				>
					{{ endDateError }}
				</span>
				<input
					id="end-date"
					ref="endDateRef"
					v-model="endDate"
					type="date"
					required
					:class="{ invalid: endDateError }"
					:min="minEndDate"
					:aria-invalid="!!endDateError"
					:aria-describedby="endDateError ? 'end-date-error' : undefined"
					@blur="isEndDateTouched = true"
				/>
			</div>

			<div class="field">
				<label class="label" for="reason"
					>Reason <span class="optional">( Optional )</span>
				</label>
				<textarea
					id="reason"
					v-model="reason"
					aria-describedby="reason-help"
				></textarea>
				<small id="reason-help">
					Add a short explanation for your request.
				</small>
			</div>

			<button
				:disabled="loading"
				type="submit"
				:aria-busy="loading"
				class="submit-btn"
			>
				{{ loading ? "Submitting..." : "Submit" }}
			</button>
		</form>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { useVacationStore } from "../../stores/vacations";
import { getErrorMessage } from "../../utils/error";

const store = useVacationStore();

const startDateRef = ref<HTMLInputElement | null>(null);
const endDateRef = ref<HTMLInputElement | null>(null);
const pageStatus = ref<HTMLElement | null>(null);

const isStartDateTouched = ref(false);
const isEndDateTouched = ref(false);

const startDate = ref("");
const endDate = ref("");
const reason = ref("");

const minStartDate = computed(() => {
	return toLocalDateString(new Date());
});

const minEndDate = computed(() => {
	return startDate.value || toLocalDateString(new Date());
});

const startDateError = computed(() => {
	if (!isStartDateTouched.value) {
		return "";
	}
	if (!startDate.value) {
		return "Start date is required";
	}
	if (toLocalDate(new Date(startDate.value)) < toLocalDate(new Date())) {
		return "Start date cannot be in the past";
	}
	return "";
});

const endDateError = computed(() => {
	if (!isEndDateTouched.value) {
		return "";
	}
	if (!endDate.value) {
		return "end date is required";
	}
	const today = toLocalDate(new Date());
	const end = toLocalDate(new Date(endDate.value));

	if (end < today) {
		return "End date cannot be in the past";
	}

	if (startDate.value) {
		const start = toLocalDate(new Date(startDate.value));

		if (end < start) {
			return "End date must be after start date";
		}
	}
	return "";
});

const loading = ref(false);
const error = ref("");
const success = ref(false);

const isFormValid = computed(() => {
	return (
		!startDateError.value &&
		!endDateError.value &&
		startDate.value &&
		endDate.value
	);
});

const checkErrorString = "Please fix the highlighted errors";

watch(isFormValid, (valid) => {
	if (valid && error.value === checkErrorString) {
		error.value = "";
	}
});

function toLocalDate(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function toLocalDateString(date: Date) {
	const year = String(date.getFullYear());
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}
async function submit() {
	error.value = "";
	success.value = false;
	isStartDateTouched.value = true;
	isEndDateTouched.value = true;

	if (!isFormValid.value) {
		error.value = checkErrorString;
		const target = startDateError.value
			? startDateRef.value
			: endDateError.value
				? endDateRef.value
				: null;

		target?.focus();
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

		error.value = "";
		success.value = true;

		isEndDateTouched.value = false;
		isStartDateTouched.value = false;
		// return focus to the top of the form for convince
		void nextTick(() => {
			pageStatus.value?.focus();
		});
	} catch (err: unknown) {
		error.value = getErrorMessage(err, "Failed to create request");
	} finally {
		loading.value = false;
	}
}
</script>

<style scoped>
.optional {
	color: var(--text-muted);
	font-weight: normal;
}
textarea {
	resize: vertical;
	min-height: 120px;
}
</style>
