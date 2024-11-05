import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOtherById, selectSelectedOther } from "../../../redux/otherSlice";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const OtherDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getOtherById(id));
  }, [dispatch, id]);

  const other = useSelector(selectSelectedOther);

  if (!other) {
    return <div className="p-4">Loading...</div>;
  }

  const totalPrice = other.cart
    ? other.cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;

  const exportPDF = () => {
    const input = document.getElementById("invoice");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(
        imgData,
        "JPEG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`invoice_${other._id}.pdf`);
    });
  };

  return (
    <div className="content-wrapper overflow-x-auto">
      <div className="content-header">
        <div
          className="bg-white p-6 rounded-lg shadow-md mx-auto"
          style={{ minWidth: "768px", maxWidth: "1024px" }}
        >
          <div className="invoice-container mb-5" id="invoice">
            <div className="invoice-wrap">
              <div className="invoice-inner">
                <div className="invoice-address pt-8 border-t-4 border-double border-black">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td colSpan="2" className="text-center">
                          <div className="mce-content-body">
                            <p className="text-3xl font-bold mb-4">Hóa Đơn</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="w-1/2">
                          <table>
                            <tbody>
                              <tr>
                                <td className="text-lg font-bold">
                                  Hóa đơn tới:
                                </td>
                                <td>
                                  <div className="client_info pl-5">
                                    <p className="text-lg">
                                      <strong>{other.username}</strong>
                                      <br />
                                      {other.address}
                                      <br />
                                      {other.phone_number}
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td className="w-1/2 text-right">
                          <table className="ml-auto">
                            <tbody className="text-lg">
                              <tr>
                                <td className="font-bold">Hóa đơn số:</td>
                                <td className="pl-5">{other._id}</td>
                              </tr>
                              <tr>
                                <td className="font-bold">Ngày:</td>
                                <td className="pl-5">
                                  {new Date(other.createdAt).toLocaleDateString(
                                    "vi-VN",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div id="items-list" className="mt-8">
                  <table className="table-auto w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 text-center">Tên Sản Phẩm</th>
                        <th className="p-2 text-center">Số Lượng</th>
                        <th className="p-2 text-center">Đơn Giá</th>
                        <th className="p-2 text-center">Size</th>
                        <th className="p-2 text-center">Thành Tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {other.cart &&
                        other.cart.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-2">{item.name}</td>
                            <td className="p-2 text-center">{item.quantity}</td>
                            <td className="p-2 text-right">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.price)}
                            </td>
                            <td className="p-2 text-center">{item.size}</td>
                            <td className="p-2 text-right">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-black">
                        <td colSpan="3"></td>
                        <td className="p-2 font-bold text-right">Tổng Tiền</td>
                        <td className="p-2 text-right font-bold">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(totalPrice)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={exportPDF}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full"
          >
            Xuất PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtherDetails;
