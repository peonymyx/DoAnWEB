const express = require("express");
const router = express.Router();
const {
  addComment,
  getComment,
  getCommentByProductId,
  deleteCommentByAuthor,
} = require("../controller/CommentController");
const { allowRole } = require("../middleware/middlewareController");

router.post("/addComment", allowRole(["admin", "nhanvien", "user"]), addComment);
router.get("/getComment", getComment);
router.get("/getCommentByProductId/:id", getCommentByProductId);
router.delete("/deleteCommentByAuthor/:id", deleteCommentByAuthor);

module.exports = router;
