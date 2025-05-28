/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { Modal, Box, IconButton, Slider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Fullscreen from "@mui/icons-material/Fullscreen";
import FullscreenExit from "@mui/icons-material/FullscreenExit";
import ZoomIn from "@mui/icons-material/ZoomIn";
import ZoomOut from "@mui/icons-material/ZoomOut";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ImageMultiPreview = ({ images = [], isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const isDragging = useRef(false);
  const startPosition = useRef({ x: 0, y: 0 });

  if (!images.length) return null;

  // Use the full URL (if cleaning causes issues, comment/uncomment accordingly)
  const imageUrl = images[currentIndex];
  // const imageUrl = cleanCloudinaryUrl(images[currentIndex]);

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  const handleZoom = (event, newValue) => setZoom(newValue / 100);

  const handleMouseDown = (event) => {
    isDragging.current = true;
    startPosition.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
  };

  const handleMouseMove = (event) => {
    if (!isDragging.current) return;
    setPosition({
      x: event.clientX - startPosition.current.x,
      y: event.clientY - startPosition.current.y,
    });
  };

  const handleMouseUp = () => (isDragging.current = false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "var(--color-mainLight)",
          // bgcolor: "white",
          color: "var(--color-textP)",
          boxShadow: 24,
          // borderRadius: 2,
          width: isFullScreen ? "100vw" : "90vw",
          height: isFullScreen ? "100vh" : "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          outline: "none",
          overflow: "hidden",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            color: "var(--color-textP)",
            zIndex: 10,
            "&:hover": { color: "red" },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Fullscreen Toggle */}
        <IconButton
          onClick={toggleFullScreen}
          sx={{
            position: "fixed",
            top: 16,
            right: 64,
            color: "var(--color-textP)",
            zIndex: 10,
            "&:hover": { color: "#00bcd4" },
          }}
        >
          {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>

        {/* Image Navigation (Previous) */}
        {/* <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            left: 16,
            color: "var(--color-textP)",
            zIndex: 10,
            "&:hover": { color: "#00bcd4" },
          }}
        >
          <ArrowBackIcon />
        </IconButton> */}

        {/* Image Display */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            position: "relative",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt={`Preview ${currentIndex + 1}`}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
              transition: "transform 0.2s ease-in-out",
              cursor: "grab",
              userSelect: "none",
            }}
          />
        </Box>

        {/* Image Navigation (Next) */}
        {/* <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            right: 16,
            color: "var(--color-textP)",
            zIndex: 10,
            "&:hover": { color: "#00bcd4" },
          }}
        >
          <ArrowForwardIcon />
        </IconButton> */}

        {/* Zoom Controls */}
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
          }}
        >
          <IconButton
            onClick={() => setZoom(Math.max(zoom - 0.1, 0.2))}
            color="primary"
          >
            <ZoomOut />
          </IconButton>
          <Slider
            value={zoom * 100}
            min={20}
            max={300}
            onChange={handleZoom}
            sx={{ width: 150, mx: 2 }}
          />
          <IconButton
            onClick={() => setZoom(Math.min(zoom + 0.1, 3))}
            color="primary"
          >
            <ZoomIn />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default ImageMultiPreview;

//! /* eslint-disable react/prop-types */
// import { useState, useRef } from "react";
// import { Modal, Box, IconButton, Slider } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import Fullscreen from "@mui/icons-material/Fullscreen";
// import FullscreenExit from "@mui/icons-material/FullscreenExit";
// import ZoomIn from "@mui/icons-material/ZoomIn";
// import ZoomOut from "@mui/icons-material/ZoomOut";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// // Function to clean Cloudinary URL (removes low-resolution parameters)
// const cleanCloudinaryUrl = (url) => {
//   return url.replace(/(w_\d+|h_\d+|dpr_auto|q_auto)/g, "");
// };

// const ImageMultiPreview = ({ imageUrl = [], isOpen, onClose }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [zoom, setZoom] = useState(1);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const imgRef = useRef(null);
//   const isDragging = useRef(false);
//   const startPosition = useRef({ x: 0, y: 0 });

//   if (!imageUrl.length) return null;
//   const cleanUrl = cleanCloudinaryUrl(imageUrl[currentIndex]);

//   const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

//   const handleZoom = (event, newValue) => setZoom(newValue / 100);

//   const handleMouseDown = (event) => {
//     isDragging.current = true;
//     startPosition.current = {
//       x: event.clientX - position.x,
//       y: event.clientY - position.y,
//     };
//   };

//   const handleMouseMove = (event) => {
//     if (!isDragging.current) return;
//     setPosition({
//       x: event.clientX - startPosition.current.x,
//       y: event.clientY - startPosition.current.y,
//     });
//   };

//   const handleMouseUp = () => (isDragging.current = false);

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev + 1) % imageUrl.length);
//     setZoom(1);
//     setPosition({ x: 0, y: 0 });
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev - 1 + imageUrl.length) % imageUrl.length);
//     setZoom(1);
//     setPosition({ x: 0, y: 0 });
//   };

