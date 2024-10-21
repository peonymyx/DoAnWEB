import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { deleteProduct, getProduct } from "../../../redux/productSlice";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Button,
} from "@material-tailwind/react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import "../../../App.css";
import "../cruds/loading.css";

const TABLE_HEAD = [
  "Hình Ảnh",
  "Tên",
  "Giá",
  "Size",
  "Mô Tả",
  "Ngày Tạo",
  "Ngày Sửa",
  "",
];
const formatPrice = (price) => {
  if (price === undefined || price === null) {
    return "";
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
};

const Product = () => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.products); // Lấy toàn bộ state sản phẩm
  const loading = useSelector((state) => state.product.isLoading);
  const isLoading = useSelector((state) => state.product.isLoading);
  const [searchTerm, setSearchTerm] = useState(""); // State lưu trữ từ khóa tìm kiếm

  // Function để cập nhật state khi người dùng nhập từ khóa tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  console.log("Product từ Redux:", product);

  // Bước 2: Filter dữ liệu dựa trên từ khóa tìm kiếm
  const filteredProduct = product.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("filtered", filteredProduct);

  const handleDelete = (id) => async () => {
    await dispatch(deleteProduct(id));

    // Add a timeout of 2 seconds (2000 milliseconds)
    setTimeout(() => {
      window.location.reload(); // Reload the page after the timeout
    }, 2000);
  };

  return (
    <div className="content-wrapper">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="flex">
        <Card className="w-full shadow-none">
          <CardHeader
            floated={false}
            shadow={false}
            className="content-header rounded-none"
          >
            <div className="mb-8 mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="font-bold text-3xl">
                <h1>Quản Lý Sản Phẩm</h1>
              </div>
              <div className="flex w-full shrink-0 gap-2 md:w-max mr-3">
                <div className="flex items-center gap-5 w-[350px] h-[40px] border border-gray-200 rounded-lg py-4 px-4">
                  <input
                    type="text"
                    className="w-full outline-none bg-transparent text-xl"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={handleSearch} // Gọi hàm khi người dùng thay đổi input
                  />
                  <span className="flex-shrink-0 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                </div>
                <div className="h-14 ml-8">
                  <Link to="/AddProduct">
                    <Button className="flex items-center p-4 justify-center text-xl gap-1 rounded-md h-11 bg-blue-500 w-29 hover:bg-blue-600">
                      <PlusIcon className="h-6 w-6 " />
                      Thêm
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-4 container-fluid overflow-x-auto">
            {/* {loading ? (
              <div className="body">
                <div className="spinner"></div>
                <div className="message">
                  <h1>Loading...</h1>
                </div>
              </div>
            ) : ( */}
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr className=" bg-blue-800 text-white">
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-10 text-center"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none text-2xl"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!loading &&
                  filteredProduct.length > 0 &&
                  filteredProduct.map((row) => (
                    <tr key={row._id}>
                      <td className="w-[100px] h-[90px] ">
                        <img src={row.image} alt={row.name} />
                      </td>
                      <td className="border-dashed border-t border-blue-gray-200 p-4">
                        <div className="flex items-center ">
                          <div>
                            <Typography color="blueGray" variant="body2">
                              {row.name}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="border-dashed border-t border-blue-gray-200 px-10 py-4">
                        <Typography color="blueGray" variant="body2">
                          {formatPrice(row.price)}
                        </Typography>
                      </td>
                      <td className="border-dashed border-t border-blue-gray-200 px-10 py-4">
                        <Typography color="blueGray" variant="body2">
                          {row.size}
                        </Typography>
                      </td>
                      <td className="border-dashed border-t border-blue-gray-200 px-10 py-4">
                        <Typography color="blueGray" variant="body2">
                          {row.description}
                        </Typography>
                      </td>
                      <td className="border-dashed border-t border-blue-gray-200 px-10 py-4">
                        <Typography color="blueGray" variant="body2">
                          {new Date(row.createdAt).toLocaleDateString("en-GB")}
                        </Typography>
                      </td>
                      <td className="border-dashed border-t border-blue-gray-200 px-10 py-4">
                        <Typography color="blueGray" variant="body2">
                          {new Date(row.updatedAt).toLocaleDateString("en-GB")}
                        </Typography>
                      </td>
                      <td className="border-dashed border-t border-blue-gray-200 px-10 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/EditProduct/${row._id}`}>
                            <Button className="inline-flex items-center gap-2 justify-center px-8 py-4 text-white bg-blue-500 rounded-lg h-[50px] w-[50px] mr-2">
                              <span>
                                <PencilIcon className="h-4 w-4" />
                              </span>
                              <span>Sửa</span>
                            </Button>
                          </Link>
                          <Button
                            className="inline-flex items-center gap-2 justify-center px-8 py-4 text-white bg-red-500 rounded-lg  h-[50px] w-[50px]"
                            buttonType="link"
                            size="regular"
                            rounded={false}
                            block={false}
                            iconOnly={false}
                            ripple="dark"
                            onClick={handleDelete(row._id)}
                          >
                            <span>
                              <TrashIcon className="h-4 w-4" />
                            </span>
                            <span>Xóa</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {/* )} */}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Product;
