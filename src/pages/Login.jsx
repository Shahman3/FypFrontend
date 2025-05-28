import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../App.css";
import axios from "axios";
import { useState } from "react";
import userdefaultimg from "../assets/userdefault.jpeg";

import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useMyChatsQuery } from "../redux/api/api";

import { VisuallyHiddenInput } from "../components/styles/StyledComponents";

import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";
import ChatifyLogoFull from "../components/shared/ChatifyLogoFull";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  // const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");
  const { refetch } = useMyChatsQuery("");

  const dispatch = useDispatch();
  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");
    setIsLoading(true);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );

      dispatch(userExists(data.user));
      refetch();

      toast.update(toastId, {
        render: data.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: error?.response?.data?.message || "Something Went Wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    // formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      refetch();

      toast.update(toastId, {
        render: data.message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: error?.response?.data?.message || "Something Went Wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className=" bg-mainLight min-h-screen  flex items-center justify-center px-0 sm:px-4 ">
    <div className="bg-mainLight fixed inset-0 flex items-center justify-center px-0 sm:px-4 overflow-hidden">
      <div
        className="max-h-[100vh] overflow-y-auto scroll-smooth  w-full sm:max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-lg "
        style={{
          scrollbarWidth: "thin", // Firefox
          scrollbarColor: "rgba(20, 184, 166, 0.3) transparent",
        }}
      >
        <div className="  w-full flex flex-col items-center bg-white">
          {/* Conditional Rendering: Login or Sign Up */}

          <div className=" w-full">
            <h2 className="text-xl font-semibold mb-4 flex flex-col items-center">
              <ChatifyLogoFull />
              <h1 className="text-2xl font-semibold text-textP mb-2 text-center">
                {isLogin
                  ? "Welcome Back to Chatify!"
                  : "Join the Chatify Community!"}
              </h1>

              <p className="text-sm text-textS mb-2 text-center">
                {isLogin
                  ? "Glad to have you back. Please login to continue your journey with us."
                  : "Create your account and start connecting with people around the world."}
              </p>
            </h2>

            <form
              onSubmit={isLogin ? handleLogin : handleSignUp}
              className="space-y-4"
            >
              {isLogin ? (
                <>
                  {/* Username */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={username.value}
                      onChange={username.changeHandler}
                      className="w-full mt-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-mainLight  focus:border-main"
                    />
                  </div>

                  {/* Password */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password.value}
                        onChange={password.changeHandler}
                        className="w-full mt-1 px-4 py-2 border border-border rounded-md  pr-12  focus:outline-none focus:ring-2 focus:ring-mainLight  focus:border-main"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 text-gray-500 hover:text-main transition"
                        style={{
                          top: "50%",
                          transform: "translateY(-40%)",
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-main text-white px-4 py-2 rounded-md font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Login
                  </button>

                  <p className="text-center  text-sm">OR</p>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={toggleLogin}
                    className="w-full text-main border border-main py-2 rounded-md hover:bg-mainLight"
                  >
                    Sign Up Instead
                  </button>
                </>
              ) : (
                <>
                  {/* Avatar Upload for Sign Up */}
                  <div className="relative mb-4 w-32 h-32 mx-auto">
                    <img
                      src={avatar.preview || userdefaultimg}
                      alt="User Avatar"
                      className="w-full h-full object-cover object-center rounded-full border border-border"
                    />
                    <label className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white rounded-full p-2 cursor-pointer">
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </label>
                  </div>

                  {avatar.error && (
                    <p className="text-red-500 text-xs text-center mb-2 w-fit">
                      {avatar.error}
                    </p>
                  )}

                  {/* Name, Bio, Username, Password Fields */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name.value}
                      onChange={name.changeHandler}
                      className="w-full mt-1 px-4 py-2 border border-border rounded-md  focus:outline-none focus:ring-2 focus:ring-mainLight  focus:border-main"
                    />
                  </div>

                  {/* <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <input
                      type="text"
                      value={bio.value}
                      onChange={bio.changeHandler}
                      className="w-full mt-1 px-4 py-2 border border-border rounded-md  focus:outline-none focus:ring-2 focus:ring-mainLight  focus:border-main"
                    />
                  </div> */}

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={username.value}
                      onChange={username.changeHandler}
                      className="w-full mt-1 px-4 py-2 border border-border rounded-md  focus:outline-none focus:ring-2 focus:ring-mainLight  focus:border-main"
                    />
                  </div>

                  {username.error && (
                    <p className="text-red-500 text-xs text-center mb-2">
                      {username.error}
                    </p>
                  )}

                  {/* Password */}
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password.value}
                        onChange={password.changeHandler}
                        className="w-full mt-1 px-4 py-2 border border-border rounded-md  pr-12  focus:outline-none focus:ring-2 focus:ring-mainLight focus:border-main"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 text-gray-500 hover:text-main transition"
                        style={{
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </button>
                    </div>
                  </div>

                  {/* password end */}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 bg-main text-white px-4 py-2 rounded-md font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sign Up
                  </button>

                  <p className="text-center  text-sm">OR</p>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={toggleLogin}
                    className="w-full text-main border border-main py-2 rounded-md hover:bg-mainLight"
                  >
                    Login Instead
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
