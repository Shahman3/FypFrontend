/* eslint-disable react/prop-types */
import { Suspense, lazy, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  // setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";
import Profile from "../specific/Profile";

import {
  Chat,
  // Group as GroupIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import PersonAdd from "@mui/icons-material/PersonAdd";
import GroupAdd from "@mui/icons-material/GroupAdd";

import ChatifyLogo from "../shared/ChatifyLogo";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const Siderbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const [openProfile, setOpenProfile] = useState(false);
  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);

  const openSearch = () => dispatch(setIsSearch(true));
  const openNewGroup = () => dispatch(setIsNewGroup(true));
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };
  // const navigateToGroup = () => navigate("/groups");
  const navigateToChat = () => {
    navigate("/");
    // setTimeout(() => {
    //   dispatch(setIsMobile(false));
    //   // dispatch(setIsMobile(true));
    // }, 10); // 50ms is usually enough
  };

  return (
    <>
      <div className="hidden sm:flex bg-main h-screen  flex-col items-center justify-between py-4 w-[0px] sm:w-[70px] md:w-[90px] fixed top-0 left-0 z-40 shadow-md">
        <div className="flex flex-col items-center">
          <ChatifyLogo />
          <div className="flex flex-col items-center gap-5 mt-4">
            <SidebarItem
              title="Chats"
              icon={<Chat />}
              onClick={navigateToChat}
            />
            <SidebarItem
              title="Add Friend"
              icon={<PersonAdd />}
              onClick={openSearch}
            />

            <SidebarItem
              title="Create Group"
              icon={<GroupAdd />}
              onClick={openNewGroup}
            />

            <SidebarItem
              title="Notifications"
              icon={<NotificationsIcon />}
              onClick={openNotification}
              value={notificationCount}
            />
          </div>
        </div>

        <SidebarItem
          title="Profile"
          icon={<PersonIcon />}
          onClick={() => setOpenProfile(true)}
        />
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
const SidebarItem = ({ title, icon, onClick, value }) => {
  return (
    <div className="relative group z-50 sidebar-item">
      <button
        onClick={onClick}
        className="text-white relative p-2 rounded-full transition-all duration-300 hover:bg-mainLight/20"
      >
        {value ? (
          <span
            className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold
 w-5 h-5 flex items-center justify-center rounded-full"
          >
            {value}
          </span>
        ) : null}
        {icon}
      </button>

      {/* Tooltip with controlled delay */}
      <style>
        {`
          .sidebar-item .tooltip {
            transition-delay: 0s;
          }

          .sidebar-item:hover .tooltip {
            transition-delay: 1s;
          }
        `}
      </style>
      <span
        className="tooltip absolute left-full top-1/2 transform -translate-y-1/2 ml-2 
                   bg-white text-textP text-xs px-2 py-1 rounded shadow-md 
                   opacity-0 group-hover:opacity-100 transition-opacity 
                   z-50 whitespace-nowrap pointer-events-none"
      >
        {title}
      </span>
    </div>
  );
};

export default Siderbar;
