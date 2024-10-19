import Header from "./Header";
import { Outlet } from "react-router-dom";

const LayoutMain = () => {
  return (
    <div>
      <Header />
      {/* Add margin-top to push Outlet content below the header */}
      <div className="mt-[110px]">
        {/* Adjust '80px' to match your header height */}
        <Outlet />
      </div>
    </div>
  );
};
export default LayoutMain;
