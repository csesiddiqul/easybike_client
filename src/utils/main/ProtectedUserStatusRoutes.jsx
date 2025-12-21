import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../../components/custom/Loader";
import { useAuthorized } from "../../hooks/useAuthorized";

const ProtectedUserStatusRoutes = () => {
  const { user, isLoading } = useAuthorized();

  if (isLoading) return <Loader />;

  if (user?.status !== "Active") {
    return <Navigate to="/account-disabled" replace />;
  }

  return <Outlet />;
};

export default ProtectedUserStatusRoutes;
