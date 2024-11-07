import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { getProduct } from "../redux/productSlice";
import BestSellingProducts from "./BestSellingProducts";

const ProductCard = ({ product }) => {
  // State để theo dõi trạng thái hover và yêu thích
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="border rounded-lg p-2 mb-4 hover:shadow-lg transition-shadow bg-white relative"
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect đầu tiên để lấy dữ liệu khi component được render
  useEffect(() => {
    // Hàm bất đồng bộ `fetchData` để lấy dữ liệu sản phẩm và danh mục
    const fetchData = async () => {
      try {
        setIsLoading(true); // Bắt đầu quá trình tải dữ liệu
        await dispatch(getProduct()); // Gửi yêu cầu lấy danh sách sản phẩm từ Redux store
        await getCategoryList(); // Gọi hàm lấy danh sách danh mục
        setIsLoading(false); // Kết thúc quá trình tải dữ liệu
      } catch (err) {
        // Nếu có lỗi xảy ra, đặt thông báo lỗi và ngừng tải dữ liệu
        setError("An error occurred while fetching data."); // Thông báo lỗi
        setIsLoading(false); // Ngừng trạng thái tải
      }
    };

    fetchData(); // Gọi hàm `fetchData` khi component render lần đầu
  }, [dispatch]); // useEffect này phụ thuộc vào `dispatch`

  // useEffect thứ hai để cuộn trang lên đầu khi component render lần đầu
  useEffect(() => {
    window.scrollTo(0, 0); // Cuộn lên đầu trang
  }, []);

  // Hàm bất đồng bộ `getCategoryList` để lấy danh sách danh mục từ API
  const getCategoryList = async () => {
    try {
      // Gửi yêu cầu GET tới API để lấy danh sách danh mục
      const res = await axios.get("http://localhost:3000/api/v1/category");
      setCategories(res.data.category); // Cập nhật state `categories` với dữ liệu danh mục
    } catch (error) {
      // Nếu có lỗi xảy ra, in ra console và hiển thị thông báo lỗi
      console.error("Error fetching categories:", error);
      setError("An error occurred while fetching categories."); // Thông báo lỗi
    }
  };

  // Hàm `handleCategoryChange` để xử lý sự kiện thay đổi danh mục được chọn
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value); // Cập nhật danh mục được chọn dựa trên giá trị sự kiện
  };

  // Lọc và sắp xếp sản phẩm dựa trên danh mục được chọn, từ khóa tìm kiếm, và tiêu chí sắp xếp
  const filteredProducts = Array.isArray(products) // Kiểm tra `products` có phải là một mảng hay không
    ? products
        .filter(
          (product) =>
            (selectedCategory === "All" || // Nếu danh mục là "All", lấy tất cả sản phẩm
              product.category === selectedCategory) && // Nếu không, lọc theo danh mục được chọn
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) // Lọc theo tên sản phẩm có chứa từ khóa tìm kiếm (không phân biệt hoa thường)
        )
        .sort((a, b) => {
          // Sắp xếp sản phẩm dựa trên tiêu chí `sortBy`
          switch (sortBy) {
            case "name-asc":
              return a.name.localeCompare(b.name); // Sắp xếp tên sản phẩm từ A-Z
            case "name-desc":
              return b.name.localeCompare(a.name); // Sắp xếp tên sản phẩm từ Z-A
            case "price-asc":
              return a.price - b.price; // Sắp xếp giá từ thấp đến cao
            case "price-desc":
              return b.price - a.price; // Sắp xếp giá từ cao đến thấp
            default:
              return 0; // Không thay đổi thứ tự nếu không có tiêu chí sắp xếp
          }
        })
    : []; // Nếu `products` không phải là mảng, trả về mảng rỗng

  if (isLoading) {
    return <div className="text-center mt-8">Đang tải......</div>;
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
            className="w-52 border rounded-md px-1 text-xl sm:px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-52 border rounded-md px-1 text-xl sm:px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <p className="text-center text-gray-500 my-4 sm:my-8 text-sm sm:text-base">
          Không tìm thấy sản phẩm phù hợp với tiêu chí của bạn.
        </p>
      )}
      <BestSellingProducts />
    </div>
  );
};

export default ListProducts;
