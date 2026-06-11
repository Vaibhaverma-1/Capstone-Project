import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAppContext } from "src/context/appContext";
import AppLayout from "src/layout";
import { tokenUtils } from "src/utils/tokenUtils";

const PrivateRoutes = () => {
  const { setUserDetails } = useAppContext();

  useEffect(() => {
    // Restore userDetails from sessionStorage into app context on navigation
    const details = sessionStorage.getItem("userDetails");
    if (details) {
      setUserDetails(JSON.parse(details));
    }
  }, []);

  const isAuthenticated = tokenUtils.isTokenValid();

  return isAuthenticated ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoutes;