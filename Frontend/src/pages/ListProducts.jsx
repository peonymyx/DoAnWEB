import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Footer from "../components/post/Footer";
import { getProduct } from "../redux/productSlice";
import axios from "axios";

function ListProducts() {
  const productListRef = useRef(null);
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.products);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryList, setCategoryList] = useState([]);
  const category = useSelector((state) => state.category.category);
  const getCategoryList = async () => {
    const res = await axios.get("http://localhost:3000/api/v1/category");
    setCategoryList(res.data.category);
  };

  // Hàm xử lý sự kiện khi thay đổi danh mục
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Lọc danh sách vắc xin theo danh mục
  const filteredProducts =
    selectedCategory === "All"
      ? product
      : product.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    dispatch(getProduct());
    getCategoryList();
  }, [dispatch]);

  return (
    <div>
      <div
        ref={productListRef}
        className="container-fluid  pt-36 wow fadeInUp"
        data-wow-delay="0.1s"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="section-title">
                <h5 className="position-relative d-inline-block text-primary text-uppercase">
                  Danh Mục Vắc Xin 
                </h5>
              </div>
              <div className="col-lg-10 my-4 flex ">
                <h5 className="mr-3 mt-2">Tùy Chọn: </h5>
                <div className="w-72">
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="form-select"
                  >
                    <option value="All">Tất cả</option>
                    {categoryList.length > 0 &&
                      categoryList?.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-4">
            {filteredProducts.length > 0 &&
              filteredProducts?.map((item) => {
                return (
                  <div key={item._id}>
                    <Link to={`/vacxindetail/${item._id}`}>
                      <div
                        className="max-w-sm mb-5 wow zoomIn bg-white dark:bg-gray-800 dark:border-gray-700"
                        data-wow-delay="0.9s"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded-sm shadow-md border border-gray-200"
                        />

                        <div className="p-4 text-lg font-normal text-center">
                          {item.name}
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default ListProducts;
