import {
  Group as GroupIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import PersonAdd from "@mui/icons-material/PersonAdd";
import GroupAdd from "@mui/icons-material/GroupAdd";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Suspense, lazy, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Profile from "../specific/Profile";

import {
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";
const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const BottomNavigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const [openProfile, setOpenProfile] = useState(false);
  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);
  // const notificationCount = 2;
  const openSearch = () => dispatch(setIsSearch(true));
  const openNewGroup = () => dispatch(setIsNewGroup(true));
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };
  const navigateToGroup = () => navigate("/");

  return (
    <>
      <div className=" fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-around items-center py-3 sm:hidden z-50  border-t  border-t-border">
        <button
          onClick={openSearch}
          className="relative p-2 rounded-full hover:bg-gray-100 transition "
        >
          <PersonAdd className="text-main" />
        </button>

        <button
          onClick={openNewGroup}
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
        >
          <GroupAdd className="text-main" />
        </button>

        <button className="relative p-3 rounded-full bg-main text-white shadow-md">
          <ChatBubbleIcon onClick={navigateToGroup} />
        </button>

        <button
          onClick={openNotification}
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
        >
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {notificationCount}
            </span>
          )}
          <NotificationsIcon className="text-main" />
        </button>

        <button
          onClick={() => setOpenProfile(true)}
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
        >
          <PersonIcon className="text-main" />
        </button>
      </div>
      <Profile
        user={user}
        openProfile={openProfile}
        handleClose={() => setOpenProfile(false)}
      />

      {isSearch && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50" />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50" />}>
          <NotifcationDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 z-50" />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

export default BottomNavigation;
