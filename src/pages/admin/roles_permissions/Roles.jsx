import {useEffect, useState } from "react";
import { Badge, Button, Collapse, Popconfirm } from "antd";
import { FiEdit, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import AddUpdateForm from "./AddUpdateForm";
import toast from "react-hot-toast";
import {
  useDeleteRoleMutation,
  useGetRolesQuery,
} from "../../redux/api/authorizedApiSlice";
import Loader from "../../../components/custom/Loader";
import { useAuthorized } from "../../../hooks/useAuthorized";
import { Utils } from "../../../utils/utils";

const Roles = () => {
  const { hasPermission } = useAuthorized();
  // for edit
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // handle delete
  const [
    deleteData,
    {
      isLoading: isLoadingDelete,
      isSuccess: isSuccessDelete,
      data: dataDelete,
      error: errorDelete,
      isError: isErrorDelete,
      reset: resetDelete,
    },
  ] = useDeleteRoleMutation();

  // handle fetching
  const { data: roles, isLoading } = useGetRolesQuery();

  // Handle add/edit
  const handleClose = () => {
    setEditData(null);
    setOpen(false);
  };

  const handleAdd = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setOpen(true);
  };

  useEffect(() => {
    if (isSuccessDelete) {
      toast.success(dataDelete?.message || "Deleted successfully");
      resetDelete();
    }
    if (isErrorDelete) {
      toast.error(errorDelete?.data?.data || "Failed to delete");
      resetDelete();
    }
  }, [isSuccessDelete, isErrorDelete, dataDelete, errorDelete, resetDelete]);

  const items = roles?.data.map((role, i) => {
    // Step 1: Group permissions by the 'group' property
    const groupedPermissions = role.permissions.reduce((acc, permission) => {
      const groupName = permission.group;
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(permission);
      return acc;
    }, {});

    // Step 2: Render the grouped data
    return {
      key: i,
      label: (
        <div className="flex justify-between ">
          <span className="font-semibold">{role?.name}</span>
          <div>
            <div className="flex items-center gap-2">
              {hasPermission([Utils.permissions.edit_role]) && (
                <Button onClick={() => handleEdit(role)}>
                  <FiEdit />
                </Button>
              )}
              {hasPermission([Utils.permissions.delete_role]) && (
                <Popconfirm
                  title="Are you sure you want to delete this data?"
                  onConfirm={() => deleteData(role?.id)}
                  onCancel={() => toast.error("Delete cancelled")}
                  okText="Yes"
                  cancelText="No"
                  placement="topRight"
                >
                  <Button danger loading={isLoadingDelete}>
                    <FiTrash2 />
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>
        </div>
      ),
      children: (
        <div key={i}>
          <div className="pb-3 font-semibold m-1">Permissions</div>
          {Object.entries(groupedPermissions).map(
            ([groupName, permissions], groupIndex) => (
              <div key={groupIndex}>
                <div className="font-semibold m-1">{groupName}</div>
                {permissions.map((permission, index) => (
                  <Badge
                    key={index}
                    className="site-badge-count-109 m-1"
                    count={permission?.name}
                    style={{
                      backgroundColor: "#52c41a",
                    }}
                  />
                ))}
              </div>
            )
          )}
        </div>
      ),
    };
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="card-layout">
      <div className="flex justify-between headerbg items-center py-2 mb-4">
        <h1 className="text-xl font-bold text-gray-600 dark:text-gray-300">
          Roles
        </h1>
        {hasPermission([Utils.permissions.create_role]) && (
          <Button type="primary" onClick={handleAdd}>
            <FiPlusCircle /> Create
          </Button>
        )}
      </div>
      <div className="pb-8">
        <Collapse accordion items={items} />
      </div>
      <AddUpdateForm open={open} onClose={handleClose} editData={editData} />
    </div>
  );
};

export default Roles;
