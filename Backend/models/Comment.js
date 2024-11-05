const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
