import express from "express";
import { createQuote, getQuotes } from "../controllers/quoteController.js"; // Note the .js extension

const router = express.Router();

router.post("/", createQuote);
router.get("/", getQuotes);

export default router;