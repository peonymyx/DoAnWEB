import { useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Button,
} from "@material-tailwind/react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, updateRoleUser } from "../../../redux/userSlice";
import Swal from "sweetalert2"; // Import SweetAlert2

const TABLE_HEAD = [
  "Tên",
  "Số Điện Thoại",
  "Giới Tính",
  "Ngày Sinh",
  "Ngày Tạo",
  "Ngày Sửa",
  "Vai Trò",
  "",
];

const AccountManagement = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users || []);
  const isLoading = useSelector((state) => state.user.isLoading);
  const auth = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handlePermission = (id) => {
    return () => {
      Swal.fire({
        title: "Cập nhật quyền",
        input: "select",
        inputOptions: {
          user: "user",
          admin: "admin",
          nhanvien: "nhanvien",
        },
        inputPlaceholder: "Chọn quyền",
        showCancelButton: true,
        confirmButtonText: "Lưu",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          const data = {
            id: id,
            role: result.value,
          };
          dispatch(updateRoleUser(data));
        }
      });
    };
  };

  if (auth.role !== "admin") {
    return null;
  }

  return (
    <div>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      <div className="flex">
        <Card className="w-full shadow-none">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div className="font-bold text-3xl">
                <h1>Quản Lý Tài Khoản</h1>
              </div>
              <div className="flex w-full shrink-0 gap-2 md:w-max mr-3">
                <div className="flex items-center gap-5 w-[350px] h-[40px] border border-gray-200 rounded-lg py-4 px-4">
                  <input
                    type="text"
                    className="w-full outline-none bg-transparent text-xl"
                    placeholder="Tìm kiếm..."
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
                <div className="mb-2"></div>
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-4 container-fluid overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr className="bg-blue-800 text-white">
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
                {users.length > 0 &&
                  users.map(
                    (
                      {
                        _id,
                        username,
                        phone,
                        gender,
                        age,
                        createAt,
                        updatedAt,
                        role,
                      },
                      index
                    ) => {
                      const isLast = index === users.length - 1;
                      const classes = isLast
                        ? "px-10 py-4 text-center"
                        : "px-10 py-4 border-b border-blue-gray-50 text-center";
                      return (
                        <tr key={username}>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold text-2xl"
                            >
                              {username}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-2xl"
                            >
                              {phone}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-2xl"
                            >
                              {gender}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-2xl"
                            >
                              {new Date(age).toLocaleDateString("en-GB")}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-2xl"
                            >
                              {new Date(createAt).toLocaleDateString("en-GB")}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-2xl"
                            >
                              {new Date(updatedAt).toLocaleDateString("en-GB")}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal text-2xl"
                            >
                              {role}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Button
                              className="inline-flex items-center gap-2 justify-center text-white bg-blue-500 outline rounded-lg h-[50px] w-[170px]"
                              onClick={handlePermission(_id)}
                            >
                              <span>
                                <PencilSquareIcon className="h-5 w-5" />
                              </span>
                              <span className="text-xl">Phân Quyền</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AccountManagement;
