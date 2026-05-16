import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
	// TODO replace with real login logic

	const fakeToken = "fake-jwt-token";

	res.json({
		token: fakeToken,
	});
});

export default router;
