import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../../components/custom/Loader";
import { useGetAuthorizeUserQuery } from "../../pages/redux/api/authApiSlice";

const ProtectedAuthorizedRoutes = ({ requiredRoles, requiredPermissions }) => {
  const { data: user, isLoading, isError } = useGetAuthorizeUserQuery();

  if (isLoading) return <Loader />;

  if (isError || !user) return <Navigate to="/login" replace />;

  const userRole = user?.data?.role?.id;
  const userPermissions =
    user?.data?.role?.permissions.map((permission) => permission.slug) || [];

  const userHasRequiredRole = requiredRoles
    ? requiredRoles.includes(userRole)
    : true;
  const userHasRequiredPermissions = requiredPermissions
    ? requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      )
    : true;

  if (!userHasRequiredRole || !userHasRequiredPermissions) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedAuthorizedRoutes;

/* <Route
  element={<ProtectedRoute allowedRoles={['Admin']} requiredPermissions={['VIEW_DASHBOARD']} />}
>
  <Route path="admin/dashboard" element={<Dashboard />} />
</Route>

<Route
  element={<ProtectedRoute allowedRoles={['Admin']} requiredPermissions={['MANAGE_USERS']} />}
>
  <Route path="admin/users" element={<Users />} />
</Route> */
