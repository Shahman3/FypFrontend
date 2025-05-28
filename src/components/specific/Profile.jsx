/* eslint-disable react/prop-types */
import {
  Stack,
  Typography,
  Modal,
  Box,
  IconButton,
  TextField,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  CalendarMonth,
  Close,
  Logout,
  Edit,
  Edit as EditIcon,
} from "@mui/icons-material";
import api from "../../redux/api/api";
import { useDispatch } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import { useMediaQuery } from "@mui/material";

import axios from "axios";
import { useState } from "react";
import ImagePreview from "../shared/ImagePerview";
import { useRelativeTime } from "../shared/UseRelativeTime";
import { toast } from "react-toastify";
import { transformImage } from "../../lib/features";
import { server } from "../../constants/config";
// import useCurrentWidth from "../../utils/CurrentWidth";

const Profile = ({ user, openProfile, handleClose }) => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);

  const [editField, setEditField] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    name: user?.name,
    username: user?.username,
    bio: user?.bio,
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  // const WindowWidthis = useCurrentWidth();
  const handleLogoutClick = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const isMobile = useMediaQuery("(max-width:640px)");

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
  const updateProfile = async (field, value) => {
    try {
      const { data } = await axios.put(
        `${server}/api/v1/user/update`,
        { [field]: value },
        { withCredentials: true }
      );
      toast.success(data.message);
      setEditField(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setAvatarLoading(true);

      const { data } = await axios.put(
        `${server}/api/v1/user/update-avatar`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Use the updated avatar URL from the API response
      if (data?.avatar?.url) {
        setAvatar(data.avatar.url);
        setUpdatedUser((prev) => ({
          ...prev,
          avatar: { url: data.avatar.url },
        }));
      }
      toast.success("Profile picture updated successfully");

      setAvatarLoading(false);
    } catch (error) {
      toast.error("Profile picture update failed");
      setAvatarLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={openProfile}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(225, 243, 244, 0.6)", // your custom backdrop color
              backdropFilter: "blur(3px)", // blur effect
            },
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "var(--color-white)", // light background tint
            color: "var(--color-textP)", // main text
            p: 4,
            borderRadius: { xs: "0px", sm: "16px" },
            width: { xs: "100%", sm: "80%", md: "60%" },
            maxHeight: "100vh",
            overflowY: "auto",

            backdropFilter: "blur(12px)",

            // Scrollbar styles
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(20, 184, 166, 0.3)", // color-accent transparent
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
          }}
        >
          <IconButton
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              color: "var(--color-textS)",
              "&:hover": {
                color: "var(--color-mainHover)",
              },
            }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>

          <Stack spacing={3} alignItems="center">
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Box
                sx={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  overflow: "hidden",
                  cursor: "pointer",
                  "&:hover img": {
                    transform: "scale(1.05)",
                  },
                  "&:hover .hoverText": {
                    opacity: 1,
                  },
                }}
                onClick={() => setIsImagePreviewOpen(true)}
              >
                {/* Avatar image */}
                <img
                  src={avatar || transformImage(user?.avatar?.url, 200)}
                  alt="User avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    border: "3px solid var(--color-main)",
                    borderRadius: "50%",
                    transition: "transform 0.3s ease",
                  }}
                />

                {/* Hover overlay text */}
                <Box
                  className="hoverText"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none",
                  }}
                >
                  Click to Preview
                </Box>
              </Box>

              {avatarLoading ? (
                <CircularProgress
                  size={40}
                  sx={{
                    position: "absolute",
                    top: "60%",
                    left: "60%",
                    transform: "translate(-60%, -60%)",
                    color: "var(--color-main)",
                  }}
                />
              ) : (
                <label>
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 3,
                      right: 3,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      color: "#ffffff",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                      },
                    }}
                    component="span"
                  >
                    <EditIcon />
                  </IconButton>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </Box>

            {/* Profile Fields
            {["name", "bio", "username"].map
               */}
            {["name", "username"].map((field) => (
              <ProfileField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={updatedUser[field]}
                isEditing={editField === field && field !== "username"}
                onEdit={() => field !== "username" && setEditField(field)}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, [field]: e.target.value })
                }
                onSave={() =>
                  field !== "username" &&
                  updateProfile(field, updatedUser[field])
                }
                isUsername={field === "username"}
              />
            ))}

            <ProfileCard
              label="Joined"
              value={useRelativeTime(user?.createdAt)}
              icon={<CalendarMonth />}
            />

            {!isMobile && (
              <Button
                variant="text"
                startIcon={<Logout />}
                onClick={handleLogoutClick}
                sx={{
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  px: 3,
                  py: 1,
                  backgroundColor: "transparent",
                  color: "#f44336", // MUI red or close to WhatsApp logout red
                  border: "none",
                  boxShadow: "none",
                  borderRadius: "0.5rem",
                  border: "1px solid #e2e8f0",

                  "&:hover": {
                    backgroundColor: "transparent", // soft red hover
                    color: "#d32f2f", // darker red on hover
                    boxShadow: "none",
                  },
                }}
              >
                Log out
              </Button>
            )}
          </Stack>
        </Box>
      </Modal>

      <ImagePreview
        imageUrl={avatar || user?.avatar?.url}
        triggerButton={null}
        isOpen={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
      />

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

const ProfileCard = ({ label, value, icon }) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={2}
    sx={{
      width: "100%",
      p: 2,
      borderRadius: 3,
      bgcolor: "var(--color-main)", // Set to main brand color
      boxShadow: "0px 4px 10px rgba(15, 152, 160, 0.1)", // subtle shadow with brand hue
      backdropFilter: "blur(8px)",
      border: "1px solid var(--color-border)",
    }}
  >
    <Box sx={{ color: "var(--color-white)", fontSize: 24 }}>{icon}</Box>
    <Stack>
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          color: "#fff", // Set text color to white
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: "#fff", // Set text color to white
          fontSize: "0.75rem",
        }}
      >
        {label}
      </Typography>
    </Stack>
  </Stack>
);
const ProfileField = ({
  label,
  value,
  isEditing,
  onEdit,
  onChange,
  onSave,
  isUsername,
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        width: "100%",
        p: 2,
        borderRadius: 3,
        bgcolor: "var(--color-main)", // Set to main brand color
        boxShadow: "0px 4px 10px rgba(15, 152, 160, 0.15)", // subtle shadow
        backdropFilter: "blur(8px)",
        position: "relative",
        border: "1px solid var(--color-border)",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          color="var(--color-textS)"
          variant="caption"
          sx={{
            color: "#fff", // Set label text color to white
            fontSize: "0.75rem",
          }}
        >
          {label}
        </Typography>

        {/* Editable Input Field */}
        {isEditing ? (
          <TextField
            variant="standard"
            value={value}
            onChange={onChange}
            autoFocus
            fullWidth
            sx={{
              mt: 1,
              input: { color: "#fff" }, // Set input text color to white
              "& .MuiInput-underline:before": {
                borderBottomColor: "#fff", // Set the bottom border color to white (default state)
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "#fff", // Set the bottom border color to white (focused state)
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "#fff", // Ensure the hover state also has a white bottom border
              },
            }}
          />
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: isUsername ? "var(--color-textP)" : "#fff", // Username gets accent color
              fontWeight: isUsername ? "bold" : "normal",
              mt: 1,
              wordBreak: "break-word",
            }}
          >
            {value || "Not set"}
          </Typography>
        )}
      </Box>

      {/* Edit/Save Button */}
      {!isUsername && (
        <IconButton
          onClick={isEditing ? onSave : onEdit}
          sx={{
            color: "#fff", // Set button icon color to white
            "&:hover": {
              color: "var(--color-mainLight)", // Keep hover color for the icon button
            },
          }}
        >
          {isEditing ? "✔" : <Edit />}
        </IconButton>
      )}
    </Stack>
  );
};

export default Profile;
