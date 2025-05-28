/* eslint-disable react/prop-types */
import { useState } from "react";
import { Modal, Button, Box, useMediaQuery } from "@mui/material";
import AiModel from "./AiModel";
import imageai from "../../assets/generative.png";

export default function ChatAIButton({
  allMessages,
  groupName,
  groupMembers,
  userId,
  chatId,
}) {
  const [open, setOpen] = useState(false);
  const isLaptop = useMediaQuery("(min-width:1024px)"); // Tailwind lg breakpoint

  return (
    <>
      {isLaptop ? (
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            px: 2,
            py: 1.2,
            fontSize: "0.7rem",
            fontWeight: 600,
            borderRadius: "9999px",
            textTransform: "none",
            backgroundColor: "rgba(20, 184, 166, 0.1)",
            backdropFilter: "blur(10px)",
            color: "#14b8a6",
            border: "1px solid rgba(20, 184, 166, 0.3)",
            boxShadow: "0 4px 16px rgba(20, 184, 166, 0.2)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(13, 148, 136, 0.2)",
              color: "#0d9488",
              transform: "scale(1.05)",
              boxShadow: "0 6px 18px rgba(13, 148, 136, 0.3)",
            },
          }}
        >
          <p>Chatify</p>
          <div className="w-[20px] ">
            <img src={imageai} alt="Ai" />
          </div>
        </Button>
      ) : (
        <button onClick={() => setOpen(true)} className="text-main w-[30px]">
          <img src={imageai} alt="Ai" />
        </button>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "#e1f3f4",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: 24,
            p: 3,
            borderRadius: "12px",
            color: "#0f172a",
          }}
        >
          {groupMembers?.length > 0 && (
            <AiModel
              allMessages={allMessages}
              groupName={groupName}
              onClose={() => setOpen(false)}
              groupMembers={groupMembers}
              userId={userId}
              chatId={chatId}
            />
          )}
        </Box>
      </Modal>
    </>
  );
}

//! /* eslint-disable react/prop-types */
// import { useState } from "react";
// import { Modal, Button, Box, useMediaQuery } from "@mui/material";
// import AiModel from "./AiModel";
// import imageai from "../assets/generative.png";

// export default function ChatAIButton({ allMessages }) {
//   const [open, setOpen] = useState(false);
//   const isLaptop = useMediaQuery("(min-width:1024px)"); // Tailwind lg breakpoint

//   return (
//     <>
//       {isLaptop ? (
//         <Button
//           variant="contained"
//           onClick={() => setOpen(true)}
//           sx={{
//             px: 2,
//             py: 1.2,
//             fontSize: "0.7rem",
//             fontWeight: 600,
//             borderRadius: "9999px",
//             textTransform: "none",
//             backgroundColor: "rgba(20, 184, 166, 0.1)",
//             backdropFilter: "blur(10px)",
//             color: "#14b8a6",
//             border: "1px solid rgba(20, 184, 166, 0.3)",
//             boxShadow: "0 4px 16px rgba(20, 184, 166, 0.2)",
//             transition: "all 0.3s ease-in-out",
//             "&:hover": {
//               backgroundColor: "rgba(13, 148, 136, 0.2)",
//               color: "#0d9488",
//               transform: "scale(1.05)",
//               boxShadow: "0 6px 18px rgba(13, 148, 136, 0.3)",
//             },
//           }}
//         >
//           <div className="w-[25px] ">
//             <img src={imageai} alt="Ai" />
//           </div>
//           <p>ChatifyAI</p>
//         </Button>
//       ) : (
//         <button onClick={() => setOpen(true)} className="text-main w-[30px]">
//           <img src={imageai} alt="Ai" />
//         </button>
//       )}

//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 500,
//             bgcolor: "#e1f3f4",
//             backdropFilter: "blur(12px)",
//             border: "1px solid rgba(255, 255, 255, 0.05)",
//             boxShadow: 24,
//             p: 3,
//             borderRadius: "12px",
//             color: "#0f172a",
//           }}
//         >
//           <AiModel allMessages={allMessages} onClose={() => setOpen(false)} />
//         </Box>
//       </Modal>
//     </>
//   );
// }
