import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import { IconButton, Stack, Typography } from "@mui/material";
import {
  ArrowBack,
  AttachFile as AttachFileIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { setIsMobile, setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { getSocket } from "../socket";
import AvatarCard from "../components/shared/AvatarCard";

import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";

import AppLayout from "../components/layout/AppLayout";
import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import TypingIndicator from "../components/layout/TypingIndicator";
import AiButton from "../components/AiModel/AiButton";

import pattern from "../assets/pattern1.jpg";
import CustomTooltip from "../utils/tooltip";

import useCurrentWidth from "../utils/CurrentWidth";
import GroupInfoMenu from "../components/group/GroupInfoDialog";
import ImageMultiPreview from "../components/shared/ImageMultiPreview";

import EmojiSelector from "../components/dialogs/EmojiPicker";
import useNetworkStatus from "../utils/UseNetworkStatus";

const Chat = ({
  chatId,
  user,
  chatName,
  chatAvatar,
  handleDeleteChat,
  isGroupChat,
  groupMembers,
  groupAdmin,
  groupDrfaultImg,
  singleDefaultImg,
}) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [showGroupDrawer, setShowGroupDrawer] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const typingTimeout = useRef(null);
  const isOnlineN = useNetworkStatus();
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({
    chatId,
    page,
  });
  const userId = user._id;
  // console.log("User ID:", userId);
  // console.log("chatid", chatId);
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const members = chatDetails?.data?.chat?.members;
  const handleGroupinfoClose = () => {
    setShowGroupDrawer(false);
    // setFileMenuAnchor(e.currentTarget);
  };
  const handleGroupinfoOpen = (e) => {
    if (!isGroupChat) {
      setIsImagePreviewOpen(true);
    } else {
      setShowGroupDrawer(true);
      setFileMenuAnchor(e.currentTarget);
    }
  };
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const handleMobile = () => {
    navigate("/");
    dispatch(setIsMobile(false));
  };

  const widthis = useCurrentWidth();
  useEffect(() => {
    // console.log("Checking width: ", widthis);
    if (widthis > 640) {
      dispatch(setIsMobile(false));
    }
  }, [widthis, dispatch]);

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const tempMessage = {
      _id: `temp-${Date.now()}`,
      sender: user,
      content: message,
      chat: chatId,
      createdAt: new Date().toISOString(),
      attachments: [],
      optimistic: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    socket.emit(NEW_MESSAGE, { chatId, members, message });

    setMessage("");
  };
  // //?
  //   const submitHandler = (e) => {
  //     e.preventDefault();

  //     if (!message.trim()) return;

  //     // Emitting the message to the server
  //     socket.emit(NEW_MESSAGE, { chatId, members, message });
  //     setMessage("");
  //   };
  const scrollToBottom = (smooth = true) => {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "end",
        });
      }
      // behavior: smooth ? "smooth" : "auto",
    }, 50); // Wait for DOM to settle
  };

  useEffect(() => {
    scrollToBottom(); // scroll to bottom when new message is added
  }, [messages]);

  useEffect(() => {
    scrollToBottom(false); // instantly scroll to bottom when chat first loads
  }, [oldMessages]);

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]); // <<--- ADD THIS LINE to reset old messages
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (chatDetails.isError) navigate("/");
  }, [chatDetails.isError]);
  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => {
        const realMsg = data.message;
        const filtered = prev.filter(
          (msg) =>
            !msg.optimistic ||
            msg.content !== realMsg.content ||
            msg.sender._id !== realMsg.sender._id
        );
        return [...filtered, realMsg];
      });
    },
    [chatId]
  );

  // //?
  // const newMessagesListener = useCallback(
  //   (data) => {
  //     if (data.chatId !== chatId) return;

  //     setMessages((prev) => [...prev, data.message]);
  //   },
  //   [chatId]
  // );
  useSocketEvents(socket, {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: ({ chatId: typingChatId, userId }) => {
      if (typingChatId === chatId && userId !== user._id) {
        setUserTyping(true);
      }
    },
    [STOP_TYPING]: ({ chatId: typingChatId, userId }) => {
      if (typingChatId === chatId && userId !== user._id) {
        setUserTyping(false);
      }
    },
  });

  useErrors(errors);

  const allMessages = [...oldMessages, ...messages];

  return (
    <>
      <Fragment>
        <div className="flex flex-col h-screen bg-mainLight">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-main/10 h-18 md:h-18 px-4 py-2 sm:py-4 bg-mainLight shadow-sm">
            {/* LEFT: Avatar and Name */}
            <div className="flex items-center space-x-3 sm:space-x-2 min-w-0 flex-1">
              {/* Mobile back button */}
              <div className="block sm:hidden flex-shrink-0">
                <ArrowBack
                  onClick={handleMobile}
                  className="text-main hover:text-mainHover"
                />
              </div>

              {/* Avatar */}

              <div onClick={handleGroupinfoOpen} className="cursor-pointer">
                <div
                  // ${    !chatAvatar[0] ? "mt-0" : "mt-3" }
                  className={`relative md:mt-0 ${
                    isGroupChat ? "mr-1 md:mr-0" : ""
                  }`}
                >
                  {chatAvatar[0] ? (
                    <AvatarCard avatar={chatAvatar} />
                  ) : (
                    <img
                      src={groupDrfaultImg}
                      alt="default avatar"
                      className="w-[3rem] h-[3rem] mr-0 sm:w-[3.1rem] sm:h-[3.1rem] rounded-full object-cover "
                    />
                  )}
                </div>
              </div>
              {/* Name + Typing */}

              <div className="cursor-pointer flex flex-col min-w-0">
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{ flex: 1, minWidth: 0 }}
                >
                  <CustomTooltip
                    title={chatName}
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
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                        fontWeight: "bold",
                      }}
                    >
                      {chatName}
                    </Typography>
                  </CustomTooltip>
                </Stack>
                {userTyping && (
                  <div className="flex">
                    <TypingIndicator />
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              {isGroupChat && (
                <AiButton
                  allMessages={allMessages}
                  groupName={chatName}
                  groupMembers={groupMembers}
                  userId={userId}
                  chatId={chatId}
                />
              )}
              <IconButton
                onClick={(e) => handleDeleteChat(e, chatId, isGroupChat)}
                sx={{
                  color: "var(--color-main)",
                  "&:hover": { color: "#00bcd4" },
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </div>
          </div>

          {/* MESSAGES */}
          <div
            // className="flex-1 overflow-y-auto"
            // style={{ maxHeight: "calc(100vh - 150px)" }}
            className="flex-1 overflow-y-auto  h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)]  md:h-[calc(100vh-150px)]"
            ref={containerRef}
          >
            <Stack
              padding="1rem"
              spacing="1rem"
              direction="column"
              height="100%"
              sx={{
                background: `url(${pattern})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                overflowX: "hidden",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(20, 184, 166, 0.3)",
                  borderRadius: "10px",
                },
              }}
            >
              {chatDetails.isLoading ||
              oldMessagesChunk.isLoading ||
              oldMessagesChunk.isFetching ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="w-10 h-10 border-4 border-[#0f98a0]/50 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                // <MessagesLoader />
                allMessages.map((i) => (
                  <MessageComponent
                    key={i._id}
                    message={i}
                    user={user}
                    onMediaLoad={() => scrollToBottom(true)}
                    isGroupChat={isGroupChat}
                  />
                ))
              )}

              <div ref={bottomRef} />
            </Stack>
          </div>

          {/* FOOTER INPUT */}
          <form
            onSubmit={(e) => {
              if (!isOnlineN) return; // prevent submit when offline
              submitHandler(e);
            }}
            // onSubmit={submitHandler}
            className="border-t border-border px-3 py-2 sm:px-4 sm:py-4 bg-white"
          >
            <div className="relative flex items-center space-x-2 sm:space-x-4">
              <button
                type="button"
                onClick={handleFileOpen}
                className="absolute left-2 sm:left-1 text-main hover:text-mainHover"
              >
                <AttachFileIcon fontSize="small" />
              </button>
              <button
                type="button"
                onClick={(e) => e.preventDefault()}
                className="absolute left-7"
              >
                <EmojiSelector message={message} setMessage={setMessage} />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={messageOnChange}
                className="w-full h-11  sm:h-12 pl-12.5  pr-1 sm:pr-3  rounded-md border border-main bg-white text-textP placeholder-textS focus:outline-none focus:ring-2 focus:ring-main shadow-sm text-sm sm:text-base"
              />

              <button
                type="submit"
                className="bg-main hover:bg-mainHover text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <SendIcon fontSize="small" />
              </button>
            </div>
            <FileMenu
              anchorE1={fileMenuAnchor}
              chatId={chatId}
              setFileMenuAnchor={setFileMenuAnchor}
            />
          </form>
        </div>
      </Fragment>

      {isGroupChat && groupMembers?.length > 0 && (
        <GroupInfoMenu
          anchorEl={fileMenuAnchor}
          onClose={handleGroupinfoClose}
          open={showGroupDrawer}
          groupMembers={groupMembers}
          widthis={widthis}
          groupAdmin={groupAdmin}
          chatAvatar={chatAvatar}
          groupDrfaultImg={groupDrfaultImg}
        />
      )}
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
};

export default AppLayout()(Chat);
