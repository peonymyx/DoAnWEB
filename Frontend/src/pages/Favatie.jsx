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
//     const [currentPage, setCurrentPage] = useState(1);
//     const [sortBy, setSortBy] = useState('');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filters] = useState({ prices: [], types: [] });
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // const [filteredProducts, setFilteredProducts] = useState([]);
    // const productsPerPage = 8;
    const auth = useSelector((state) => state.auth.currentUser);

    useEffect(() => {
        const fetchWishlist = async () => {
          if (auth?._id) {
            setLoading(true);
            setError(null);
            try {
              const response = await axios.get(
                `http://localhost:3000/api/v1/addProduct`
              );
              
              console.log('Wishlist response:', response.data); // Debug log
              
              if (response.data.success && response.data.user?.wishList) {
                // Make sure each item has required properties for ProductCard
                const formattedWishlist = response.data.user.wishList.map(item => ({
                  _id: item._id,
                  name: item.name || 'Unnamed Product',
                  price: item.price || 0,
                  image: item.image || '',
                  rating: item.rating || 0,
                  description: item.description || ''
                }));
                setWishlist(formattedWishlist);
              } else {
                setWishlist([]);
              }
            } catch (error) {
              console.error('Error fetching wishlist:', error);
              setError(error.response?.data?.message || 'Failed to fetch wishlist');
            } finally {
              setLoading(false);
            }
          }
        };
    
        fetchWishlist();
      }, [auth?._id]);
    
      if (!auth) {
        return (
          <div className="w-screen h-screen flex justify-center items-center">
            <p className="text-sm sm:text-base">
              Vui Lòng{" "}
              <a href="/login" className="text-cyan-500">
                {" "}
                đăng nhập{" "}
              </a>{" "}
              để tiếp tục...
            </p>
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
        <div className="bg-gray-100 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-center mb-4">
              Sản phẩm yêu thích ({wishlist.length})
            </h1>
    
            {wishlist.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Chưa có sản phẩm nào trong danh sách yêu thích</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
                {wishlist.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      );
    };

export default Favatie;