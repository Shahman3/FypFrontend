// utils/toastHelper.js

import { toast } from "react-toastify";

export const showToast = {
  loading: (message) => toast.loading(message),
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast.info(message),
  warning: (message) => toast.warning(message),
};
//?Now use it anywhere:
// import { showToast } from "../utils/toastHelper";

// // For loading state
// const loadingToastId = showToast.loading("Loading...");

// // After operation
// toast.update(loadingToastId, {
//   render: "Operation successful!",
//   type: "success",
//   isLoading: false,
//   autoClose: 3000
// });

// // On error
// toast.update(loadingToastId, {
//   render: "Something went wrong!",
//   type: "error",
//   isLoading: false,
//   autoClose: 3000
// });
