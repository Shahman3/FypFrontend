// hooks/useCurrentWidth.js
import { useState, useEffect } from "react";

function useCurrentWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default useCurrentWidth;
//?To use
// import useCurrentWidth from "../hooks/useCurrentWidth";

// const MyComponent = () => {
//   const width = useCurrentWidth();
//   const isMobile = width < 640;

//   return (
//     <>
//       {isMobile ? (
//         <p>You are on a mobile device</p>
//       ) : (
//         <p>This is a desktop screen</p>
//       )}
//     </>
//   );
// };
//?
// import { useState, useEffect } from "react";

// function CurrentWidth() {
//   const [width, setWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     const handleResize = () => setWidth(window.innerWidth);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return width;
// }
// export default CurrentWidth;
