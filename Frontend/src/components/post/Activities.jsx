import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Heart,
  Star,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { getProduct } from "../../redux/productSlice";
import BestSellingProducts from "../../pages/BestSellingProducts";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <motion.div
      className="border rounded-lg p-2 hover:shadow-lg transition-shadow bg-white relative"
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute top-4 right-4 cursor-pointer z-10"
        onClick={handleFavoriteClick}
      >
        <Heart
          className={`h-6 w-6 transition-colors duration-300 ${
            isFavorited ? "text-red-500" : "text-white stroke-black"
          }`}
          fill={isFavorited ? "red" : "none"}
        />
      </div>
      <Link to={`/productdetail/${product._id}`}>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="h-36 sm:h-[400px] w-full object-cover object-center transition-transform duration-300 transform hover:scale-110"
          />
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
              <button className="bg-blue-700 text-blue-300 py-1 px-4 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 hover:bg-blue-500 hover:text-white">
                Xem nhanh
              </button>
            </div>
          )}
        </div>
        <h2 className="text-sm sm:text-lg mt-3 font-bold truncate">
          {product.name}
        </h2>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${
                index < product.rating ? "text-yellow-500" : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-1 text-xs sm:text-sm text-gray-600">
            ({product.rating})
          </span>
        </div>
        <p className="text-sm sm:text-lg font-semibold mt-1 text-blue-600">
          {product.price?.toLocaleString()}₫
        </p>
        <button className="mt-2 w-full text-md sm:text-lg bg-blue-500 text-white py-1 px-4 rounded-full transition-colors duration-300 hover:bg-blue-600 flex items-center justify-center">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Thêm giỏ hàng
        </button>
      </Link>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

const Activities = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const nextPage = () => {
    if (currentPage < Math.ceil(products.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8">
      <p className="text-4xl font-bold text-center my-4 text-black">
        Sản phẩm của chúng tôi
      </p>
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`text-blue-500 transition-transform duration-200 
            ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 active:scale-95"
            }`}
        >
          <ChevronLeft size={36} />
        </button>
        <Link
          to="/listproducts"
          className="bg-blue-500 text-white py-2 px-6 rounded-full text-lg transition-colors duration-300 hover:bg-blue-600 font-bold"
        >
          Xem tất cả
        </Link>
        <button
          onClick={nextPage}
          disabled={
            currentPage === Math.ceil(products.length / productsPerPage)
          }
          className={`text-blue-500 transition-transform duration-200 
            ${
              currentPage === Math.ceil(products.length / productsPerPage)
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 active:scale-95"
            }`}
        >
          <ChevronRight size={36} />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} // Thời gian chuyển tiếp
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
      <div className="w-full h-px bg-gray-400 my-16"></div>
      {/* Banner */}
      <div className="relative w-full h-36 sm:h-[400px] overflow-hidden">
        <Link to="/listproducts">
          <img
            src="./BTSThuDong.webp"
            alt="Banner"
            className="w-full h-full object-cover object-center transition-transform duration-300 transform hover:scale-110"
          />
        </Link>
      </div>
      {/* Banner */}
      <div className="w-full h-px bg-gray-400 my-16"></div>
      <BestSellingProducts />
      <div className="relative w-full h-36 sm:h-[400px] overflow-hidden mb-4">
        <Link to="/listproducts">
          <img
            src="./AnhShowRoom.webp"
            alt="Banner"
            className="w-full h-full object-cover object-center transition-transform duration-300 transform hover:scale-110"
          />
        </Link>
      </div>
    </div>
  );
};

export default Activities;
