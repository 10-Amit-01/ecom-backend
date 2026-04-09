import Product from '../models/product.js';

export const getProductSuggestions = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword || keyword.length < 2) {
            return res.json([]);
        }

        const suggestions = await Product.find({
            $or: [
                { title: { $regex: `^${keyword}`, $options: "i" } },
                { brand: { $regex: `^${keyword}`, $options: "i" } },
                { category: { $regex: `^${keyword}`, $options: "i" } },
                { tags: { $regex: `^${keyword}`, $options: "i" } }
            ],
            isActive: true
        })
            .limit(8)
            .select("title -_id");

        res.json(suggestions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProduct = async (req, res) => {
    try {
        const { keyword, limit = 10, page = 1 } = req.query;
        const products = await Product.find({
            $or: [
                { title: { $regex: `^${keyword}`, $options: "i" } },
                { brand: { $regex: `^${keyword}`, $options: "i" } },
                { category: { $regex: `^${keyword}`, $options: "i" } },
                { tags: { $regex: `^${keyword}`, $options: "i" } }
            ],
        }).limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}