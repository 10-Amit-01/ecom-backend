import express from "express";

import { getProductSuggestions, getProduct } from "../controllers/productController.js";

const router = express.Router();

router.get('/suggestions', getProductSuggestions);
router.get('/search', getProduct);

export default router;