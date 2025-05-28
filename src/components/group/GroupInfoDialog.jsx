import {
  Menu,
  Typography,
  IconButton,
  MenuItem,
  Box,
  Chip,
  TextField,
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ImagePreview from "../shared/ImagePerview";
import { useState, useMemo } from "react";
import ImageMultiPreview from "../shared/ImageMultiPreview";

export default function GroupInfoMenu({
  open,
  onClose,
  anchorEl,
  groupMembers = [],
  widthis,
  groupAdmin,
  chatAvatar,
  groupDrfaultImg,
}) {
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [search, setSearch] = useState("");
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const membersWithAdminFirst = useMemo(() => {
    return [...groupMembers].sort((a, b) => {
      if (a._id === groupAdmin?._id) return -1;
      if (b._id === groupAdmin?._id) return 1;
      return 0;
    });
  }, [groupMembers, groupAdmin]);

  const filteredMembers = useMemo(() => {
    return membersWithAdminFirst.filter((member) =>
      member.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [membersWithAdminFirst, search]);

  return (
    <>
      <Menu
        open={open}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: 0 }}
        transformOrigin={{ vertical: "top", horizontal: 0 }}
        slotProps={{
          paper: {
            sx: {
              maxWidth: "250px",
              bgcolor: "var(--color-mainLight)",
              color: "var(--color-textP)",
              boxShadow: 3,
              paddingLeft: 1,
              paddingRight: 1,
              paddingBottom: 1,

              borderRadius: "8px",
              maxHeight: "70vh",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "5px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(20, 184, 166, 0.3)",
                borderRadius: "10px",
              },
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            mx: "auto",
            border: ~`${chatAvatar?.[0] ? "1px solid #cbd5e1" : ""}`,

            overflow: "hidden",
            cursor: "pointer",
            "&:hover .hoverText": {
              opacity: 1,
            },
            "&:hover": {
              transform: "scale(1.05)",
              transition: "transform 0.3s ease",
            },
          }}
          onClick={() => setIsImagePreviewOpen(true)}
        >
          {chatAvatar?.[0] && (
            <>
              {chatAvatar[0] && (
                <img
                  onClick={() => setIsImagePreviewOpen(true)}
                  src={chatAvatar}
                  alt="default avatar"
                  className="w-full h-14  object-cover overflow-hidden  "
                />
              )}
              <Box
                className="hoverText"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                Click to Preview
              </Box>
            </>
          )}
        </Box>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          py={1}
          borderBottom="1px solid #333"
          sx={{
            marginTop: widthis >= 640 ? "0.6rem" : "-0.3rem",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Members ({groupMembers.length})
          </Typography>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: "var(--color-textP)" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Shared Container for Consistent Width */}
        <Box>
          {/* Search */}
          <TextField
            label="Search"
            variant="outlined"
            // placeholder="Search members"
            fullWidth
            size="small"
            margin="dense"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: "4px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "4px",
                "& fieldset": {
                  borderColor: "var(--color-textS)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--color-main)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--color-main)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "var(--color-textS)", // default label color
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "var(--color-main)", // red label on focus
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "var(--color-textP)" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setSearch("")}
                    size="small"
                    sx={{ visibility: search ? "visible" : "hidden" }}
                  >
                    <Close sx={{ color: "var(--color-textP)" }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Members List */}
          {filteredMembers.map((member) => {
            const isAdmin = groupAdmin?._id === member._id;
            return (
              <Box key={member._id}>
                <MenuItem
                  sx={{
                    display: "flex",
                    alignItems: "center",

                    justifyContent: "space-between",
                    gap: 1,
                    py: 1,
                    px: 0, // 👈 remove inner horizontal padding
                  }}
                  disableRipple
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    marginLeft={1}
                  >
                    <img
                      src={member?.avatar}
                      alt={member?.name}
                      onClick={() => setPreviewImageUrl(member?.avatar)}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid #555",
                      }}
                    />
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography
                        variant="body1"
                        sx={{ color: "var(--color-textP)" }}
                      >
                        {member.name}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    {isAdmin && (
                      <Chip
                        label="Admin"
                        size="small"
                        // color="var(--color-main)"
                        sx={{
                          background: "var(--color-main)",
                          marginRight: "4px",
                          color: "white",
                          fontSize: "0.6rem",
                          height: "20px",
                        }}
                      />
                    )}
                  </Box>
                </MenuItem>

                {previewImageUrl && (
                  <ImagePreview
                    imageUrl={previewImageUrl}
                    triggerButton={null}
                    isOpen={previewImageUrl}
                    onClose={() => setPreviewImageUrl("")}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Menu>

      {isImagePreviewOpen && (
        <ImageMultiPreview
          images={chatAvatar}
          triggerButton={null}
          isOpen={isImagePreviewOpen}
          onClose={() => setIsImagePreviewOpen(false)}
        />
      )}
    </>
  );
}
