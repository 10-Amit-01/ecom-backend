import express from "express";

import { getProductSuggestions, getProduct, getProductById,getTrendingProducts } from "../controllers/productController.js";

const router = express.Router();

router.get('/suggestions', getProductSuggestions);
router.get('/search', getProduct);
router.get('/trending',getTrendingProducts)
router.get('/:id', getProductById);  

export default router;