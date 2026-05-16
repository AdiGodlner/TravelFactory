import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
	js.configs.recommended,

	...tseslint.configs.recommended,

	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			globals: globals.node,
		},
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
		},
	},
]);
