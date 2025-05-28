/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import {
  Menu,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setIsDeleteMenu, setIsMobile } from "../../redux/reducers/misc";
import {
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api";
import { useDispatch } from "react-redux";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const udispatch = useDispatch();
  const navigate = useNavigate();
  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  // ✅ State to handle confirmation dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [deleteChat, _, deleteChatData] = useAsyncMutation(
    useDeleteChatMutation
  );
  const [leaveGroup, __, leaveGroupData] = useAsyncMutation(
    useLeaveGroupMutation
  );

  const isGroup = selectedDeleteChat.groupChat;

  const closeHandler = () => {
    dispatch(setIsDeleteMenu(false));
    deleteMenuAnchor.current = null;
  };

  const openConfirmDialog = () => {
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  const closeConfirmDialog = () => {
    setIsConfirmOpen(false); // Close confirmation dialog
  };

  const confirmActionHandler = () => {
    closeConfirmDialog(); // Close confirmation dialog
    if (isGroup) {
      leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
      udispatch(setIsMobile(false));
    } else {
      deleteChat("Deleting Chat...", selectedDeleteChat.chatId);
      udispatch(setIsMobile(false));
    }
  };

  useEffect(() => {
    if (deleteChatData || leaveGroupData) navigate("/");
  }, [deleteChatData, leaveGroupData]);

  return (
    <>
      {/* Delete Menu */}
      <Menu
        open={isDeleteMenu}
        onClose={closeHandler}
        anchorEl={deleteMenuAnchor.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "var(--color-mainLight)", // ✅ Background color set to white
              color: "var(--color-textP)", // ✅ Text color set to black
              boxShadow: 3, // ✅ Subtle shadow effect
              borderRadius: "8px", // ✅ Smooth rounded corners
              marginTop: "0.5rem",
            },
          },
        }}
      >
        <Stack
          sx={{
            width: "7rem",
            padding: "0.5rem",
            cursor: "pointer",
          }}
          direction={"row"}
          alignItems={"center"}
          spacing={"0.2rem"}
          onClick={() => {
            closeHandler(); // Close the Menu
            openConfirmDialog(); // Open the confirmation dialog
          }}
        >
          {isGroup ? (
            <>
              <div className="text-red">
                <ExitToAppIcon />
              </div>
              <Typography sx={{ fontSize: "0.7rem" }}>Leave Group</Typography>
            </>
          ) : (
            <>
              <div className="text-red">
                <DeleteIcon />
              </div>
              <Typography sx={{ fontSize: "0.7rem" }}>Delete Chat</Typography>
            </>
          )}
        </Stack>
      </Menu>
      <Dialog
        open={isConfirmOpen}
        onClose={closeConfirmDialog}
        fullWidth
        maxWidth="xs" // Helps with responsiveness
        PaperProps={{
          sx: {
            bgcolor: "white",
            color: "var(--color-textP)",
            boxShadow: 4,
            borderRadius: "12px",
            padding: { xs: "12px", sm: "16px" }, // Responsive padding
            minWidth: { xs: "280px", sm: "320px" }, // Responsive width
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1rem", sm: "1.2rem" }, // Responsive font size
            color: "var(--color-textP)",
          }}
        >
          {isGroup ? "Leave Group?" : "Delete Chat?"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{
              color: "var(--color-textS)",
              fontSize: { xs: "0.9rem", sm: "0.95rem" }, // Smaller font on mobile
            }}
          >
            {isGroup
              ? "Are you sure you want to leave this group? You won't be able to access it again unless invited."
              : "Are you sure you want to delete this friend and all associated chat history? This action cannot be undone."}
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "space-between",
            paddingX: { xs: "12px", sm: "16px" },
            paddingBottom: { xs: "8px", sm: "12px" },
          }}
        >
          <Button
            onClick={closeConfirmDialog}
            sx={{
              color: "var(--color-textP)",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              ":hover": { bgcolor: "transparent" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmActionHandler}
            sx={{
              bgcolor: "#d32f2f",
              color: "white",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              ":hover": { bgcolor: "#b71c1c" },
            }}
          >
            {isGroup ? "Leave" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 
      <Dialog
        open={isConfirmOpen}
        onClose={closeConfirmDialog}
        PaperProps={{
          sx: {
            bgcolor: "white", // Modern dark theme
            color: "var(--color-textP)",
            boxShadow: 4, // Slightly enhanced shadow
            borderRadius: "12px", // More modern rounded edges
            padding: "16px", // Adds some breathing room
            minWidth: "320px", // Ensures a good size
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            color: "var(--color-textP)",
          }}
        >
          {isGroup ? "Leave Group?" : "Delete Chat?"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{ color: "var(--color-textS)", fontSize: "0.95rem" }}
          >
            {isGroup
              ? "Are you sure you want to leave this group? You won't be able to access it again unless invited."
              : "Are you sure you want to delete this friend and all associated chat history? This action cannot be undone."}
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "space-between",
            paddingX: "16px",
            paddingBottom: "12px",
          }}
        >
          <Button
            onClick={closeConfirmDialog}
            sx={{
              color: "var(--color-textP)",
              ":hover": { bgcolor: "" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmActionHandler}
            sx={{
              bgcolor: "#d32f2f",
              color: "white",
              ":hover": { bgcolor: "#b71c1c" },
            }}
          >
            {isGroup ? "Leave" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
};

export default DeleteChatMenu;
