<style scoped>
.app-shell {
	min-height: 100dvh;
	display: flex;
	flex-direction: column;
	background: var(--bg);
}

/* MAIN CONTENT takes remaining space */
.main {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: var(--space-6);
}

.footer {
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;

	font-size: var(--font-sm);
	color: var(--text-on-surface);
	background: var(--surface-soft);
	border-top: 1px solid var(--border);
}
</style>
<template>
	<div class="app-shell">
		<AppNavbar />
		<main class="main">
			<router-view />
		</main>
		<footer class="footer">
			<span>this is the end of the page</span>
		</footer>
	</div>
</template>

<script setup lang="ts">
import AppNavbar from "./components/AppNavbar.vue";
</script>
