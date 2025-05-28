/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
import { Box, Drawer, Grid } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Header from "./Header";
import groupDrfaultImg from "../../assets/group.png";
import singleDefaultImg from "../../assets/userdefault.jpeg";
import BottomNavigation from "./BottomNavigation";
const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();

    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    const currentChat = data?.chats?.find((chat) => chat._id === chatId);
    const chatName = currentChat?.name || "";
    const isGroupChat = currentChat?.groupChat || false;
    const chatAvatar = currentChat?.avatar || "";

    const groupMembers = currentChat?.memgroup || "";
    const groupAdmin = currentChat?.creator || "";

    // console.log("f", groupAdmin);
    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <Box
        sx={{
          marginLeft: {
            xs: "0px", //70px
            sm: "70px",
            md: "90px",
            lg: "90px",
          },
          overflow: "hidden",
          height: "100vh",
        }}
      >
        <Title />
        <Header />
        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        <Grid container height="100vh">
          <Grid
            item
            xs={12}
            sm={5.5}
            md={4}
            lg={4}
            height="100%"
            className="relative"
          >
            <div className="pb-16 sm:pb-0 h-full overflow-y-auto">
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
                isLoading={isLoading}
                groupDrfaultImg={groupDrfaultImg}
                singleDefaultImg={singleDefaultImg}
                isGroupChat={isGroupChat}
              />
            </div>
            {/* Mobile bottom navigation */}
            <div className="sm:hidden">
              <BottomNavigation />
            </div>
          </Grid>

          {/* Show component based on device */}
          {isMobile ? (
            <Drawer
              open={isMobile}
              onClose={handleMobileClose}
              anchor="left"
              variant="temporary"
              ModalProps={{ keepMounted: true }}
              PaperProps={{
                sx: {
                  width: "100vw",
                  height: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "background.paper",
                  boxSizing: "border-box",
                },
              }}
            >
              <WrappedComponent
                {...props}
                chatId={chatId}
                user={user}
                chatName={chatName}
                chatAvatar={chatAvatar}
                handleDeleteChat={handleDeleteChat}
                isGroupChat={isGroupChat}
                groupMembers={groupMembers}
                groupAdmin={groupAdmin}
                groupDrfaultImg={groupDrfaultImg}
                singleDefaultImg={singleDefaultImg}
              />
            </Drawer>
          ) : (
            <Grid
              item
              xs={12}
              sm={6.5}
              md={8}
              lg={8}
              sx={{ display: { xs: "none", sm: "block" } }}
              height="100%"
              width="100%"
            >
              <WrappedComponent
                {...props}
                chatId={chatId}
                user={user}
                chatName={chatName}
                chatAvatar={chatAvatar}
                handleDeleteChat={handleDeleteChat}
                isGroupChat={isGroupChat}
                groupMembers={groupMembers}
                groupAdmin={groupAdmin}
                groupDrfaultImg={groupDrfaultImg}
                singleDefaultImg={singleDefaultImg}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };
};

export default AppLayout;
