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
  const auth = useSelector((state) => state.auth);
  // const userId = auth?._id;
  const userId = auth.currentUser._id;
  const commentList = useSelector((state) => state.comment.comment);
  const { pathname } = useLocation();

  const handleAddComment = (comment) => {
    if (!auth.currentUser) {
      navigate("/login");
      return null;
    } else {
      const data = {
        user_id: userId,
        product_id: id,
        content: comment,
      };
      dispatch(addComment(data));
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
    dispatch(addToCart(data));
    navigate("/cart");
  };

  return (
    <div className="container sm:w-[1270px] mx-auto px-4 py-8 mt-10 sm:mt-16">
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
              className="flex-1 border border-gray-300 py-2 px-4 rounded hover:bg-pink-500 hover:text-white transition duration-700 flex items-center justify-center text-md sm:text-xl"
            >
              Thêm vào danh sách yêu thích
            </button>
          </div>
        </div>
      </div>

      {/* COMMENT */}
      <div className="row my-5">
        <div className="col">
          <form>
            <div className="form-group">
              <label htmlFor="message" className="text-2xl my-7 font-bold">
                Bình Luận
              </label>
              <textarea
                id="message"
                name="message"
                rows="3"
                className="form-control text-lg"
                placeholder="Nhập bình luận của bạn..."
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddComment(comment);
              }}
              className="btn btn-primary mt-6"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
      <div className="mt-4">
        <div>
          {commentList.length > 0 ? (
            commentList.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-start bg-white shadow rounded-lg p-4 mb-4"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-lg font-semibold text-gray-800">
                        {item.user_id?.username || "Unknown User"}
                      </h5>
                      <small className="text-gray-500 text-sm">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    {userId === item?.user_id?._id && (
                      <button
                        onClick={() => handleDeleteComment(item._id)}
                        className="text-red-500 hover:text-red-600 text-lg sm:xl mt-4"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 mt-2 text-sm sm:text-base sm:ml-6">
                    {item.content}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-600">Không có bình luận nào...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsDetail;
