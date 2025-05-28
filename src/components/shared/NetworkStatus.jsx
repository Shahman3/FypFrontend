// components/NetworkStatus.jsx
import { Snackbar, Alert, Slide } from "@mui/material";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import useCurrentWidth from "../../utils/CurrentWidth";
import useNetworkStatus from "../../utils/UseNetworkStatus";

function SlideUpTransition(props) {
  return <Slide {...props} direction="up" />;
}

const NetworkStatus = () => {
  const isOnline = useNetworkStatus();
  const widdthis = useCurrentWidth();
  const fontSize = widdthis < 300 ? "8px" : widdthis < 500 ? "10px" : "12px";

  return (
    <Snackbar
      open={!isOnline}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      TransitionComponent={SlideUpTransition}
    >
      <Alert
        icon={<WifiOffIcon fontSize="inherit" />}
        severity="error"
        variant="filled"
        sx={{
          bgcolor: "#d32f2f",
          fontSize,
          color: "#fff",
          borderRadius: "12px",
          px: widdthis < 500 ? 2 : 3,
          py: widdthis < 500 ? 1 : 1.5,
          fontWeight: widdthis < 600 ? 300 : 500,
          boxShadow: 4,
        }}
      >
        You are offline. Check your internet connection.
      </Alert>
    </Snackbar>
  );
};

export default NetworkStatus;
