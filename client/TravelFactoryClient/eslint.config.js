import vue from "eslint-plugin-vue";
import tseslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-config-prettier";

export default [
	...vue.configs["flat/recommended"],
	prettier,
	{
		files: ["**/*.ts", "**/*.vue"],
		languageOptions: {
			parser,
		},
		plugins: {
			"@typescript-eslint": tseslint,
		},
		rules: {
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "warn",
		},
	},
];