//   return (
//     <Modal open={isOpen} onClose={onClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           bgcolor: "black",
//           boxShadow: 24,
//           borderRadius: 2,
//           width: isFullScreen ? "100vw" : "90vw",
//           height: isFullScreen ? "100vh" : "90vh",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           outline: "none",
//           overflow: "hidden",
//         }}
//       >
//         {/* Close Button */}
//         <IconButton
//           onClick={onClose}
//           sx={{
//             position: "fixed",
//             top: 16,
//             right: 16,
//             color: "white",
//             zIndex: 10,
//             "&:hover": { color: "red" },
//           }}
//         >
//           <CloseIcon />
//         </IconButton>

//         {/* Fullscreen Toggle */}
//         <IconButton
//           onClick={toggleFullScreen}
//           sx={{
//             position: "fixed",
//             top: 16,
//             right: 64,
//             color: "white",
//             zIndex: 10,
//             "&:hover": { color: "#00bcd4" },
//           }}
//         >
//           {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
//         </IconButton>

//         {/* Image Navigation (Previous) */}
//         <IconButton
//           onClick={handlePrev}
//           sx={{
//             position: "absolute",
//             left: 16,
//             color: "white",
//             zIndex: 10,
//             "&:hover": { color: "#00bcd4" },
//           }}
//         >
//           <ArrowBackIcon />
//         </IconButton>

//         {/* Image Display */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             width: "100%",
//             height: "100%",
//             overflow: "hidden",
//             position: "relative",
//           }}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onMouseLeave={handleMouseUp}
//         >
//           <img
//             ref={imgRef}
//             src={cleanUrl}
//             alt={`Preview ${currentIndex + 1}`}
//             style={{
//               maxWidth: "100%",
//               maxHeight: "100%",
//               transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
//               transition: "transform 0.2s ease-in-out",
//               cursor: "grab",
//               userSelect: "none",
//             }}
//           />
//         </Box>

//         {/* Image Navigation (Next) */}
//         <IconButton
//           onClick={handleNext}
//           sx={{
//             position: "absolute",
//             right: 16,
//             color: "white",
//             zIndex: 10,
//             "&:hover": { color: "#00bcd4" },
//           }}
//         >
//           <ArrowForwardIcon />
//         </IconButton>

//         {/* Zoom Controls */}
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 16,
//             left: "50%",
//             transform: "translateX(-50%)",
//             display: "flex",
//           }}
//         >
//           <IconButton
//             onClick={() => setZoom(Math.max(zoom - 0.1, 0.2))}
//             color="primary"
//           >
//             <ZoomOut />
//           </IconButton>
//           <Slider
//             value={zoom * 100}
//             min={20}
//             max={300}
//             onChange={handleZoom}
//             sx={{ width: 150, mx: 2 }}
//           />
//           <IconButton
//             onClick={() => setZoom(Math.min(zoom + 0.1, 3))}
//             color="primary"
//           >
//             <ZoomIn />
//           </IconButton>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default ImageMultiPreview;
