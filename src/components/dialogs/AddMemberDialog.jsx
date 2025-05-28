/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useState } from "react";
import UserItem from "../shared/UserItem";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";

const AddMemberDialog = ({ chatId }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { isAddMember } = useSelector((state) => state.misc);

  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);
  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((curr) => curr !== id) : [...prev, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  const addMemberSubmitHandler = () => {
    addMembers("Adding Members...", { members: selectedMembers, chatId });
    closeHandler();
  };

  useErrors([{ isError, error }]);

  return (
    <Dialog
      open={isAddMember}
      onClose={closeHandler}
      fullWidth
      maxWidth="xs"
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
          width: isMobile ? "100vw" : "35rem",
          maxWidth: "100%",
          height: isMobile ? "100vh" : "auto",
          maxHeight: "100%",
          padding: isMobile ? "0rem 1.5rem 1rem 1.5rem" : "0rem 2rem 1rem 2rem",
          // position: "relative",
          bgcolor: "var(--color-mainLight)",
          color: "var(--color-textP)", // optional for text color
          "&::-webkit-scrollbar": {
            width: "5px",
            // height: "5px",
            background: "rgba(20, 184, 166, 0.3)",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(20, 184, 166, 0.3)",
            borderRadius: "10px",
          },
        },
      }}
    >
      <DialogTitle textAlign="center">Add Member</DialogTitle>
      <Stack
        direction="row"
        justifyContent="space-evenly"
        marginBottom={"1rem"}
      >
        <Button
          sx={{
            color: "white",
            background: "var(--color-error)",
            ":hover": {
              color: "white",
              background: "var(--color-error)",
            },
          }}
          onClick={closeHandler}
        >
          Close
        </Button>
        <Button
          onClick={addMemberSubmitHandler}
          variant="contained"
          disabled={isLoadingAddMembers}
          sx={{
            color: "white",
            background: "var(--color-main)",
            ":hover": {
              color: "white",
              background: "var(--color-mainHover)",
            },
          }}
        >
          Add
        </Button>
      </Stack>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        variant="outlined"
        size="small"
        fullWidth
        sx={{
          mb: 2,
          backgroundColor: "white",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
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
            color: "var(--color-textS)",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "var(--color-main)",
          },
        }}
        InputLabelProps={{
          shrink: true,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <DialogContent
        sx={{
          maxHeight: isMobile ? "90vh" : "65vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "5px",
            background: "rgba(20, 184, 166, 0.3)",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(20, 184, 166, 0.3)",
            borderRadius: "10px",
          },
        }}
      >
        <Stack
          sx={{
            padding: "0rem 0.5rem 0rem 0.5rem",
          }}
        >
          <Stack
            spacing={1}
            sx={{
              borderTop: "1px solid #cbd5e1",
              borderBottom: "1px solid #cbd5e1",
            }}
          >
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#0f98a0] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : data?.friends?.length > 0 ? (
              data.friends
                .filter((i) =>
                  i.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((i) => (
                  <UserItem
                    key={i._id}
                    user={i}
                    handler={selectMemberHandler}
                    isAdded={selectedMembers.includes(i._id)}
                    borderStyle={true}
                  />
                ))
            ) : (
              <Typography textAlign="center">No Friends</Typography>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
//  data?.friends?.length > 0 ? (
//   data.friends.map((i) => (
//     <UserItem
//       key={i._id}
//       user={i}
//       handler={selectMemberHandler}
//       isAdded={selectedMembers.includes(i._id)}
//       borderStyle={true}
//     />
//   )))
