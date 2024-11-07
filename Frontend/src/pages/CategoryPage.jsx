import React from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const CategoryPage = () => {
  const { id } = useParams();
  const [productList, setProductList] = React.useState([]);

  const getProductList = async () => {
    const res = await axios.get(
      `https://doanweb-api.onrender.com/api/v1/getProduct?category=${id}`
    );
    setProductList(res.data.product);
  };

  React.useEffect(() => {
    setProductList();
  }, [id]);

  console.log(productList);

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 pt-44">
        {productList.length > 0 &&
          productList?.map((item) => {
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
  );
};

export default CategoryPage;
