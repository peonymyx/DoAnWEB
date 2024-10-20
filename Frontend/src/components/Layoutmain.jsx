import Header from "./Header";
import Footer from "./post/Footer";
import { Outlet } from "react-router-dom";

const LayoutMain = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow mt-[110px]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default LayoutMain;
