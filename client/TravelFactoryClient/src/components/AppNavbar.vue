<template>
	<nav>
		<router-link v-if="isRequester" to="/requester">
			My Vacations
		</router-link>

		<router-link v-if="isRequester" to="/requester/create">
			New Request
		</router-link>

		<router-link v-if="isValidator" to="/validator">
			Validator Dashboard
		</router-link>

		<button @click="handleLogout">Logout</button>
	</nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

const isRequester = computed(() => auth.user?.role === "requester");

const isValidator = computed(() => auth.user?.role === "validator");

function handleLogout() {
	auth.logout();
	router.push("/");
}
</script>
