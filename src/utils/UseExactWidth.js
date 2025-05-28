import { useEffect, useState } from "react";

const useExactWidth = (targetWidth) => {
  const [isExactWidth, setIsExactWidth] = useState(
    window.innerWidth === targetWidth
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsExactWidth(width === targetWidth);
    };

    window.addEventListener("resize", handleResize);

    // Trigger once on mount
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [targetWidth]);

  return isExactWidth;
};

export default useExactWidth;
// import useExactWidth from "./useExactWidth"; // your file path

// const MyComponent = () => {
//   const isWidth590 = useExactWidth(590);

//   useEffect(() => {
//     if (isWidth590) {
//       console.log("Window is exactly 590px wide");
//       // Your specific code here
//     }
//   }, [isWidth590]);

//   return <div>Resize to 590px to trigger effect.</div>;
// };
