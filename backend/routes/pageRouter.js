import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../../frontend/pages/index.html"));
});

router.get("/changelog", (req, res) => {
	res.sendFile(path.join(__dirname, "../../frontend/pages/changelog.html"));
});

export default router;
