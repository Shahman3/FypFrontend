/* eslint-disable react/prop-types */
import { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";

import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";
import CustomTooltip from "../../utils/tooltip";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  // groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  // index = 0,
  handleMobile,
  groupDrfaultImg,
  isGroupChat,
  // sx = {},
  // ...props
}) => {
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down("md"));

  const responsivePadding = isTabletOrMobile ? "0.1rem" : "0.8rem";
  const responsiveMargin = isTabletOrMobile ? "0.6rem" : "0.1rem";

  return (
    <Link
      sx={{
        background: sameSender
          ? "#e1f3f4" // Active chat highlight
          : "white", // Default chat background
        padding: "0",
        color: "#0f172a",
        // ...sx,
        "&:hover": {
          background: "#e1f3f4",
        },
      }}
      to={`/chat/${_id}`}
    >
      <motion.div
        onClick={() => {
          handleMobile();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          position: "relative",
          padding: responsivePadding,
          marginLeft: responsiveMargin,
          transition: "all 0.3s ease",
          borderBottom: "1px solid #e2e8f0",
          // background: sameSender
          //   ? "#e1f3f4" // Active chat highlight
          //   : "white", // Default chat background
          // "&:hover": {
          //   background: "#e1f3f4",
          // },
        }}
      >
        <div
          className={`${
            !avatar[0] ? "mt-3 mb-3" : "mt-4 mb-4"
          } md:mt-1 md:mb-2`}
        >
          {avatar[0] ? (
            <AvatarCard avatar={avatar} />
          ) : (
            <img
              // src={isGroupChat ? groupDrfaultImg : singleDefaultImg}
              src={groupDrfaultImg}
              alt="default avatar"
              className="w-[3,1rem] h-[3.1rem]  rounded-full object-cover "
            />
          )}
        </div>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            flex: 1,
            minWidth: 0,
            position: "relative",
          }}
        >
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
                maxWidth: "100%",
                color: "var(--color-textP)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
                marginRight: "2.2rem",
              }}
            >
              {name}
            </Typography>
          </CustomTooltip>

          {newMessageAlert?.count > 0 && (
            <Typography
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "#0f98a0",
                position: "absolute",
                top: "50%",
                right: "0.5rem",
                transform: "translateY(-50%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontSize: "0.7rem", // slightly smaller for badge
                lineHeight: "1",
              }}
            >
              {newMessageAlert.count}
            </Typography>
          )}
        </Stack>

        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(34, 197, 94, 1) 30%, rgba(22, 163, 74, 1) 100%)",
              boxShadow: "0px 0px 10px rgba(34, 197, 94, 0.8)",
              position: "absolute",
              top: "50%",
              right: "2.2rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
