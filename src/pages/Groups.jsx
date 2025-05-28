import GroupsList from "../components/group/GroupsList";
import {
  Add as AddIcon,
  ArrowBack,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
} from "@mui/icons-material";

import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserItem from "../components/shared/UserItem";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
  useMyChatsQuery,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";
import Siderbar from "../components/layout/Sidebar";
import { server } from "../constants/config";

import { toast } from "react-toastify";

import groupDrfaultImg from "../assets/group.png";
import ImagePreview from "../components/shared/ImagePerview";
import useCurrentWidth from "../utils/CurrentWidth";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  // eslint-disable-next-line no-unused-vars
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );
  const { refetch: chatListRefetch } = useMyChatsQuery("");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const [members, setMembers] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      handleAvatarUpload(file);
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file || !chatId) return;

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("chatId", chatId);

    try {
      setIsUploadingAvatar(true);
      const { data } = await axios.put(
        `${server}/api/v1/chat/update-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Optionally refetch group details or update UI
      await groupDetails.refetch();
      myGroups.refetch();
      chatListRefetch();
      toast.success(data.message);

      // Notify success (you could use a snackbar)
      // console.log("Avatar updated:", data);
    } catch (error) {
      console.error("Error updating avatar:", error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);
  const handleMobileOpen = () => setIsMobileMenuOpen(true);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };
  const removeMemberHandler = async (userId) => {
    const res = await removeMember("Removing Member...", { chatId, userId });

    if (res?.message === "Group deleted because it had only one member.") {
      handleMobile();
      navigate("/groups");
    } else {
      await groupDetails.refetch();
    }
  };
  const WindowWidth = useCurrentWidth();
  const ButtonGroup = (
    <div className="flex flex-row gap-2  md:gap-3 p-2 sm:p-3 md:p-4 w-full max-w-3xl mx-auto justify-center sm:items-center items-start">
      {/* Delete Group Button */}
      <button
        onClick={openConfirmDeleteHandler}
        className="w-auto text-[12px] sm:text-[10px] md:text-[14px] sm:w-auto flex items-center justify-center gap-1 px-3 sm:px-4 py-2 bg-red-500/10 text-red-400 font-semibold text-xs sm:text-sm rounded-full border border-red-500/30 hover:bg-red-500/20 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all duration-300 ease-in-out whitespace-nowrap"
        aria-label="Delete Group"
      >
        <DeleteIcon className="text-base sm:text-lg" />
        <span>Delete Group</span>
      </button>

      {/* Add Member Button */}
      <button
        onClick={openAddMemberHandler}
        className="w-auto text-[12px] sm:text-[10px] md:text-[14px] flex items-center justify-center gap-1 px-3 sm:px-4 py-2 bg-blue-500/10 text-blue-400 font-semibold text-xs sm:text-sm rounded-full border border-blue-500/30 hover:bg-blue-500/20 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 ease-in-out whitespace-nowrap"
        aria-label="Add Member"
      >
        <AddIcon className="text-base sm:text-lg" />
        <span>Add Member</span>
      </button>
    </div>
  );

  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"} // Space between elements
      spacing={1}
      padding={0.5}
      color={"black"}
      sx={{
        backgroundColor: "var(--color-mainLight)",
        color: "black",
        borderRadius: 3,
      }}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            sx={{
              width: "75%",
              backgroundColor: "var(--color-white)", // Dark background for input
              borderRadius: 2,
              // padding: "0.75rem",

              "&:focus-within .MuiOutlinedInput-notchedOutline": {
                borderColor: "var(--color-main)", // Green border on focus
              },
            }}
          />
          <IconButton
            onClick={updateGroupName}
            disabled={isLoadingGroupName}
            sx={{
              backgroundColor: "var(--color-main)", //#4caf50 Green button color
              color: "white",
              "&:hover": {
                backgroundColor: "var(--color-mainHover)", // Darker green on hover
              },
              borderRadius: "50%",
              padding: "0.75rem",
              transition: "background-color 0.3s", // Smooth transition for hover effect
            }}
          >
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography
            // variant="h5"
            sx={{
              maxWidth: { xs: "8rem", sm: "12rem", md: "14rem" }, // responsive width
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" }, // responsive width
              color: "var(--color-textP)",
              background: "var(--color-mainLight)",
              fontWeight: 600,
              letterSpacing: "0.5px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
              // padding: "0.5rem",
              // borderRadius: "8px", // optional: makes it smoother
            }}
          >
            {groupName}
          </Typography>

          <IconButton
            disabled={isLoadingGroupName}
            onClick={() => setIsEdit(true)}
            sx={{
              color: "var(--color-main)",
              fontSize: { xs: "1rem", sm: "1rem", md: "1.2rem" }, // responsive width
              backgroundColor: "",
              "&:hover": {
                backgroundColor: "",
              },

              borderRadius: "50%",
              padding: "",
              transition: "background-color 0.3s", // Smooth transition
            }}
          >
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );
  const IconBtns = (
    <>
      <Box
        sx={{
          display: { xs: "block", sm: "none" }, // Corrected display property
          position: "absolute",
          color: "white",
          bgcolor: "var(--color-main)",
          borderRadius: "50%",
          top: "0.4rem",
          left: "0.7rem",
        }}
      >
        <IconButton onClick={handleMobile} sx={{ color: "white" }}>
          <ArrowBack />
        </IconButton>
      </Box>
    </>
  );
  // Responsive sidebar width
  const sidebarWidth = {
    xs: "0px",
    sm: "70px",
    md: "90px",
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
        }}
      >
        {/* Fixed Sidebar */}
        <Box
          component="nav"
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            position: "fixed",
            height: "100vh",
            backgroundColor: "var(--color-mainLight)",
            zIndex: 1200,
          }}
        >
          <Siderbar />
        </Box>

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            ml: sidebarWidth, // match the sidebar width
            flexGrow: 1,
            height: "100vh",
            backgroundColor: "var(--color-mainLight)",
            overflow: "hidden",
          }}
        >
          <Grid container height="100%">
            {/* Left Column (Groups List) */}

            <Grid item xs={12} sm={5.5} md={4}>
              <GroupsList
                onCloseDrawer={handleMobileOpen}
                // onCloseDrawer={handleMobileClose}
                myGroups={myGroups?.data?.groups}
                isLoadingGroup={myGroups.isLoading}
                chatId={chatId}
              />
            </Grid>

            {/* Right Column (Chat Content) */}
            <Grid
              item
              xs={12}
              sm={6.5}
              md={8}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                padding: {
                  xs: "0.2rem 0.2rem ",
                  sm: "0.2rem 0.2rem",
                  md: "0.5rem 3rem",
                }, // responsive width

                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                background: "var(--color-mainLight)",
                color: "var(--color-textP)",
                // boxShadow: "0 4px 12px var(--color-main)",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(20, 184, 166, 0.3)",
                  borderRadius: "8px",
                  border: "2px solid transparent",
                  backgroundClip: "content-box",
                },
              }}
            >
              <div>{IconBtns}</div>

              {chatId ? (
                <>
                  {groupName && (
                    <>
                      <Box
                        sx={{
                          position: "relative",
                          display: "inline-block",
                          marginTop: "1rem",
                        }}
                      >
                        {groupDetails?.data?.chat?.avatar?.url ? (
                          <Box
                            sx={{
                              position: "relative",
                              height: 110,
                              width: 110,
                              cursor: "pointer",
                              "&:hover .hoverText": {
                                opacity: 1,
                              },
                              "&:hover": {
                                transform: "scale(1.05)",
                                transition: "transform 0.3s ease",
                              },
                            }}
                          >
                            <img
                              src={groupDetails?.data?.chat?.avatar?.url}
                              alt="Group avatar"
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "3px solid var(--color-main)",
                                transition: "transform 0.3s ease",
                              }}
                              onClick={() => setIsImagePreviewOpen(true)}
                            />

                            {/* Text overlay on hover */}
                            <Typography
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
                                pointerEvents: "none", // allows clicking to pass through
                                zIndex: "9999",
                              }}
                            >
                              Click to Preview
                            </Typography>
                          </Box>
                        ) : (
                          <img
                            src={groupDrfaultImg}
                            alt="default avatar"
                            className="w-[110px] h-[110px] rounded-full object-cover "
                          />
                        )}

                        {isUploadingAvatar ? (
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
                                bottom: 1,
                                right: 1,
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

                      <div className="mt-2 mb-1">{GroupName}</div>
                      <Typography
                        // alignSelf="flex-start"
                        variant="body1"
                        sx={{
                          alignSelf: `${
                            WindowWidth > 1300 ? "" : "flex-start"
                          }`,

                          fontWeight: "bold",
                          fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" }, // responsive width
                          // fontSize: "1.2rem",
                        }}
                      >
                        Members ({members.length})
                      </Typography>

                      <Stack
                        maxWidth="45rem"
                        width="100%"
                        padding={{
                          sm: "1rem",
                          xs: "0",
                          md: "1rem 4rem",
                        }}
                        // spacing="0.5rem"
                        sx={{
                          // height: "calc(100vh - 5rem)",
                          // height: "calc(75vh - 5rem)",
                          minHeight: "5rem",
                          overflowY: "auto",
                          // borderRadius: "10px",
                          borderRadius: "10px 0px 0px 10px",

                          background: "white",
                          boxShadow: "inset 0 0 10px var(--color-main)",
                          padding: {
                            xs: "0.1rem",
                            sm: "0.2rem ",
                            md: "1rem",
                          }, // responsive padding
                          "&::-webkit-scrollbar": {
                            width: "5px",
                            maxHeight: "50vh",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "rgba(20, 184, 166)",
                            borderRadius: "10px 0px 0px 0px",
                          },
                        }}
                      >
                        {members.map((i) => (
                          <UserItem
                            user={i}
                            key={i._id}
                            isAdded
                            styling={{
                              padding: {
                                xs: "0.6rem",
                                sm: "1rem",
                                md: "1rem 2rem",
                              }, // responsive width
                              borderRadius: "1rem",
                              backgroundColor: "var(--color-main)",
                              transition: "all 0.3s ease-in-out",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                            handler={removeMemberHandler}
                          />
                        ))}
                      </Stack>

                      <Box sx={{ marginTop: "0.5rem", width: "100%" }}>
                        {ButtonGroup}
                      </Box>
                    </>
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    minHeight: "calc(100vh - 100px)",
                    display: "flex",
                    marginTop: "3rem",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--color-mainLight)",
                    color: "var(--color-textP)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 3,
                      fontWeight: "bold",
                      color: "var(--color-main)",
                    }}
                  >
                    Choose a group to configure settings
                  </Typography>
                  {/* 
                  <Button
                    variant="contained"
                    onClick={handleMobile}
                    sx={{
                      mt: 2,
                      px: 4,
                      py: 1.5,
                      fontSize: "1rem",
                      display: { xs: "block", sm: "none" },
                      fontWeight: "bold",
                      borderRadius: "30px",
                      background: "var(--color-main)",
                      color: "white",
                      transition: "all 0.3s",
                      "&:hover": {
                        background: "var(--color-main)",
                        transform: "scale(1.08)",
                      },
                    }}
                  >
                    Choose a Group
                  </Button> */}
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Dialogs */}
          {isAddMember && (
            <Suspense fallback={<Backdrop open />}>
              <AddMemberDialog chatId={chatId} />
            </Suspense>
          )}

          {confirmDeleteDialog && (
            <Suspense fallback={<Backdrop open />}>
              <ConfirmDeleteDialog
                open={confirmDeleteDialog}
                handleClose={closeConfirmDeleteHandler}
                deleteHandler={deleteHandler}
              />
            </Suspense>
          )}
          {/* Drawer for mobile sidebar and group list */}
          <Drawer
            sx={{
              display: {
                background: "",
                xs: "block",
                sm: "none",
              },
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileClose}
          >
            <Box sx={{ width: "100vw", height: "100vh" }}>
              <Grid
                item
                xs={12}
                sm={6}
                md={8}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  padding: {
                    xs: "0.2rem 1rem ",
                    sm: "0.2rem 0.2rem",
                    md: "0.5rem 3rem",
                  }, // responsive width

                  height: "100%",
                  overflowY: "auto",
                  overflowX: "hidden",
                  background: "var(--color-mainLight)",
                  color: "var(--color-textP)",
                  // boxShadow: "0 4px 12px var(--color-main)",
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(20, 184, 166, 0.3)",
                    borderRadius: "8px",
                    border: "2px solid transparent",
                    backgroundClip: "content-box",
                  },
                }}
              >
                <div>{IconBtns}</div>

                {chatId ? (
                  <>
                    {groupName && (
                      <>
                        <Box
                          sx={{
                            position: "relative",
                            display: "inline-block",
                            marginTop: "1rem",
                          }}
                        >
                          {groupDetails?.data?.chat?.avatar?.url ? (
                            <Box
                              sx={{
                                position: "relative",
                                height: 110,
                                width: 110,
                                cursor: "pointer",
                                "&:hover .hoverText": {
                                  opacity: 1,
                                },
                                "&:hover": {
                                  transform: "scale(1.05)",
                                  transition: "transform 0.3s ease",
                                },
                              }}
                            >
                              <img
                                src={groupDetails?.data?.chat?.avatar?.url}
                                alt="Group avatar"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  border: "3px solid var(--color-main)",
                                  transition: "transform 0.3s ease",
                                }}
                                onClick={() => setIsImagePreviewOpen(true)}
                              />

                              {/* Text overlay on hover */}
                              <Typography
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
                                  pointerEvents: "none", // allows clicking to pass through
                                  zIndex: "9999",
                                }}
                              >
                                Click to Preview
                              </Typography>
                            </Box>
                          ) : (
                            <img
                              src={groupDrfaultImg}
                              alt="default avatar"
                              className="w-[100px] h-[100px] rounded-full object-cover "
                            />
                          )}

                          {isUploadingAvatar ? (
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
                                  bottom: 1,
                                  right: 1,
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
                        <div className="mt-2 mb-1">{GroupName}</div>
                        <Typography
                          alignSelf="flex-start"
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            fontSize: {
                              xs: "0.8rem",
                              sm: "1rem",
                              md: "1.2rem",
                            }, // responsive width
                            // fontSize: "1.2rem",
                          }}
                        >
                          Members ({members.length})
                        </Typography>

                        <Stack
                          maxWidth="45rem"
                          width="100%"
                          padding={{
                            sm: "1rem",
                            xs: "0",
                            md: "1rem 4rem",
                          }}
                          // spacing="0.5rem"
                          sx={{
                            // height: "calc(100vh - 5rem)",
                            // height: "calc(75vh - 5rem)",
                            minHeight: "5rem",
                            overflowY: "auto",
                            // borderRadius: "10px",
                            borderRadius: "10px 0px 0px 10px",

                            background: "white",
                            boxShadow: "inset 0 0 10px var(--color-main)",
                            padding: {
                              xs: "0.1rem",
                              sm: "0.2rem ",
                              md: "1rem",
                            }, // responsive padding
                            "&::-webkit-scrollbar": {
                              width: "5px",
                              maxHeight: "50vh",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              background: "rgba(20, 184, 166)",
                              borderRadius: "10px 0px 0px 0px",
                            },
                          }}
                        >
                          {members.map((i) => (
                            <UserItem
                              user={i}
                              key={i._id}
                              isAdded
                              styling={{
                                padding: {
                                  xs: "0.6rem",
                                  sm: "1rem",
                                  md: "1rem 2rem",
                                }, // responsive width
                                borderRadius: "1rem",
                                backgroundColor: "var(--color-main)",
                                transition: "all 0.3s ease-in-out",
                                "&:hover": {
                                  transform: "scale(1.05)",
                                },
                              }}
                              handler={removeMemberHandler}
                            />
                          ))}
                        </Stack>

                        <Box sx={{ marginTop: "0.5rem", width: "100%" }}>
                          {ButtonGroup}
                        </Box>
                      </>
                    )}
                  </>
                ) : (
                  <Box
                    sx={{
                      minHeight: "calc(100vh - 100px)",
                      display: "flex",
                      marginTop: "3rem",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--color-mainLight)",
                      color: "var(--color-textP)",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 3,
                        fontWeight: "bold",
                        color: "var(--color-main)",
                      }}
                    >
                      Choose a group to configure settings
                    </Typography>

                    {/* <Button
                      variant="contained"
                      onClick={handleMobile}
                      sx={{
                        mt: 2,
                        px: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        display: { xs: "block", sm: "none" },
                        fontWeight: "bold",
                        borderRadius: "30px",
                        background: "var(--color-main)",
                        color: "white",
                        transition: "all 0.3s",
                        "&:hover": {
                          background: "var(--color-main)",
                          transform: "scale(1.08)",
                        },
                      }}
                    >
                      Choose a Group
                    </Button> */}
                  </Box>
                )}
              </Grid>
            </Box>
          </Drawer>
        </Box>
      </Box>
      {isImagePreviewOpen && (
        <ImagePreview
          imageUrl={groupDetails?.data?.chat?.avatar?.url}
          triggerButton={null}
          isOpen={isImagePreviewOpen}
          onClose={() => setIsImagePreviewOpen(false)}
        />
      )}
    </>
  );
};

export default Groups;
