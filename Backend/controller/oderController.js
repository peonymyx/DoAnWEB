const OtherProduct = require("../models/otherProduct");
const addOtherProduct = async (req, res) => {
  const { username, phone_number, address, note, cart, userId, status } =
    req.body;
  try {
    const otherProduct = new OtherProduct({
      username,
      phone_number,
      address,
      cart,
      note,
      userId,
      status,
      
    });
    await otherProduct.save();
    res.status(200).json({ otherProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOtherProduct = async (req, res) => {
  const queries = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queries[el]);
  let queryStr = JSON.stringify(queries);
  queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

  try {
    const otherProduct = await OtherProduct.find(JSON.parse(queryStr));
    res.status(200).json({ otherProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOtherById = async (req, res) => {
  try {
    const otherProduct = await OtherProduct.findById(req.params.id);
    res.status(200).json({ otherProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatusOder = async (req, res) => {
  try {
    const { id, status } = req.body;
    const otherProduct = await OtherProduct.findByIdAndUpdate(id, {
      status,
    });
    res.status(200).json({ otherProduct });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addOtherProduct,
  getOtherProduct,
  getOtherById,
  updateStatusOder,
};
