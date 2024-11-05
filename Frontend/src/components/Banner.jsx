import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const BANNER = [
  { src: "./HangMuaDong.webp" },
  { src: "./KhuyenMai.webp" },
  { src: "./XaHangHe.webp" },
  { src: "./AnhGiaMoi.webp" },
];

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNER.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? BANNER.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNER.length);
  };

  return (
    <div className="relative md:h-[778px] h-[220px] overflow-hidden">
      <div className="carousel-inner relative w-full h-full">
        <AnimatePresence initial={false}>
          {BANNER.map(
            (item, index) =>
              index === currentIndex && (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link to="/listproducts">
                    <img
                      className="w-full h-full object-cover"
                      src={item.src}
                      alt="Image"
                    />
                  </Link>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
      <button
        type="button"
        className="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none hover:scale-125 transition-transform duration-100"
        onClick={handlePrev}
      >
        <span className="carousel-control-prev-icon flex justify-center items-center w-6 h-6 rounded-full sm:w-10 sm:h-10 text-white">
          <span className="hidden">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none hover:scale-125 transition-transform duration-100"
        onClick={handleNext}
      >
        <span className="carousel-control-next-icon flex justify-center items-center w-6 h-6 rounded-full sm:w-10 sm:h-10  text-white">
          <span className="hidden">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Banner;
