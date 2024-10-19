const product = require("../models/Product");
const mongoose = require('mongoose'); 

const addProduct = async (req, res) => {
  const image = req.file.path;
  console.log(req.body);
  const { name, description, size, category, price } = req.body;
  try {
    const Product = new product({
      name,
      description,
      size,
      category: new mongoose.Types.ObjectId(category),
      image,
      price,
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
    res.status(200).json({ Product });
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
  const { name, description, size, category, price } = req.body;
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

module.exports = {
  addProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  getProductById,
};
