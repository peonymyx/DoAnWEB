const Product = require("../models/Product");
const Comment = require("../models/Comment");
const Order = require("../models/otherProduct");
const Users = require("../models/Users");
const OrderDetail = require("../models/oderDetail");

const statistical = async (req, res) => {
  try {
    const totalUsers = await Users.find({});
    const totalProducts = await Product.find({});
    const totalComments = await Comment.aggregate([
      {
        $group: {
          _id: {
            createdAt: {
              $dateToString: {
                format: "%d/%m/%Y",
                date: "$createdAt"
              }
            }
          },
          comments: { $sum: 1 }
        }
      }
    ]);
    const totalOrders = await Order.find({});
    const productSoldCounts = await Order.aggregate([
      { $unwind: "$cart" },
      { $group: {
          _id: "$cart.product_id",
          soldCount: { $sum: "$cart.quantity" }
        }
      }
    ]);
    const totalRevenue = (await OrderDetail.find({})).reduce((sum, current) => sum + current.totalPrices, 0);

    res.json({
      totalUsers:totalUsers.length,
      totalProducts:totalProducts.length,
      totalComments:totalComments,
      totalOrders:totalOrders.length,
      productSoldCounts:productSoldCounts,
      totalRevenue:totalRevenue
    }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  statistical
};
