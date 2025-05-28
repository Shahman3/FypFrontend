const HomeLoader = () => {
  return (
    <div
      className="h-screen flex flex-col items-center justify-center text-center relative"
      style={{
        background: "#e1f3f4",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div className="w-12 h-12 border-4 border-[#0f98a0] border-t-transparent rounded-full animate-spin mb-6"></div>
    </div>
  );
};

export default HomeLoader;
