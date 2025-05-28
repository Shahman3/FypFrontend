import { useEffect } from "react";

const FaviconSetter = () => {
  useEffect(() => {
    const svgFavicon = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M17 7 A8.5 8.5 0 1 0 17 17" stroke="#0f98a0" stroke-width="3" stroke-linecap="round" fill="none"/>
        <circle cx="7" cy="12" r="1" fill="#0f98a0"/>
        <circle cx="11" cy="12" r="1" fill="#0f98a0"/>
        <circle cx="15" cy="12" r="1" fill="#0f98a0"/>
      </svg>
    `;

    const blob = new Blob([svgFavicon], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const existingFavicon = document.querySelector("link[rel='icon']");
    if (existingFavicon) {
      existingFavicon.href = url;
    } else {
      const favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.type = "image/svg+xml";
      favicon.href = url;
      document.head.appendChild(favicon);
    }

    return () => {
      URL.revokeObjectURL(url); // Cleanup on unmount
    };
  }, []);

  return null; // This component does not render anything
};

export default FaviconSetter;
