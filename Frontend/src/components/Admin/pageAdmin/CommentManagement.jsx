import { TrashIcon } from "@heroicons/react/24/solid";
import {
  CardBody,
  Button,
  Card,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../cruds/loading.css";
import { getComment, deleteCommentByAuthor } from "../../../redux/commentSlice";
import Swal from "sweetalert2";

const TABLE_HEAD = [
  "Mã ID",
  "Tên",
  "Nội dung",
  "Tên Sản phẩm",
  "Ngày đăng",
  "",
];
const ITEMS_PER_PAGE = 5;

const CommentManagement = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  const comment = useSelector((state) => state.comment.comment);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getComment());
  }, [dispatch]);

  const handleDelete = (id) => {
    return () => {
      Swal.fire({
        title: "Bạn có chắc chắn muốn xóa bình luận này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteCommentByAuthor(id));
        }
      });
    };
  };

  const totalPages = Math.ceil(comment.length / ITEMS_PER_PAGE);
  const paginatedComments = comment.slice(
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
            <div className="mb-3 mt-3 flex flex-col justify-center gap-8 md:flex-row md:items-center">
              <div className="font-bold text-3xl">
                <h1>Quản Lý Bình Luận</h1>
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-2 container-fluid overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
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
                {paginatedComments.length > 0 &&
                  paginatedComments.map(
                    (
                      { _id, createdAt, user_id, product_id, content },
                      index
                    ) => {
                      const isLast = index === paginatedComments.length - 1;
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
                              {user_id?.username}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xl"
                            >
                              {content}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-xl"
                            >
                              {product_id?.name}
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
                            <Button
                              className="inline-flex items-center gap-2 justify-center px-8 py-4 text-white bg-red-500 rounded-lg h-[50px] w-[70px]"
                              onClick={handleDelete(_id)}
                            >
                              <span>
                                <TrashIcon className="h-5 w-5" />
                              </span>
                              <span>Xóa</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
          </CardBody>
          <div className="sticky bottom-0 right-0 flex justify-end p-4 bg-white">
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
    </div>
  );
};

export default CommentManagement;
