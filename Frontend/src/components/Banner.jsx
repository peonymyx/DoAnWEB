import { Link } from "react-router-dom";

const BANNER = [
  { src: "./HangMuaDong.webp" },
  { src: "./KhuyenMai.webp" },
  { src: "./XaHangHe.webp" },
  { src: "./AnhGiaMoi.webp" },
];

const Banner = () => {
  return (
    <div className="relative md:h-[778px] h-[220px] overflow-hidden">
      <div
        id="header-carousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {BANNER.map((item, index) => (
            <div
              className={`carousel-item object-center object-cover ${
                index === 0 ? "active" : ""
              }`}
              key={index}
            >
              <Link to="/listproducts">
                <img className="w-100" src={item.src} alt="Image" />
              </Link>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none hover:scale-125 transition-transform duration-300"
        data-bs-target="#header-carousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon flex justify-center items-center w-6 h-6 rounded-full sm:w-10 sm:h-10">
          <span className="hidden">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none hover:scale-125 transition-transform duration-300"
        data-bs-target="#header-carousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon flex justify-center items-center w-6 h-6 rounded-full sm:w-10 sm:h-10">
          <span className="hidden">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Banner;
