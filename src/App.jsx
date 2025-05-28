import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "./constants/config";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { SocketProvider } from "./socket";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Groups from "./pages/Groups";
import NotFound from "./pages/NotFound";

import { useMyGroupsQuery } from "./redux/api/api";
const App = () => {
  const { user, loader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { data } = useMyGroupsQuery("", {
    skip: !user, // ✅ Only runs when user is available
  });

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch(() => dispatch(userNotExists()));
  }, [dispatch]);

  if (loader) return null; // 👈 Or show a basic loader component

  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes (Authenticated) */}
        <Route
          element={
            <SocketProvider>
              <ProtectRoute user={user} />
            </SocketProvider>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/groups" element={<Groups />} />
        </Route>

        {/* Public Routes (Unauthenticated only) */}
        <Route
          path="/login"
          element={
            <ProtectRoute user={!user} redirect="/">
              <Login />
            </ProtectRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
