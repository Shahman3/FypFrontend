import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";

import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import { toast } from "react-toastify";

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);
  const groupName = useInputValidation("");
  const search = useInputValidation(""); // ← NEW
  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [{ isError, error }];
  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers.length < 1)
      return toast.error("Please Select Atleast 1 Members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };
  const filteredFriends = data?.friends?.filter((friend) =>
    friend.name.toLowerCase().includes(search.value.toLowerCase())
  );
  return (
    // <Dialog
    //   onClose={closeHandler}
    //   open={isNewGroup}
    //   fullScreen={isMobile}
    //   slotProps={{
    //     backdrop: {
    //       sx: {
    //         // backgroundColor: "rgba(0, 0, 0, 0.2)",
    //         backgroundColor: "rgba(225, 243, 244, 0.6)", // matching your bg
    //         backdropFilter: "blur(3px)",
    //       },
    //     },
    //   }}
    //   PaperProps={{
    //     sx: {
    //       width: isMobile ? "100vw" : "30rem",
    //       maxWidth: "100%",
    //       height: isMobile ? "100vh" : "auto",
    //       maxHeight: "100vh",
    //       padding: isMobile
    //         ? "0rem 1.5rem 1.5rem 1.5rem"
    //         : "0rem 2rem 2rem 2rem",
    //       position: "relative",
    //       backgroundColor: "var(--color-mainLight)",
    //       "&::-webkit-scrollbar": {
    //         width: "5px",
    //       },
    //       "&::-webkit-scrollbar-thumb": {
    //         background: "rgba(20, 184, 166, 0.3)",
    //         borderRadius: "10px",
    //       },
    //     },
    //   }}
    // >
    // <DialogTitle
    //   sx={{
    //     textAlign: "center",
    //     position: "relative",
    //     color: "var(--color-textP)",
    //   }}
    // >
    //   New group
    //   {isMobile && (
    //     <IconButton
    //       onClick={closeHandler}
    //       sx={{
    //         position: "absolute",
    //         right: 6,
    //         top: 11,
    //         color: "inherit",
    //       }}
    //     >
    //       <CloseIcon />
    //     </IconButton>
    //   )}
    // </DialogTitle>
    // <Stack spacing={2}>
    //   <TextField
    //     label="Group name"
    //     value={groupName.value}
    //     onChange={groupName.changeHandler}
    //     variant="outlined"
    //     size="small"
    // sx={{
    //   color: "red",
    //   backgroundColor: "white",
    //   borderRadius: "8px",
    //   "& .MuiOutlinedInput-root": {
    //     borderRadius: "8px",
    //     "& fieldset": {
    //       borderColor: "var(--color-textS)", // default border
    //     },
    //     "&:hover fieldset": {
    //       borderColor: "var(--color-main)", // hover color
    //     },
    //     "&.Mui-focused fieldset": {
    //       borderColor: "var(--color-main)", // focus color (e.g. red)
    //     },
    //   },
    //   "& .MuiInputLabel-root": {
    //     color: "var(--color-textS)", // default label color
    //   },
    //   "& .MuiInputLabel-root.Mui-focused": {
    //     color: "var(--color-main)", // red label on focus
    //   },
    // }}
    // InputLabelProps={{
    //   shrink: true,
    // }}
    // InputProps={{
    //   startAdornment: (
    //     <InputAdornment position="start">{<GroupIcon />}</InputAdornment>
    //   ),
    // }}
    //   />
    //   <TextField
    //     label="Search"
    //     value={search.value}
    //     onChange={search.changeHandler}
    //     variant="outlined"
    //     size="small"
    // sx={{
    //   backgroundColor: "white",
    //   borderRadius: "8px",
    //   "& .MuiOutlinedInput-root": {
    //     borderRadius: "8px",
    //     "& fieldset": {
    //       borderColor: "var(--color-textS)",
    //     },
    //     "&:hover fieldset": {
    //       borderColor: "var(--color-main)",
    //     },
    //     "&.Mui-focused fieldset": {
    //       borderColor: "var(--color-main)",
    //     },
    //   },
    //   "& .MuiInputLabel-root": {
    //     color: "var(--color-textS)", // default label color
    //   },
    //   "& .MuiInputLabel-root.Mui-focused": {
    //     color: "var(--color-main)", // red label on focus
    //   },
    // }}
    // InputLabelProps={{
    //   shrink: true,
    // }}
    // InputProps={{
    //   startAdornment: (
    //     <InputAdornment position="start">
    //       <SearchIcon />
    //     </InputAdornment>
    //   ),
    // }}
    //   />
    // <Stack direction="row" justifyContent="space-between">
    //   <Button
    //     variant="text"
    //     onClick={closeHandler}
    //     sx={{
    //       color: "white",
    //       background: "var(--color-error)",
    //       ":hover": {
    //         color: "white",
    //         background: "var(--color-error)",
    //       },
    //     }}
    //   >
    //     Cancel
    //   </Button>
    //   <Button
    //     variant="contained"
    //     onClick={submitHandler}
    //     disabled={isLoadingNewGroup}
    //     sx={{
    //       color: "white",
    //       background: "var(--color-main)",
    //       ":hover": {
    //         color: "white",
    //         background: "var(--color-mainHover)",
    //       },
    //     }}
    //   >
    //     Create
    //   </Button>
    // </Stack>

    //     <Typography
    //       variant="body1"
    //       sx={{ fontWeight: 400, color: "var(--color-textS)" }}
    //     >
    //       All Contacts
    //     </Typography>

    //     <Stack
    //       spacing={1}
    //       sx={{
    //         maxHeight: "100vh", // Use full viewport height
    //         height: "100%",
    //         overflowY: "auto",
    //         // border: "1px solid #cbd5e1",
    //         borderTop: "1px solid #cbd5e1",

    //         "&::-webkit-scrollbar": {
    //           width: "5px",
    //         },
    //         "&::-webkit-scrollbar-thumb": {
    //           background: "rgba(20, 184, 166, 0.3)",
    //           borderRadius: "10px",
    //         },
    //       }}
    //     >
    //       {isLoading ? (
    //         <Skeleton variant="rectangular" height={100} />
    //       ) : filteredFriends?.length ? (
    //         filteredFriends.map((i) => (
    //           <UserItem
    //             user={i}
    //             key={i._id}
    //             handler={selectMemberHandler}
    //             isAdded={selectedMembers.includes(i._id)}
    //             borderStyle={true}
    //           />
    //         ))
    //       ) : (
    //         <Typography variant="body2" textAlign="center">
    //           No users found.
    //         </Typography>
    //       )}
    //     </Stack>
    //   </Stack>
    // </Dialog>
    <Dialog
      onClose={closeHandler}
      open={isNewGroup}
      fullScreen={isMobile}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(225, 243, 244, 0.6)",
            backdropFilter: "blur(3px)",
          },
        },
      }}
      PaperProps={{
        sx: {
          width: isMobile ? "100vw" : "30rem",
          maxWidth: "100%",
          height: isMobile ? "100vh" : "100vh",
          maxHeight: "100vh",
          padding: isMobile ? "0rem 1.5rem 0rem 1.5rem" : "0rem 2rem 0rem 2rem",
          position: "relative",
          backgroundColor: "var(--color-mainLight)",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
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
      <Stack spacing={2} sx={{ flex: 1, overflow: "hidden" }}>
        <DialogTitle
          sx={{
            textAlign: "center",
            position: "relative",
            color: "var(--color-textP)",
            paddingBottom: 0, // Remove bottom padding
            marginBottom: 0,
          }}
        >
          New group
          {isMobile && (
            <IconButton
              onClick={closeHandler}
              sx={{
                position: "absolute",
                right: 6,
                top: 11,
                color: "inherit",
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        {/* Group Name Input */}

        <TextField
          label="Group name"
          value={groupName.value}
          onChange={groupName.changeHandler}
          variant="outlined"
          size="small"
          // Your styling here...
          sx={{
            color: "red",
            // marginTop: "1rem !important",
            backgroundColor: "white",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": {
                borderColor: "var(--color-textS)", // default border
              },
              "&:hover fieldset": {
                borderColor: "var(--color-main)", // hover color
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--color-main)", // focus color (e.g. red)
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
              <InputAdornment position="start">{<GroupIcon />}</InputAdornment>
            ),
          }}
        />

        {/* Search Input */}
        <TextField
          label="Search"
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          // Your styling here...
          sx={{
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
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Action Buttons */}
        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="text"
            onClick={closeHandler}
            sx={{
              color: "white",
              background: "var(--color-error)",
              ":hover": {
                color: "white",
                background: "var(--color-error)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
            sx={{
              color: "white",
              background: "var(--color-main)",
              ":hover": {
                color: "white",
                background: "var(--color-mainHover)",
              },
            }}
          >
            Create
          </Button>
        </Stack>

        <Typography
          variant="body1"
          sx={{ fontWeight: 400, color: "var(--color-textS)" }}
        >
          All Contacts
        </Typography>

        {/* Scrollable user list */}
        <Stack
          spacing={1}
          sx={{
            flex: 1,
            overflowY: "auto",
            borderTop: "1px solid #cbd5e1",
            paddingRight: "4px",

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
            <div className="flex flex-1 justify-center pt-5">
              <div className="w-10 h-10 border-4 border-[#0f98a0]/50 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredFriends?.length ? (
            filteredFriends.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
                borderStyle={true}
              />
            ))
          ) : (
            <Typography variant="body2" textAlign="center">
              No users found.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
