const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      minlength: 3,
    },
    size: {
      type: Array,
      required: true,
    },
    image: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    price: {
      type: Number,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    discount: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

productSchema.methods.getFinalPrice = function() {
  let finalPrice = this.price;
  if (this.discountType === 'percentage') {
    finalPrice = this.price - (this.price * (this.discount / 100));
  } else if (this.discountType === 'fixed') {
    finalPrice = this.price - this.discount;
  }
  return finalPrice > 0 ? finalPrice : 0;
};


const product = mongoose.model("Product", productSchema);
module.exports = product;
