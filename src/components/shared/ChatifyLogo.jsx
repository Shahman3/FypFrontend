const ChatifyLogo = () => {
  return (
    <div
      className={`w-16 h-16 rounded-2xl bg-gradient-to-br bg-white text-main shadow-2xl flex items-center justify-center transform transition-transform duration-300 hover:scale-110  logo-wrapper `}
    >
      <svg
        className="ml-2"
        width="55"
        height="55"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* More open "C" */}
        <path
          className="c-path "
          d="M17 7 A8.5 8.5 0 1 0 17 17"
          stroke=" #0f98a0"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* 3 pure white, evenly spaced dots */}
        <circle className="dot" cx="7" cy="12" r="1.5" fill="#0f98a0" />
        <circle className="dot" cx="11" cy="12" r="1.5" fill="#0f98a0" />
        <circle className="dot" cx="15" cy="12" r="1.5" fill="#0f98a0" />
      </svg>
    </div>
  );
};
export default ChatifyLogo;
