import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="border rounded-lg p-2 mb-4 hover:shadow-lg transition-shadow bg-white relative"
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-bold">
          -{product.discount}%
        </div>
      )}

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

        {/* Price Display Section */}
        <div className="mt-2 space-y-1">
          {/* Original Price with Strike-through if discounted */}
          {product.discount > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through text-xs sm:text-base">
                {product.price?.toLocaleString()}₫
              </span>
              <span className="text-red-500 text-xs sm:text-sm font-medium">
                -{product.discount}%
              </span>
            </div>
          ) : null}

          {/* Final Price */}
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-lg font-bold text-blue-600">
              {(product.price * (1 - product.discount / 100)).toLocaleString()}₫
            </span>
            {product.discount > 0 && (
              <span className="text-xs sm:text-sm text-green-600">
                Tiết kiệm:{" "}
                {(product.price * (product.discount / 100)).toLocaleString()}₫
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="mt-3 w-full text-sm sm:text-lg bg-blue-500 text-white py-1 px-4 rounded-full transition-colors duration-300 hover:bg-blue-600 flex items-center justify-center">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Thêm giỏ hàng
        </button>
      </Link>
    </motion.div>
  );
};

// Thêm PropTypes validation cho ProductCard
ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
  }).isRequired,
};

const Discount = () => {
  const [highestDiscounts, setHighestDiscounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(
          "https://doanweb-api.onrender.com/api/v1/products/getProductDiscount"
        );

        setHighestDiscounts(response.data.products.slice(0, 4));

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching best sellers:", err);
        setError("An error occurred while fetching best-selling products.");

        setIsLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-[1300px] mx-auto mt-2 mb-12">
      <p className="text-4xl font-bold text-center my-8 text-black">
        Sản phẩm giảm giá nhiều nhất
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {highestDiscounts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {highestDiscounts.length === 0 && (
        <p className="text-center text-gray-500 my-4 sm:my-8 text-sm sm:text-base">
          Không có sản phẩm nào.
        </p>
      )}
    </div>
  );
};

export default Discount;