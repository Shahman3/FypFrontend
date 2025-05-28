import AppLayout from "../components/layout/AppLayout";
import { useDispatch } from "react-redux";
import { setIsMobile } from "../redux/reducers/misc";

const Home = () => {
  const dispatch = useDispatch();

  const handleMobile = () => dispatch(setIsMobile(false));

  return (
    <div
      className="h-screen flex flex-col items-center justify-center text-center relative"
      style={{
        background: "#e1f3f4", // 🌟 Light subtle background
        fontFamily: "var(--font-sans)",
      }}
    >
      <h5 className="mb-6 font-bold opacity-90 text-2xl cursor-pointer text-[#0f98a0]">
        Select a friend to chat
      </h5>

      {/* Mobile Start Chat Button */}
      <button
        onClick={handleMobile}
        className="mt-4 px-8 py-3 text-base font-bold rounded-full block sm:hidden transition-all duration-300 shadow-md backdrop-blur-md"
        style={{
          backgroundColor: "#0f98a0", // 🌟 Main button color
          color: "white",
          textTransform: "none",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#0b7f85"; // Slightly darker hover
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#0f98a0";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Start Chat
      </button>
    </div>
  );
};

export default AppLayout()(Home);
