import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { Toaster as SonnerToaster } from "sonner";
import { ToastContainer, Bounce } from "react-toastify"; // React Toastify
import "react-toastify/dist/ReactToastify.css"; // React Toastify CSS
import { theme } from "./utils/theme.js";
import NetworkStatus from "./components/shared/NetworkStatus.jsx";
import FaviconSetter from "./components/specific/TitleIcon.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <CssBaseline />
        <div onContextMenu={(e) => e.preventDefault()}>
          <ThemeProvider theme={theme}>
            <NetworkStatus />
            <FaviconSetter />
            <App />
          </ThemeProvider>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            // theme="colored"
            theme="light"
            bodyClassName="toastBody"
            transition={Bounce}
          />
          <SonnerToaster />
        </div>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
