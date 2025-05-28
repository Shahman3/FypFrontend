/* eslint-disable react/no-unknown-property */
const ChatifyLogoFull = () => {
  return (
    <div
      className="flex items-center pl-1 pt-2 pb-1 bg-white rounded-xl font-bold text-xl"
      style={{
        fontSize: "1.25rem",
        lineHeight: "1.2",
      }}
    >
      {/* "C" Logo as first letter */}
      <div
        className="w-10 h-8 flex items-center justify-center logo-wrapper"
        style={{
          backgroundColor: "#ffffff",
          marginRight: "-10px",
          marginTop: "-1.5px",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="c-path"
            d="M17 7 A8.5 8.5 0 1 0 17 17"
            stroke="#0f98a0"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="7" cy="12" r="1" fill="#0f98a0" />
          <circle cx="11" cy="12" r="1" fill="#0f98a0" />
          <circle cx="15" cy="12" r="1" fill="#0f98a0" />
        </svg>
      </div>

      {/* Remaining text: "hatify" */}
      <span className="text-[#0f172a] font-semibold tracking-tight text-2xl">
        hatify
      </span>

      <style jsx>{`
        .c-path {
          stroke-dasharray: 44;
          stroke-dashoffset: 0;
        }
      `}</style>
    </div>
  );
};

export default ChatifyLogoFull;
