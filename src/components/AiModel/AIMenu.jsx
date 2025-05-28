import {
  IconButton,
  Menu,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRef, useState } from "react";
import axios from "axios";
import { server } from "../../constants/config";
import { toast } from "react-toastify";
import { Trash } from "phosphor-react";

const AiDeleteMenu = ({ chatId, userId, setChatHistory }) => {
  const deleteMenuAnchor = useRef(null);
  const [isDeleteMenu, setIsDeleteMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openHandler = () => setIsDeleteMenu(true);
  const closeHandler = () => setIsDeleteMenu(false);

  const handleDeleteAIResponses = async () => {
    if (!chatId || deleting) return;

    setDeleting(true);
    try {
      await axios.delete(`${server}/api/v1/chat/ai/delete`, {
        data: { chatId, userId },
        withCredentials: true,
      });

      setChatHistory([]); // Clear from UI
      toast.success("Conversation history deleted.");

      // toast.success("Deleted!", {
      //   position: "bottom-center",
      //   theme: "dark",
      //   style: {
      //     width: "fit-content",
      //   },
      // });
    } catch (err) {
      console.error("❌ Failed to delete AI responses", err);
      toast.error("❌ Failed to delete AI responses");
    } finally {
      setDeleting(false);
      closeHandler();
    }
  };

  return (
    <>
      <IconButton onClick={openHandler} ref={deleteMenuAnchor}>
        <MoreVertIcon />
      </IconButton>

      <Menu
        open={isDeleteMenu}
        onClose={closeHandler}
        anchorEl={deleteMenuAnchor.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "var(--color-mainLight)",
              color: "var(--color-textP)",
              boxShadow: 3,
              borderRadius: "8px",
              marginTop: "0.5rem",
            },
          },
        }}
      >
        <Stack
          sx={{
            width: "fit-contact",
            padding: "0.4rem 1rem 0.4rem 0.5rem",
            cursor: deleting ? "not-allowed" : "pointer",
            opacity: deleting ? 0.6 : 1,
          }}
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={handleDeleteAIResponses}
        >
          {deleting ? (
            <CircularProgress size={16} thickness={5} sx={{ color: "red" }} />
          ) : (
            <div className="text-red text-[1.3rem]">
              <Trash />
            </div>
          )}
          <Typography sx={{ fontSize: "0.8rem" }}>
            {deleting ? "Deleting..." : "Delete"}
          </Typography>
        </Stack>
      </Menu>
    </>
  );
};

export default AiDeleteMenu;
