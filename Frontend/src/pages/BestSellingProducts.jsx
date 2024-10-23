import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <motion.div
      className="border rounded-lg p-2 sm:p-4 hover:shadow-lg transition-shadow bg-white relative"
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute top-2 left-2 cursor-pointer"
        onClick={handleFavoriteClick}
      >
        <Heart
          className={`h-4 w-4 sm:h-6 sm:w-6 transition-colors duration-300 ${
            isFavorited ? 'text-red-500' : 'text-white stroke-black'
          }`}
          fill={isFavorited ? 'red' : 'none'}
        />
      </div>

      <Link to={`/productdetail/${product._id}`}>
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="h-36 sm:h-48 w-full object-cover transition-transform duration-300 transform hover:scale-110"
          />
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
              <button className="bg-red-500 text-blue-500 py-1 px-2 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-300 hover:bg-blue-500 hover:text-white">
                Xem nhanh
              </button>
            </div>
          )}
        </div>
        <h2 className="text-sm sm:text-lg font-bold mt-2 truncate">{product.name}</h2>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                index < product.rating ? 'text-yellow-500' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-1 text-xs sm:text-sm text-gray-600">({product.rating})</span>
        </div>
        <p className="text-sm sm:text-lg font-semibold mt-1 text-blue-600">
          {product.price?.toLocaleString()}₫
        </p>
        <button className="mt-2 w-full bg-blue-500 text-white py-1 px-2 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm transition-colors duration-300 hover:bg-blue-600 flex items-center justify-center">
          <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-5 sm:w-5" />
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
  }).isRequired,
};

const BestSellingProducts = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3000/api/v1/best-sellers");
        setBestSellers(response.data.products.slice(0, 4));
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching best sellers:", err);
        setError('An error occurred while fetching best-selling products.');
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
    <div className="mt-12 mb-12">
      <h2 className="text-2xl sm:text-4xl font-bold text-center mb-2 sm:mb-4">Sản phẩm bán chạy</h2>
      <p className="text-center mb-4 sm:mb-8 text-sm sm:text-base text-gray-600">
        Khám phá những sản phẩm được yêu thích nhất của chúng tôi
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {bestSellers.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {bestSellers.length === 0 && (
        <p className="text-center text-gray-500 my-4 sm:my-8 text-sm sm:text-base">
          Không có sản phẩm bán chạy nào.
        </p>
      )}
    </div>
  );
};

export default BestSellingProducts;