/* eslint-disable react/prop-types */
import {
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { MoreVert, Logout } from "@mui/icons-material";
import { setIsMobile } from "../../redux/reducers/misc";

import { useState, useEffect } from "react";
import { Search, Close } from "@mui/icons-material";
import ChatItem from "../shared/ChatItem";
import { useMemo } from "react";
import useCurrentWidth from "../../utils/CurrentWidth";
import { useMediaQuery } from "@mui/material";
import ChatifyLogoFull from "../shared/ChatListLogo";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { userNotExists } from "../../redux/reducers/auth";
import { server } from "../../constants/config";
import api from "../../redux/api/api";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [{ chatId: "", count: 0 }],
  isLoading,
  groupDrfaultImg,
  singleDefaultImg,
  isGroupChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatLastActivity, setChatLastActivity] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();

  const openMenu = Boolean(anchorEl);
  const handleLogoutClick = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };
  const handleCloseDialog = () => setOpenDialog(false);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const isMobile = useMediaQuery("(max-width:640px)");

  useEffect(() => {
    // Load previous chat activity timestamps from local storage
    const storedActivity =
      JSON.parse(localStorage.getItem("chatLastActivity")) || {};
    setChatLastActivity(storedActivity);
  }, []);

  useEffect(() => {
    // Update chat activity whenever a new message is received
    const updatedActivity = { ...chatLastActivity };

    newMessagesAlert.forEach(({ chatId }) => {
      if (chatId && !updatedActivity[chatId]) {
        updatedActivity[chatId] = new Date().toISOString(); // Update last active time
      }
    });

    setChatLastActivity(updatedActivity);
    localStorage.setItem("chatLastActivity", JSON.stringify(updatedActivity)); // Save to localStorage
  }, [newMessagesAlert]);

  useEffect(() => {
    // Persist chat activity when chats are updated
    localStorage.setItem("chatLastActivity", JSON.stringify(chatLastActivity));
  }, [chatLastActivity]);
  const currentWidth = useCurrentWidth();
  // console.log("currentW", currentWidth);
  const handleMobile = () => {
    if (currentWidth <= 640) {
      dispatch(setIsMobile(true));
    } else {
      dispatch(setIsMobile(false));
    }
  };
  // const handleMobile = () => dispatch(setIsMobile(false));
  const sortedChats = useMemo(() => {
    if (!chatLastActivity) return chats;

    return [...chats].sort((a, b) => {
      const timeA = chatLastActivity[a._id]
        ? new Date(chatLastActivity[a._id])
        : new Date(0);
      const timeB = chatLastActivity[b._id]
        ? new Date(chatLastActivity[b._id])
        : new Date(0);
      return timeB - timeA;
    });
  }, [chats, chatLastActivity]);

  const filteredChats = sortedChats.filter((chat) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      chat.name.toLowerCase().includes(lowerCaseQuery) ||
      chat.name
        .toLowerCase()
        .split(" ")
        .some((word) => word.includes(lowerCaseQuery))
    );
  });
  //logout
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      // data = null;
      toast.success(data.message);
      localStorage.removeItem("chatLastActivity");
      dispatch(api.util.resetApiState());
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      localStorage.removeItem("chatLastActivity");
    }
  };
  const handleConfirmLogout = () => {
    setOpenDialog(false);
    logoutHandler(); // your actual logout function
  };
  return (
    <>
      <Stack
        width={w}
        direction={"column"}
        height={"100%"}
        sx={{
          background: "white",
          color: "#0f172a",
          padding: {
            xs: "0.4rem",
            sm: "0.5rem",
            md: "0.5rem",
          },

          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(20, 184, 166, 0.3)",
            borderRadius: "10px",
          },
        }}
        overflow={"hidden"}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "white",
            borderBottom: "1px solid var(--color-border)",
            // pb: 1, // padding bottom to separate from list
          }}
        >
          {isMobile && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                backgroundColor: "white",
              }}
            >
              {/* Left: Logo */}
              <ChatifyLogoFull />

              {/* Right: Icons */}
              <Box display="flex" alignItems="center">
                <IconButton size="small " onClick={handleMenuClick}>
                  <MoreVert
                    sx={{ fontSize: "1.5rem", color: "var(--color-textP)" }}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleCloseMenu}
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
                        // bgcolor: "var(--color-mainLight)",

                        color: "var(--color-textP)",
                        boxShadow: 3,
                        borderRadius: "8px",
                        // marginTop: "0.5rem",
                      },
                    },
                    menuList: {
                      sx: {
                        paddingTop: 0,
                        paddingBottom: 0,
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleLogoutClick}
                    sx={{
                      padding: "0rem 1rem",
                      gap: "0.5rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    <Logout sx={{ fontSize: 20, color: "var(--color-main)" }} />
                    Log out
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          )}
          <TextField
            variant="outlined"
            placeholder="Search user..."
            fullWidth
            margin="dense"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              marginBottom: "10px",

              input: {
                color: "var(--color-textP)",
                "&::placeholder": {
                  color: "var(--color-textS)",
                  opacity: 1,
                },
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "var(--color-border)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--color-main)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--color-main)",
                  borderWidth: "1px",
                },
              },
              // Mobile responsiveness
              "@media (max-width: 640px)": {
                input: {
                  fontSize: "14px",
                  padding: "8px",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "22px",
                  height: "44px",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "var(--color-textP)" }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery("")}>
                    <Close sx={{ color: "var(--color-textP)" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Stack
          sx={{
            overflowY: "auto",
            flex: 1,
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(20, 184, 166, 0.3)",
              borderRadius: "10px",
            },
          }}
        >
          {isLoading ? (
            <div className="flex flex-1  justify-center">
              <div className="w-10 h-10 border-4 border-[#0f98a0]/50 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredChats.length === 0 ? (
            <Typography
              textAlign={"center"}
              padding="1rem"
              color="var(--color-textS)"
            >
              No chats found
            </Typography>
          ) : (
            filteredChats.map((data, index) => {
              const { avatar, _id, name, groupChat, members } = data;

              const newMessageAlert = newMessagesAlert.find(
                ({ chatId }) => chatId === _id
              );

              const isOnline = members?.some((member) =>
                onlineUsers.includes(member)
              );

              return (
                <ChatItem
                  handleMobile={handleMobile}
                  index={index}
                  newMessageAlert={newMessageAlert}
                  isOnline={isOnline}
                  avatar={avatar}
                  name={name}
                  _id={_id}
                  key={_id}
                  groupChat={groupChat}
                  sameSender={chatId === _id}
                  isGroupChat={isGroupChat}
                  groupDrfaultImg={groupDrfaultImg}
                  singleDefaultImg={singleDefaultImg}
                  sx={{
                    transition: "all 0.3s ease",
                    background: chatId === _id ? "#e1f3f4" : "unset",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "6px",
                  }}
                />
              );
            })
          )}
        </Stack>
      </Stack>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            width: "400px",
            minWidth: 300,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.1rem", pb: 0.5 }}>
          Log out Confirmation
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ fontSize: "0.95rem", color: "#444" }}>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            bgcolor: "#f0f0f0", // light gray background for WhatsApp-like feel
            p: 2,
            // px: 2,
            // pb: 1.5,
            // pt: 1.5,
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={handleConfirmLogout}
            sx={{
              color: "#fff",
              background: "var(--color-main)",
              fontWeight: 600,
              textTransform: "none",
              px: 7,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "var(--color-main)",
              },
            }}
            autoFocus
          >
            Yes
          </Button>
          <Button
            onClick={handleCloseDialog}
            sx={{
              backgroundColor: "#fff", // your green var
              color: "var(--color-textS)",
              fontWeight: 600,
              textTransform: "none",
              px: 7,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#fff", // your green var
                color: "var(--color-textS)", // WhatsApp green hover
              },
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatList;
