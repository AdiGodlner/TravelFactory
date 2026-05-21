import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
	...vue.configs["flat/recommended"],
	...tseslint.configs.strictTypeChecked,
	prettier,

	{
		files: ["**/*.ts", "**/*.vue"],

		languageOptions: {
			parser: vueParser,

			parserOptions: {
				parser: tseslint.parser,
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: [".vue"],
			},
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
];
