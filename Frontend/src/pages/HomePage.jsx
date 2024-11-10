import Banner from "../components/Banner";
import Activities from "../components/post/Activities";
import Discount from "../components/Discount";
import Message from "./Message";
import About from "../components/post/About";
const HomePage = () => {
  return (
    <>
      <Banner></Banner>
      <About></About>
      <Activities></Activities>
      <Discount></Discount>
      <Message></Message>
    </>
  );
};

export default HomePage;
