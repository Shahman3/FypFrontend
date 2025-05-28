import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  IconButton,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );
  const [firstLoad, setFirstLoad] = useState(true);

  const dispatch = useDispatch();
  const search = useInputValidation("");
  const [allUsers, setAllUsers] = useState([]); // full users list from API
  const [filteredUsers, setFilteredUsers] = useState([]); // filtered users for display
  const [loadingUsers, setLoadingUsers] = useState(false); // ✅ New state
  const searchCloseHandler = () => dispatch(setIsSearch(false));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  //?
  // Fetch users only once on dialog open or after friend request
  const fetchUsers = async (query = "") => {
    setLoadingUsers(true);
    try {
      const { data } = await searchUser(query);
      setAllUsers(data.users); // save full list
      setFilteredUsers(data.users); // initialize filtered to full list
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
      setFirstLoad(false);
    }
  };

  // Fetch users once when search dialog opens
  useEffect(() => {
    if (isSearch) {
      fetchUsers();
    } else {
      // Clear on close if you want
      setAllUsers([]);
      setFilteredUsers([]);
    }
  }, [isSearch]);

  // Filter users locally when search input changes
  useEffect(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) {
      setFilteredUsers(allUsers);
      return;
    }
    const filtered = allUsers.filter(
      (user) =>
        user.name?.toLowerCase().includes(q) ||
        false ||
        user.email?.toLowerCase().includes(q) ||
        false
    );

    setFilteredUsers(filtered);
  }, [search.value, allUsers]);

  // Send friend request and refetch full users list
  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
    fetchUsers(search.value); // refetch all users from backend (optional)
  };

  return (
    <Dialog
      open={isSearch}
      onClose={searchCloseHandler}
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
          backgroundColor: "var(--color-mainLight)",
          color: "var(--color-textP)",
          width: isMobile ? "100vw" : "90vw",
          maxWidth: isMobile ? "100%" : "25rem",
          height: isMobile ? "100vh" : "auto",
          maxHeight: "100%",
          margin: 0,
          padding: "0rem 2rem 0.5rem 2rem",
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
      <DialogTitle
        sx={{
          textAlign: "center",
          color: "var(--color-textP)",
          // display: "flex",
          // justifyContent: "space-between", // Ensures title and close icon are at the ends
          // alignItems: "center", // Align vertically
          position: "relative",
        }}
      >
        <span>Add New Friends</span>
        {isMobile && (
          <IconButton
            onClick={searchCloseHandler}
            sx={{
              position: "absolute",
              right: "10px", // Right position to place the icon
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-textP)", // You can customize the icon color here
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <Stack direction="column" spacing={2}>
        <TextField
          label="Search"
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          sx={{
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
            shrink: true, // ensures label behaves like expected
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List
          sx={{
            borderTop: "1px solid #cbd5e1",
            maxHeight: "75vh",
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
          {loadingUsers && firstLoad ? (
            <div className="flex flex-1 justify-center py-4">
              <div className="w-10 h-10 border-4 border-[#0f98a0] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            search.value.trim() ? (
              <div className="text-center text-gray-500 py-4">
                No users match your search
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No users found
              </div>
            )
          ) : (
            filteredUsers.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
                borderStyle={true}
              />
            ))
          )}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
