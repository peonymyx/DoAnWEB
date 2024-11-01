import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../redux/productSlice";
import {
  addComment,
  deleteCommentByAuthor,
  getCommentByProductId,
} from "../redux/commentSlice";
import { addToCart } from "../redux/cartSlice";
import axios from "axios";
import { AlertCircle, ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";

const ProductsDetail = () => {
  const [comment, setComment] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.products);
  const auth = useSelector((state) => state.auth.currentUser);
  const userId = auth?._id;
  const commentList = useSelector((state) => state.comment.comment);
  const { pathname } = useLocation();

  const handleAddComment = async (comment) => {
    if (!auth) {
      // Kiểm tra userId thay vì auth
      // navigate("/login");
      // return;
    }

    try {
      const data = {
        user_id: userId,
        product_id: id,
        content: comment,
      };
      console.log("data", data);
      await dispatch(addComment(data));
      setComment(""); // Clear comment input after successful submission
    } catch (error) {
      console.error("Failed to add comment:", error);
      // Có thể hiển thị thông báo lỗi cho người dùng
      setError("Có lỗi xảy ra khi thêm bình luận. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleDeleteComment = (id) => {
    dispatch(deleteCommentByAuthor(id));
  };

  useEffect(() => {
    dispatch(getProductById(id));
    dispatch(getCommentByProductId(id));
  }, [id, dispatch, commentList.length]);

  const handleSelectSize = (size) => {
    setSelectedSize(size);
    setError(""); // Clear any previous error when a size is selected
  };

  const navigate = useNavigate();

  const handleWishlist = async () => {
    try {
      await axios.post("http://localhost:3000/api/v1/users/wishListProduct", {
        id: userId,
        productId: id,
      });
      Swal.fire({
        icon: "success",
        title: "Thêm vào yêu thích thành công!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "";
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    dispatch(getProductById(id));
    dispatch(getCommentByProductId(id));
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Vui lòng chọn kích cỡ trước khi thêm vào giỏ hàng.");
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
    console.log("datacar", data);
    dispatch(addToCart(data));
    navigate("/cart");
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
                  onClick={() => handleSelectSize(size)}
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
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 flex items-center justify-center text-md sm:text-xl"
              disabled={!selectedSize}
            >
              <ShoppingCart className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
              Thêm giỏ hàng
            </button>
            <button
              onClick={handleWishlist}
              className="flex-1 border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 transition duration-300 flex items-center justify-center text-md sm:text-xl"
            >
              Thêm vào danh sách yêu thích
            </button>
          </div>
        </div>
      </div>

      {/* COMMENT */}
      <div className="row mt-5">
        <div className="col">
          <h3>Bình Luận</h3>
          <form>
            <div className="form-group">
              <label htmlFor="message">Bình Luận:</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                className="form-control"
                placeholder="Nhập bình luận của bạn..."
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddComment(comment);
              }}
              className="btn btn-primary mt-3"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col">
          {commentList.length > 0 ? (
            commentList.map((item) => (
              <div key={item._id} className="media mb-4">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Avatar"
                  className="mr-3 rounded-circle"
                />
                <div className="media-body">
                  <h5 className="mt-0">{item.user_id?.username}</h5>
                  <p>{item.content}</p>
                  <small className="text-muted">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </small>
                  {userId === item?.user_id?._id && (
                    <button
                      onClick={() => handleDeleteComment(item._id)}
                      className="btn btn-danger btn-sm ml-3"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Không có bình luận nào.</p>
          )}
        </div>
      </div>
      {/* <div className="mt-12">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-black text-left">
          Bình luận
        </h3>
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
      </div> */}
    </div>
  );
};

export default ProductsDetail;
