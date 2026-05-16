function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Missing env: ${name}`);
	}
	return value;
}

export const env = {
	PORT: requireEnv("PORT"),
	JWT_SECRET: requireEnv("JWT_SECRET"),

	DB_HOST: requireEnv("DB_HOST"),
	DB_PORT: Number(requireEnv("DB_PORT")),
	DB_USER: requireEnv("DB_USER"),
	DB_PASSWORD: requireEnv("DB_PASSWORD"),
	DB_NAME: requireEnv("DB_NAME"),

	NODE_ENV: requireEnv("NODE_ENV"),
};
