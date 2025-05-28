// utils/useNetworkStatus.js
import { useEffect, useState } from "react";

const useNetworkStatus = (intervalMs = 3000) => {
  const [isOnline, setIsOnline] = useState(true);

  const checkInternet = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      await fetch("https://www.google.com/favicon.ico", {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    checkInternet(); // Initial check
    const interval = setInterval(checkInternet, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return isOnline;
};

export default useNetworkStatus;
