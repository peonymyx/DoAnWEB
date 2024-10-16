const OrderDetail = require("../models/oderDetail");

// Lấy và thống kê 3 sản phẩm bán chạy nhất theo thứ tự số lượng giảm dần
const bestSeller = async (req, res) => {
    try {
        const bestSellers = await OrderDetail.aggregate([
            {
                $group: {
                    _id: "$Product_id",
                    totalQuantity: { $sum: "$quantity" }
                },
                $sort: { totalQuantity: -1 },
                $limit: 3,
                $lookup: {
                    from: "Product",
                    localField: "Product_id",
                    foreignField: "_id",
                    as: "name"
                }
            }
        ]);
        res.status(200).json({ bestSellers });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
};

module.exports = {
    bestSeller
}