const BANNER = [
  { src: "./HangMuaDong.webp" },
  { src: "./KhuyenMai.webp" },
  { src: "./XaHangHe.webp" },
];

const Banner = () => {
  return (
    <div className="relative rounded-lg md:h-[640px] h-[220px]">
      <div
        id="header-carousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {BANNER.map((item, index) => (
            <div
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              key={index}
            >
              <img className="w-100" src={item.src} alt="Image" />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
        data-bs-target="#header-carousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon flex justify-center items-center w-6 h-6 rounded-full sm:w-7 sm:h-7 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <span className="hidden">Next</span>
        </span>
      </button>
      <button
        type="button"
        className="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
        data-bs-target="#header-carousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon flex justify-center items-center w-6 h-6 rounded-full sm:w-7 sm:h-7 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <span className="hidden">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Banner;
