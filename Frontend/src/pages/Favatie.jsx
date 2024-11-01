import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Star, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <motion.div
            className="border rounded-lg p-2 sm:p-4 hover:shadow-lg transition-shadow bg-white"
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden rounded-lg">
                <img src={product.image} alt={product.name} className="h-32 sm:h-48 w-full object-cover transition-transform duration-300 transform hover:scale-110" />
                {isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
                        <button className="bg-white text-blue-500 py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-sm rounded-full font-semibold transition-colors duration-300 hover:bg-blue-500 hover:text-white">
                            Xem nhanh
                        </button>
                    </div>
                )}
            </div>
            <h2 className="text-sm sm:text-lg font-bold mt-2 truncate">{product.name}</h2>
            <div className="flex items-center mt-1">
                {[...Array(5)].map((_, index) => (
                    <Star key={index} className={`h-3 w-3 sm:h-4 sm:w-4 ${index < product.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
                ))}
                <span className="ml-1 text-xs sm:text-sm text-gray-600">({product.rating})</span>
            </div>
            <p className="text-sm sm:text-lg font-semibold mt-1 text-blue-600">{product.price.toLocaleString()}₫</p>
            <button className="mt-2 w-full bg-blue-500 text-white py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-sm rounded-full transition-colors duration-300 hover:bg-blue-600 flex items-center justify-center">
                <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-5 sm:w-5" />
                Thêm giỏ hàng
            </button>
        </motion.div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
    }).isRequired,
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-4 sm:mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 sm:p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => onPageChange(index + 1)}
                    className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-full ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                >
                    {index + 1}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 sm:p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
            >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

const Favatie = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productWish, setProductWish] = useState([]);
  const auth = useSelector((state) => state.auth.currentUser);
  const productsPerPage = 4;

  const fetchProducts = async (productIds) => {
    try {
      // Remove duplicates and maintain order
      const uniqueProductIds = [...new Set(productIds)];

      const productsResponse = await Promise.all(
        uniqueProductIds.map((id) =>
          axios.get(`http://localhost:3000/api/v1/getProductById/${id}`)
        )
      );
      setProductWish(productsResponse.map((res) => res.data.Product));
    } catch (error) {
      console.error("There was an error fetching the products!", error);
      setError("Không thể tải danh sách sản phẩm");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/users/removeFromWishList/${auth._id}/${productId}`
      );

      // Update local state
      setWishlist((prevWishlist) =>
        prevWishlist.filter((id) => id !== productId)
      );
      setProductWish((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("There was an error removing from wishlist!", error);
      setError("Không thể xóa sản phẩm khỏi danh sách yêu thích");
    }
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/wishListProduct/${auth._id}`
        );

        setWishlist(response.data.wishList);
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the wishlist!", error);
        setError("Không thể tải danh sách yêu thích");
        setLoading(false);
      }
    };

    if (auth) {
      fetchWishlist();
    }
  }, [auth]);

  useEffect(() => {
    if (wishlist.length > 0) {
      fetchProducts(wishlist);
    }
  }, [wishlist]);

  // Pagination logic
  const totalPages = Math.ceil(productWish.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = productWish.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!auth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: -50, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-lg text-center"
        >
          <p className="text-lg font-semibold mb-4">
            Đăng nhập để xem danh sách yêu thích
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-500 text-white py-2 px-4 rounded-full transition-colors duration-300 hover:bg-blue-600"
          >
            Đăng nhập
          </a>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1300px] mx-auto px-4 py-8">
      <p className="text-4xl font-bold text-center mt-4 mb-10 text-black">
        Danh sách yêu thích
      </p>
      <div>
        {productWish.length === 0 ? (
          <p className="text-center text-gray-500 my-4 sm:my-8 text-sm sm:text-base">
            Không tìm thấy danh sách sản phẩm yêu thích
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onRemoveFromWishlist={removeFromWishlist}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Favatie;