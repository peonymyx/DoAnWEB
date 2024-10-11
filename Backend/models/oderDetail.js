const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otherDetailProductSchema = new Schema(
  {
    otherProduct_id: {
      type: Schema.Types.ObjectId,
      ref: "OtherProduct",
    },
    Product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
    },
    totalPrices: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const OtherDetailProduct = mongoose.model(
  "OtherDetailProduct",
  otherDetailProductSchema
);
module.exports = OtherDetailProduct;
