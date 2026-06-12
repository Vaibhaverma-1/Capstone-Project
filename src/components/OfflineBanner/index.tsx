import React, { useEffect, useState } from "react";
import { Alert } from "antd";
import "./OfflineBanner.css";

export default function OfflineBanner(): React.JSX.Element | null {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  function handleOnline() {
    setIsOnline(true);
  }

  function handleOffline() {
    setIsOnline(false);
  }

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="offline-banner-container">
      <Alert
        message="Offline Mode"
        description="You are currently offline. Showing cached information. Some functions might be limited."
        type="warning"
        showIcon
        banner
      />
    </div>
  );
}
