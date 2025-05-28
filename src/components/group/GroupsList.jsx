/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import {
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Box,
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

import { Search, Close } from "@mui/icons-material";
import { useState, useEffect, memo } from "react";
import { Link } from "react-router-dom";
import AvatarCard from "../shared/AvatarCard";
import CustomTooltip from "../../utils/tooltip";
import groupDrfaultImg from "../../assets/group.png";

import { useMediaQuery } from "@mui/material";
import BottomNavigation from "./BottomNavigationGroup"; // adjust path if needed
import ChatifyLogoFull from "../shared/ChatListLogo";
import { toast } from "react-toastify";
import axios from "axios";
import { userNotExists } from "../../redux/reducers/auth";
import { server } from "../../constants/config";
import { useDispatch } from "react-redux";
import api from "../../redux/api/api";
const GroupsList = ({
  w = "100%",
  myGroups = [],
  chatId,
  onCloseDrawer,
  isLoadingGroup,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [groupLastActivity, setGroupLastActivity] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const handleLogoutClick = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };
  const handleCloseDialog = () => setOpenDialog(false);
  const dispatch = useDispatch();

  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const isMobile = useMediaQuery("(max-width:640px)");

  useEffect(() => {
    const storedActivity =
      JSON.parse(localStorage.getItem("groupLastActivity")) || {};
    setGroupLastActivity(storedActivity);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "groupLastActivity",
      JSON.stringify(groupLastActivity)
    );
  }, [groupLastActivity]);

  const sortedGroups = [...myGroups].sort((a, b) => {
    const timeA = groupLastActivity[a._id]
      ? new Date(groupLastActivity[a._id])
      : new Date(0);
    const timeB = groupLastActivity[b._id]
      ? new Date(groupLastActivity[b._id])
      : new Date(0);
    return timeB - timeA;
  });

  const filteredGroups = sortedGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
        height={"100vh"}
        sx={{
          background: "white",
          padding: {
            xs: "0.4rem 0.4rem 4.6rem 0.4rem", // bottom padding for BottomNavigation
            sm: "0.5rem",
            md: "0.5rem",
          },
          color: "var(--color-textP)",
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
                  {/* <Settings sx={{ fontSize: 20, color: "var(--color-main)" }} /> */}
                  Log out
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        )}

        {/* Fixed Search Box */}
        <TextField
          variant="outlined"
          placeholder="Search groups..."
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
        {/* Scrollable User List */}
        <Stack
          sx={{
            borderTop: "1px solid var(--color-border)",

            flex: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(20, 184, 166, 0.3)",
              borderRadius: "10px",
            },
          }}
        >
          {isLoadingGroup ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#0f98a0]/50 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <GroupListItem
                    group={group}
                    chatId={chatId}
                    key={group._id}
                    onCloseDrawer={onCloseDrawer}
                  />
                ))
              ) : (
                <Typography
                  textAlign={"center"}
                  padding="1rem"
                  color="var(--color-textS)"
                >
                  No groups found
                </Typography>
              )}
            </>
          )}
        </Stack>
        {/* Bottom Navigation for Mobile */}
        {isMobile && <BottomNavigation />}
      </Stack>

      {/* Show logout conformation  */}
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

const GroupListItem = memo(({ group, chatId, onCloseDrawer }) => {
  const { name, avatar, _id } = group;
  // console.log(avatar);
  return (
    <Link
      to={`?group=${_id}`}
      style={{ textDecoration: "none" }}
      onClick={(e) => {
        if (chatId === _id) {
          e.preventDefault();
          onCloseDrawer && onCloseDrawer();
        } else {
          onCloseDrawer && onCloseDrawer();
        }
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          padding: {
            xs: "9px 11px",
            sm: "10px 11px",
            md: "12px 16px",
          }, // responsive width
          borderBottom: "1px solid #e2e8f0",

          transition: "all 0.3s ease",
          background: chatId === _id ? "var(--color-mainLight)" : "transparent",
          "&:hover": {
            background: "var(--color-mainLight)",
          },
        }}
      >
        <div className={`pb-2 md:pb-1 pt-[7px] md:pt-1 `}>
          {Array.isArray(avatar) && avatar[0] ? (
            <AvatarCard avatar={avatar} />
          ) : (
            <img
              src={groupDrfaultImg}
              alt="default avatar"
              className="w-13 h-13 rounded-full object-cover "
            />
          )}
        </div>
        <CustomTooltip
          title={name}
          placement="bottom"
          enterDelay={500}
          enterNextDelay={500}
          TransitionProps={{ timeout: 300 }}
        >
          <Typography
            noWrap
            sx={{
              display: "inline-block", // important: NOT flex, not block
              color: "var(--color-textP)",
              fontSize: "1rem",
              fontWeight: "bold",
              maxWidth: "100%", // or whatever fits nicely
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            {name}
          </Typography>
        </CustomTooltip>
      </Stack>
    </Link>
  );
});

export default GroupsList;
