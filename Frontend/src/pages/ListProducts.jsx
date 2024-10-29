import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, Star, Search, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { getProduct } from '../redux/productSlice';
import BestSellingProducts from './BestSellingProducts';

const ProductCard = ({ product }) => {
  // State để theo dõi trạng thái hover và yêu thích
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Hàm xử lý khi người dùng click vào trái tim yêu thích
  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <motion.div
      className="border rounded-lg p-2 mb-4 hover:shadow-lg transition-shadow bg-white relative"
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
          <span className="ml-1 text-xs sm:text-sm text-gray-600">({product.rating})</span>
        </div>
        <p className="text-sm sm:text-lg font-semibold mt-1 text-blue-600">
          {product.price?.toLocaleString()}₫
        </p>
        <button className="mt-2 w-full text-lg bg-blue-500 text-white py-1 px-4 rounded-full transition-colors duration-300 hover:bg-blue-600 flex items-center justify-center">
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

const ListProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await dispatch(getProduct());
        await getCategoryList();
        setIsLoading(false);
      } catch (err) {
        setError('An error occurred while fetching data.');
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang
  }, []);

  const getCategoryList = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/category");
      setCategories(res.data.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError('An error occurred while fetching categories.');
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredProducts = Array.isArray(products)
    ? products
      .filter((product) =>
        (selectedCategory === "All" || product.category === selectedCategory) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          default:
            return 0;
        }
      })
    : [];

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-4xl font-bold text-center m-4 sm:mb-4">
        Sản phẩm của chúng tôi
      </h1>
      <p className="text-center mb-4 sm:mb-8 text-xl text-gray-600">
        Khám phá bộ sưu tập quần áo chất lượng cao mới nhất của chúng tôi
      </p>

      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 text-xl sm:pl-10 pr-4 py-1 sm:py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 text-sm">
          <span className="text-gray-600 text-xl">Danh mục:</span>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border rounded-md px-1 text-xl sm:px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">Tất cả</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 text-sm">
          <span className="text-gray-600 text-xl">Sắp xếp theo:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-1 text-xl sm:px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Mặc định</option>
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="price-asc">Giá Thấp đến Cao</option>
            <option value="price-desc">Giá Cao xuống Thấp</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 my-4 sm:my-8 text-sm sm:text-base">Không tìm thấy sản phẩm phù hợp với tiêu chí của bạn.</p>
      )}
      <BestSellingProducts />
    </div>
  );
};

export default ListProducts;
