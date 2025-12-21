import { useSelector } from "react-redux";
import { useGetAuthorizeUserQuery } from "../pages/redux/api/authApiSlice";

export const useAuthorized = () => {
  const { data, isLoading } = useGetAuthorizeUserQuery();

  const token = useSelector((state) => state.auth.token);

  const userPermissions =
    data?.data?.role?.permissions.map((permission) => permission.slug) || [];
  // has permission
  const hasPermission = (requiredPermissions) => {
    if (!requiredPermissions) {
      return true;
    }
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );
  };
  // some permission
  const somePermission = (requiredPermissions) => {
    if (!requiredPermissions) {
      return true;
    }
    // Return true if any of the required permissions is present
    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission)
    );
  };

  // has role
  const hasRole = (requiredRoles) => {
    return requiredRoles.includes(data?.data?.role?.id);
  };

  const user = data?.data;

  return {
    user,
    isLoading,
    hasPermission,
    somePermission,
    hasRole,
    userPermissions,
    token,
  };
};
