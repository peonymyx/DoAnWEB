import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";

const products = [
  {
    name: "ÁO TANKTOP FORTE HAFOS",
    price: 199000,
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/442/302/products/114.png?v=1722225991967",
    rating: 4,
    type: "Áo",
  },
  {
    name: "ÁO THUN BASEBALL TEE HAFOS",
    price: 259000,
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/442/302/products/98-1721202714530.png?v=1721202720337",
    rating: 5,
    type: "Áo",
  },
  {
    name: "ÁO POLO WAVE WAFFLE HAFOS",
    price: 349000,
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/442/302/products/145.png?v=1714115362747",
    rating: 3,
    type: "Áo",
  },
  {
    name: "ÁO THUN TANKTOP HAFOS",
    price: 299000,
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/442/302/products/170-min.png?v=1714122618947",
    rating: 4,
    type: "Áo",
  },
  {
    name: "QUẦN KAKI SMART BASIC HAFOS",
    price: 379000,
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/442/302/products/kuf09663-1683602194732.jpg?v=1710401547653",
    rating: 5,
    type: "Quần",
  },
  {
    name: "QUẦN REGULAR KAKI SHORT",
    price: 289000,
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/442/302/products/kuf09674-1683602119452.jpg?v=1683602161863",
    rating: 4,
    type: "Quần",
  },
  {
    name: "ÁO SOMI DÀI TAY OXFORD HAFOS",
    price: 319000,
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/442/302/products/den-3.png?v=1701663096250",
    rating: 3,
    type: "Áo",
  },
  {
    name: "QUẦN JEAN SLIM-FIT CẢI TIẾN HAFOS",
    price: 399000,
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/442/302/products/162.png?v=1722932017760",
    rating: 5,
    type: "Quần",
  },
  {
    name: "QUẦN SHORT CARGO KAKI HAFOS",
    price: 289000,
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/442/302/products/184-min.png?v=1722934868600",
    rating: 4,
    type: "Quần",
  },
  {
    name: "ÁO KHOÁC BOMBER HAFOS",
    price: 599000,
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/442/302/products/bomber-den-1703731021308-b2c45347-4992-46fd-b9df-cf18869dd14a.png?v=1703732542163",
    rating: 5,
    type: "Áo",
  },
  {
    name: "ÁO KHOÁC DÙ WRINKLED HAFOS",
    price: 699000,
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/442/302/products/z5005156559367-f8eed3f09dc5c8374ba04de4e4e53fb9-1703434706973.jpg?v=1703434712890",
    rating: 3,
    type: "Áo",
  },
  {
    name: "QUẦN SOFT SHORT JEANS HAFOS",
    price: 289000,
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/442/302/products/img-6366-min.jpg?v=1701162920790",
    rating: 4,
    type: "Quần",
  },
  {
    name: "ÁO POLO ZIPPY HAFOS",
    price: 350000,
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/442/302/products/dsc01011-min.jpg?v=1692604200680",
    rating: 4,
    type: "Áo",
  },
];

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full object-cover transition-transform duration-300 transform hover:scale-110"
        />
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
            <button className="bg-white text-blue-500 py-2 px-4 rounded-full font-semibold transition-colors duration-300 hover:bg-blue-500 hover:text-white">
              Xem nhanh
            </button>
          </div>
        )}
      </div>
      <h2 className="text-lg font-bold mt-2 truncate">{product.name}</h2>
      <div className="flex items-center mt-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < product.rating ? "text-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({product.rating})</span>
      </div>
      <p className="text-lg font-semibold mt-1 text-blue-600">
        {product.price.toLocaleString()}₫
      </p>
      <button className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-full transition-colors duration-300 hover:bg-blue-600 flex items-center justify-center">
        <ShoppingCart className="mr-2 h-5 w-5" />
        Thêm giỏ hàng
      </button>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
};

const CategoryFilters = ({ onFilterChange }) => {
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChange = (price) => {
    const updatedPrices = selectedPrices.includes(price)
      ? selectedPrices.filter((p) => p !== price)
      : [...selectedPrices, price];
    setSelectedPrices(updatedPrices);
    onFilterChange({ prices: updatedPrices, types: selectedTypes });
  };

  const handleTypeChange = (type) => {
    const updatedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(updatedTypes);
    onFilterChange({ prices: selectedPrices, types: updatedTypes });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Filters</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <Filter className="mr-2" />
          {isOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Giá sản phẩm</h3>
            <div className="space-y-2">
              {["dưới 200k", "200k - 300k", "300k - 400k", "trên 400k"].map(
                (price) => (
                  <label key={price} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPrices.includes(price)}
                      onChange={() => handlePriceChange(price)}
                      className="form-checkbox text-blue-500 mr-2"
                    />
                    <span className="text-gray-700">{price}</span>
                  </label>
                )
              )}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Loại</h3>
            <div className="space-y-2">
              {["Áo", "Quần"].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    className="form-checkbox text-blue-500 mr-2"
                  />
                  <span className="text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

CategoryFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`px-3 py-1 rounded-full ${
            currentPage === index + 1
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ prices: [], types: [] });
  const [filteredProducts, setFilteredProducts] = useState(products);
  const productsPerPage = 6;

  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.prices.length > 0) {
      filtered = filtered.filter((product) => {
        const price = product.price;
        return filters.prices.some((range) => {
          switch (range) {
            case "dưới 200k":
              return price < 200000;
            case "200k - 300k":
              return price >= 200000 && price < 300000;
            case "300k - 400k":
              return price >= 300000 && price < 400000;
            case "trên 400k":
              return price >= 400000;
            default:
              return false;
          }
        });
      });
    }

    if (filters.types.length > 0) {
      filtered = filtered.filter((product) =>
        filters.types.includes(product.type)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredProducts(sorted);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, sortBy, filters]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-center mb-4">
        Sản phẩm của chúng tôi
      </h1>
      <p className="text-center mb-8 text-gray-600">
        Khám phá bộ sưu tập quần áo chất lượng cao mới nhất của chúng tôi
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <CategoryFilters onFilterChange={handleFilterChange} />
        </div>
        <div className="w-full md:w-3/4">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
            <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Mặc định</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
                <option value="price-asc">Giá Thấp đến Cao</option>
                <option value="price-desc">Giá Cao xuống Thấp</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 my-8">
              Không tìm thấy sản phẩm phù hợp với tiêu chí của bạn.
            </p>
          )}

          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
