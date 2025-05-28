import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import { transformImage } from "../../lib/features";
const AvatarCard = ({ avatar = [], max = 4 }) => {
  const safeAvatars = Array.isArray(avatar) ? avatar : [];
  const avatarCount = safeAvatars.length;

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        width: "",
      }}
    >
      <AvatarGroup max={max} sx={{ position: "relative" }}>
        <Box
          sx={{
            width: {
              xs: avatarCount > 1 ? "4rem" : "3rem",
              sm: avatarCount > 1 ? "4rem" : "3rem",
              md: avatarCount > 1 ? "5rem" : "3rem",
            },
            height: {
              xs: "3rem",
              sm: "3rem",
              md: "3rem",
            },
          }}
        >
          {safeAvatars.map((i, index) => (
            <Avatar
              key={index}
              src={transformImage(i)}
              alt={`Avatar ${index}`}
              sx={{
                width: {
                  xs: "2.9rem",
                  sm: "2.9rem",
                  md: "3rem",
                },
                height: {
                  xs: "2.9rem",
                  sm: "2.9rem",
                  md: "3rem",
                },
                position: "absolute",
                left: `${index}rem`,
                // left: {
                //   xs: `${0.2 + index * 0.6}rem`,
                //   sm: `${0.2 + index * 0.7}rem`,
                //   md: `${index}rem`,
                // },

                outline: "2px solid #0f98a0",
                outlineOffset: "-2px",
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};
export default AvatarCard;
