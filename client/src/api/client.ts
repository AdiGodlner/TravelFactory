import axios from "axios";
import { useAuthStore } from "../stores/auth";

export const api = axios.create({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
	const auth = useAuthStore();

	if (auth.token) {
		config.headers.Authorization = `Bearer ${auth.token}`;
	}

	return config;
});
