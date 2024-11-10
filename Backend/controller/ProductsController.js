const product = require("../models/Product");
const order = require("../models/otherProduct");
const mongoose = require('mongoose'); 

const addProduct = async (req, res) => {
  console.log(req.body);
  const { name, description, size, category, price,  image, discount} = req.body;
  try {
    const Product = new product({
      name,
      description,
      size,
      category: new mongoose.Types.ObjectId(category),
      image,
      price,
      discount, 
    });
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }
    await Product.save();
    // update Storage

    res.status(200).json({ Product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  const queries = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queries[el]);
  let queryStr = JSON.stringify(queries);
  queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

  try {

    const Product = await product.find(JSON.parse(queryStr));
    const productsWithFinalInfo = Product.map((product) => {
      const finalPrice = product.price * (1 - product.discount / 100); // Example calculation
      return { ...product.toObject(), finalPrice };
    });
    
    res.status(200).json({ Product: productsWithFinalInfo  });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const Product = await product.findByIdAndDelete(id);
    res.status(200).json({ Product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  // neu khong co image thi lay image cu
  let image = req.file ? req.file.path : req.body.image;
  const { name, description, size, category, price, discount } = req.body;
  try {
    const Product = await product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        size,
        category,
        price,
        image,
        discount,
      },
      { new: true }
    );
    res.status(200).json({ Product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const Product = await product.findById(id);
    res.status(200).json({ Product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSoldCount = async (req, res) => {
  const { id } = req.params;
  try {
    const soldCount = await order.aggregate([
      { $match: {
        $and: [
          { "cart.product_id": id },
          { "status": {
            $in: ["Đã hoàn thành", "Đã thanh toán"]
          } }
        ] 
      } }, // Lấy order mà cart có ít nhất một sản phẩm trùng id
      { $unwind: "$cart" }, // Tách mảng để trả nhiều document
      { $group: {
          _id: "$cart.product_id",
          quantity: { $sum: "$cart.quantity" }
        }
      } // Cộng gộp số lượng theo id sản phẩm
    ]);
    const Product = product.findByIdAndUpdate(id, { soldCount });
    res.status(200).json({ Product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getDiscountedProducts = async (req, res) => {
  try {
    // Fetch top 3 products with a discount greater than 0
    const products = await product.find({ discount: { $gt: 0 } })
    .sort({ discount: -1 }) // Sort by discount in descending order
    .limit(5); // Limit to 3 products


    console.log("Số lượng sản phẩm tìm thấy:", products.length);

    // Add final price and any other final information
    const productsWithFinalInfo = products.map((product) => {
      const finalPrice = product.price * (1 - product.discount / 100); // Calculate final price based on discount
      return { ...product.toObject(), finalPrice };
    });

    res.status(200).json({ products: productsWithFinalInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = {
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  updateSoldCount,
  getDiscountedProducts
};
