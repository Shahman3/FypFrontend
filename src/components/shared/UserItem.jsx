/* eslint-disable react/prop-types */

import { PersonAddRounded, PersonRemoveRounded } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  ListItem,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";
import { memo, useState } from "react";
import { transformImage } from "../../lib/features";
import ImagePreview from "./ImagePerview";

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
  borderStyle = false,
}) => {
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const { name, _id, avatar } = user;

  return (
    <>
      <ListItem
        sx={{
          ...(borderStyle && {
            borderBottom: "1px solid #cbd5e1",
          }),
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={{
            xs: 0.5, // 4px
            sm: 1, // 8px
            md: 2, // 16px
          }}
          width={"100%"}
          {...styling}
          sx={{
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(20, 184, 166, 0.3)",
              borderRadius: "10px",
            },
          }}
        >
          <Avatar
            src={transformImage(avatar)}
            onClick={() => setPreviewImageUrl(avatar)}
          />

          <Typography
            variant="body1"
            sx={{
              flexGlow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            }}
            title={name}
          >
            {name}
          </Typography>

          {/* Tooltip for hover effect */}
          <Tooltip arrow>
            <IconButton
              size="medium"
              sx={{
                // bgcolor: isAdded ? "error.main" : "primary.main",
                bgcolor: isAdded ? "var(--color-error)" : "var(--color-main)",
                color: "white",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                "&:hover": {
                  bgcolor: isAdded ? "error.dark" : "var(--color-mainHover)",
                  transform: "scale(1.01)",
                },
              }}
              onClick={() => handler(_id)}
              disabled={handlerIsLoading}
            >
              {isAdded ? (
                <PersonRemoveRounded fontSize="" />
              ) : (
                <PersonAddRounded fontSize="" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </ListItem>
      {previewImageUrl && (
        <ImagePreview
          imageUrl={previewImageUrl}
          triggerButton={null}
          isOpen={previewImageUrl}
          onClose={() => setPreviewImageUrl("")}
        />
      )}
    </>
  );
};

export default memo(UserItem);
