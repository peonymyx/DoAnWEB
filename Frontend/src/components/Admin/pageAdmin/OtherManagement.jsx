import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  CardBody,
  Card,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOther, updateStatusOder } from "../../../redux/otherSlice";
import "../cruds/loading.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const TABLE_HEAD = [
  "ID",
  "Thời gian đặt",
  "Tên người nhận",
  "Số điện thoại",
  "Địa chỉ",
  "Ghi chú",
  "Trạng thái",
  "",
  "",
];

const ITEMS_PER_PAGE = 5;

const OtherManagement = () => {
  const dispatch = useDispatch();
  const other = useSelector((state) => state.other.other);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    dispatch(getOther());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleUpdateStatus = (id) => {
    Swal.fire({
      title: "Cập nhật trạng thái",
      input: "select",
      inputOptions: {
        "Chưa xử lý": "Chưa xử lý",
        "Đang xử lý": "Đang xử lý",
        "Đã hoàn thành": "Đã hoàn thành",
      },
      inputPlaceholder: "Chọn trạng thái",
      showCancelButton: true,
      confirmButtonText: "Lưu",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          id: id,
          status: result.value,
        };
        dispatch(updateStatusOder(data));
      }
    });
  };

  const filteredOther = Array.isArray(other)
    ? other.filter(
        (item) =>
          item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.phone_number.includes(searchTerm)
      )
    : [];

  const totalPages = Math.ceil(filteredOther.length / ITEMS_PER_PAGE);
  const paginatedOther = filteredOther.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="relative min-h-screen">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="flex">
        <Card className="w-full shadow-none">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-3 mt-3 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="font-bold text-3xl">
                <h1>Quản Lý Đơn hàng</h1>
              </div>
              <div className="flex w-full shrink-0 gap-2 md:w-max mr-3">
                <div className="flex items-center gap-5 w-[350px] h-[40px] border border-gray-200 rounded-lg py-4 px-4">
                  <input
                    type="text"
                    className="w-full outline-none bg-transparent text-xl"
                    placeholder="Nhập tên tìm kiếm..."
                    value={searchTerm}
                    onChange={handleSearch}
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
              </div>
              <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full"
                table="otherTableForExcel"
                filename="donhang"
                sheet="donhang"
                buttonText="Xuất Excel"
              />
            </div>
          </CardHeader>
          <CardBody className="px-2 container-fluid overflow-x-auto">
            <table
              id="otherTable"
              className="w-full min-w-max table-auto text-left"
            >
              <thead>
                <tr className="bg-blue-800 text-white">
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none text-xl"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedOther.map(
                  (
                    {
                      _id,
                      createdAt,
                      username,
                      phone_number,
                      address,
                      note,
                      status,
                    },
                    index
                  ) => {
                    const isLast = index === paginatedOther.length - 1;
                    const classes = isLast
                      ? "px-8 py-4 text-center"
                      : "px-8 py-4 border-b border-blue-gray-50 text-center";

                    return (
                      <tr key={_id}>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold text-xl"
                          >
                            {_id}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xl"
                          >
                            {new Date(createdAt).toLocaleDateString("en-GB")}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xl"
                          >
                            {username}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xl"
                          >
                            {phone_number}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xl"
                          >
                            {address}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xl w-[160px]"
                          >
                            {note}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal text-xl"
                          >
                            {status}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <button
                            className="mr-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full"
                            onClick={() => handleUpdateStatus(_id)}
                          >
                            Cập nhật
                          </button>
                          <Link to={`/otherdetails/${_id}`}>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full">
                              Chi tiết
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
          <div className="fixed bottom-10 right-10 flex justify-center items-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </Card>
      </div>
      {/* bảng xuất file excel */}
      <table id="otherTableForExcel" className="hidden">
        <thead>
          <tr>
            {TABLE_HEAD.slice(0, -2).map(
              (
                head // Loại bỏ hai cột cuối cùng
              ) => (
                <th key={head}>{head}</th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedOther.map(
            ({
              _id,
              createdAt,
              username,
              phone_number,
              address,
              note,
              status,
            }) => (
              <tr key={_id}>
                <td>{_id}</td>
                <td>{new Date(createdAt).toLocaleDateString("en-GB")}</td>
                <td>{username}</td>
                <td>{phone_number}</td>
                <td>{address}</td>
                <td>{note}</td>
                <td>{status}</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OtherManagement;
