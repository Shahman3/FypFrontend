import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  ListItem,
  Stack,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";
import { useTheme } from "@mui/material/styles";
import ImagePreview from "../shared/ImagePerview";
import { useState } from "react";

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { isLoading, data, error, isError, refetch } =
    useGetNotificationsQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({ _id, accept }) => {
    // dispatch(setIsNotification(false));
    await acceptRequest(accept ? "Accepting..." : "Rejecting...", {
      requestId: _id,
      accept,
    });
    await refetch();
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);

  return (
    <Dialog
      open={isNotification}
      onClose={closeHandler}
      fullScreen={isMobile}
      slotProps={{
        backdrop: {
          sx: {
            // backgroundColor: "rgba(0, 0, 0, 0.2)",
            backgroundColor: "rgba(225, 243, 244, 0.6)", // matching your bg
            backdropFilter: "blur(3px)",
          },
        },
      }}
      PaperProps={{
        sx: {
          width: isMobile ? "100vw" : "40rem",
          maxWidth: "100%",
          height: isMobile ? "100vh" : "auto",
          maxHeight: "100%",
          padding: isMobile ? "0rem 1.5rem 1rem 1.5rem" : "0rem 2rem 1rem 2rem",
          position: "relative",
          backgroundColor: "var(--color-mainLight)",
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(20, 184, 166, 0.3)",
            borderRadius: "10px",
          },
        },
      }}
    >
      <Stack spacing={2}>
        <DialogTitle
          sx={{
            textAlign: `${isMobile ? "" : "center"}`,
            position: "relative",
            color: "var(--color-textP)",
            borderBottom: "1px solid var(--color-main)",
          }}
        >
          Notifications
          {isMobile && (
            <IconButton
              onClick={closeHandler}
              sx={{
                position: "absolute",
                right: 8,
                top: 11,
                color: "inherit",
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>

        {isLoading ? (
          <div className="flex flex-1 justify-center py-4">
            <div className="w-10 h-10 border-4 border-[#0f98a0] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data?.allRequests?.length > 0 ? (
          data.allRequests.map(({ sender, _id }) => (
            <NotificationItem
              sender={sender}
              _id={_id}
              handler={friendRequestHandler}
              key={_id}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>No new notification</Typography>
        )}
      </Stack>
    </Dialog>
  );
};
const NotificationItem = memo(({ sender, _id, handler }) => {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const { name, avatar } = sender;

  return (
    <>
      <ListItem disableGutters>
        <Stack
          direction={"row"}
          spacing={1}
          width={"100%"}
          alignItems={"flex-start"}
          flexWrap={"nowrap"}
          sx={{
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" width="100%">
            <Box
              sx={{
                position: "relative",
                top: { xs: "12px", sm: "0px" },
              }}
            >
              <Avatar
                src={avatar}
                onClick={() => setIsImagePreviewOpen(true)}
              />
            </Box>

            <Typography
              variant="body1"
              sx={{
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                lineHeight: "1.4em",
                maxHeight: "2.8em",
              }}
            >
              {`${name} sent you a friend request.`}
            </Typography>
          </Stack>

          <Stack
            direction={{
              xs: "row",
              sm: "row",
              md: "row",
              lg: "row",
              xl: "row",
            }}
            spacing={1}
            justifyContent="flex-end"
            pl={{ xs: "48px", sm: "20px" }}
          >
            <Button
              size="small"
              onClick={() => handler({ _id, accept: true })}
              variant="contained"
            >
              Accept
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => handler({ _id, accept: false })}
              variant="outlined"
            >
              Reject
            </Button>
          </Stack>
        </Stack>
      </ListItem>

      <ImagePreview
        imageUrl={avatar}
        triggerButton={null}
        isOpen={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
      />
    </>
  );
});

export default Notifications;
