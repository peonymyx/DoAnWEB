// controller/bestSellerController.js
const Product = require("../models/Product");

const bestSeller = async (req, res) => {
    try {
        // Thêm console.log để debug
        console.log("Fetching best sellers...");
        
        const products = await Product.find()
            .sort({ soldCount: -1 })
            .limit(4);
            
        // Log số lượng sản phẩm tìm được
        console.log("Found products:", products);

        // Kiểm tra nếu không có sản phẩm
        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm nào"
            });
        }

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        // Log chi tiết lỗi
        console.error("Error in bestSeller:", error);
        
        res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi lấy danh sách sản phẩm bán chạy",
            error: error.message // Thêm chi tiết lỗi
        });
    }
};

module.exports = { bestSeller };