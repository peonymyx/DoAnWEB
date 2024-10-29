import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../redux/productSlice";
import {
  addComment,
  deleteCommentByAuthor,
  getCommentByProductId,
} from "../redux/commentSlice";
import { addToCart } from "../redux/cartSlice";
import axios from "axios";
import { AlertCircle, Heart, ShoppingCart } from "lucide-react";
import Cookies from "js-cookie";

const ProductsDetail = () => {
  const [comment, setComment] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector((state) => state.product.products);
  const auth = useSelector((state) => state.auth);
  const userId = auth.currentUser?._id;
  const commentList = useSelector((state) => state.comment.comment);

  useEffect(() => {
    dispatch(getProductById(id));
    dispatch(getCommentByProductId(id));
  }, [id, dispatch]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (!token || !auth.currentUser) {
      setError("Vui lòng đăng nhập để bình luận");
      navigate("/login");
      return;
    }

    const data = {
      user_id: auth.currentUser._id,
      product_id: id,
      content: comment,
    };

    try {
      await dispatch(addComment(data)).unwrap();
      setComment("");
      setError("");
      dispatch(getCommentByProductId(id));
    } catch (error) {
      console.error("Failed to add comment:", error);
      setError("Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = Cookies.get("token");
    if (!token) {
      setError("Vui lòng đăng nhập để xóa bình luận");
      navigate("/login");
      return;
    }

    try {
      await dispatch(deleteCommentByAuthor(commentId)).unwrap();
      dispatch(getCommentByProductId(id));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      setError("Có lỗi xảy ra khi xóa bình luận. Vui lòng thử lại.");
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size before adding to cart.");
      return;
    }
    const data = {
      user_id: userId,
      product_id: id,
      image: product.image,
      name: product.name,
      price: product.price,
      description: product.description,
      size: selectedSize,
    };
    dispatch(addToCart(data));
    navigate("/cart");
  };

  const handleWishlist = async () => {
    try {
      const token = Cookies.get("token");
      if (!token || !userId) {
        setError("Vui lòng đăng nhập để thêm vào danh sách yêu thích.");
        navigate("/login");
        return;
      }

      await axios.post("http://localhost:3000/api/v1/addProduct", {
        id: userId,
        productId: id,
      });

      alert("Sản phẩm đã được thêm vào danh sách yêu thích!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      setError("Có lỗi xảy ra khi thêm vào danh sách yêu thích.");
    }
  };

  const formatPrice = (price) => {
    if (price == null) return "";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 sm:mt-24">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <div className="w-full h-64 sm:h-96 lg:h-[calc(100vh-300px)] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="lg:w-1/2 flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            {product.name}
          </h1>
          <h2 className="text-xl sm:text-2xl text-red-600 font-semibold mb-4">
            {formatPrice(product.price)} VNĐ
          </h2>
          <div
            className="prose prose-sm sm:prose mb-6 flex-grow overflow-auto max-h-48 sm:max-h-64 lg:max-h-96"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>
          <div className="mb-6">
            <strong className="block mb-2">Size:</strong>
            <div className="flex flex-wrap gap-2">
              {product?.size?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded ${
                    selectedSize === size
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="flex items-center text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 flex items-center justify-center text-sm sm:text-base"
              disabled={!selectedSize}
            >
              <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Thêm giỏ hàng
            </button>
            <button
              onClick={handleWishlist}
              className="flex-1 border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 transition duration-300 flex items-center justify-center text-sm sm:text-base"
            >
              <Heart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Thêm vào danh sách yêu thích
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl sm:text-2xl font-bold mb-4">Comments</h3>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleAddComment} className="mb-8">
          <textarea
            id="message"
            rows="4"
            className="w-full p-2 border rounded text-sm sm:text-base"
            placeholder="Enter your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 text-sm sm:text-base"
          >
            Submit
          </button>
        </form>

        <div className="space-y-6">
          {commentList.length > 0 ? (
            commentList.map((item) => (
              <div key={item._id} className="bg-gray-100 p-4 rounded">
                <div className="flex items-center mb-2">
                  <img
                    src={
                      item.user_id?.avatar || "https://via.placeholder.com/40"
                    }
                    alt="User Avatar"
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3"
                  />
                  <div>
                    <h5 className="font-semibold text-sm sm:text-base">
                      {item.user_id?.username}
                    </h5>
                    <small className="text-gray-500 text-xs sm:text-sm">
                      {new Date(item.createdAt).toLocaleString()}
                    </small>
                  </div>
                </div>
                <p className="mb-2 text-sm sm:text-base">{item.content}</p>
                {userId === item?.user_id?._id && (
                  <button
                    onClick={() => handleDeleteComment(item._id)}
                    className="text-red-600 hover:text-red-800 transition duration-300 text-sm sm:text-base"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm sm:text-base">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsDetail;
