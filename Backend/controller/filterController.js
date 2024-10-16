const Category = require("../models/Category");
const Product = require("../models/Product");

// Lọc theo size
const filterSize = async (req, res) => {
    const { sizeName } = req.body; // { size: "..." }
    try {
        // find() dùng để truy vấn mảng 'size' có ít nhất 1 phần tử với giá trị sizeName
        const productsHasSize = await Product.find({ size: sizeName }); 
        res.status(200).json({ productsHasSize });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
}

// Lọc theo thể loại
const filterCategory = async (req, res) => {
    const { categoryName } = req.body; // { name: "..." }
    try {
        const productsInCategory = await Category.find({ name: categoryName }).aggregate([
            {
                $lookup: {
                    from: "Product",
                    localField: "_id",
                    foreignField: "category",
                    as: "products"
                },
            },
        ]);
        res.status(200).json({ productsInCategory });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
};

// Lọc theo giá
const filterPrice = async (req, res) => {
    const { minPrice, maxPrice } = req.body; // { minPrice: 1, maxPrice: 9999 }
    try {
        const productsInPriceRange = await Product.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            }
        });
        res.status(200).json({ productsInPriceRange });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
}

module.exports = {
    filterSize,
    filterCategory,
    filterPrice
}