const Comment = require("../models/Comment");
const product = require("../models/Product");
const addComment = async (req, res) => {
  const { user_id, product_id, content } = req.body;
  try {
    const Product = await product.findById(product_id);
    if (!Product) return res.status(400).json({ message: "Product not found" });
    const comment = new Comment({
      user_id,
      product_id,
      content,
    });
    await comment.save();
    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const comment = await Comment.find()
      .populate("user_id", "username")
      .populate("product_id");
    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommentByProductId = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.find({ product_id: id })
      .populate("user_id", "username")
      .populate("product_id");
    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCommentByAuthor = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.status(200).json({ comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getComment,
  getCommentByProductId,
  deleteCommentByAuthor,
};
