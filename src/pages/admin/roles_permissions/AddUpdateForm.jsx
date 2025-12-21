import React, { useEffect } from "react";
import { Button, Modal, Input, Form, Checkbox, Divider } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { transformErrorsToObjectStructure } from "../../../utils/main/transformErrorsToObjectStructure";
import { FiSave } from "react-icons/fi";
import {
  useCreateRoleMutation,
  useGetPermissionsQuery,
  useUpdateRoleMutation,
} from "../../redux/api/authorizedApiSlice";

const AddUpdateForm = ({ open, onClose, editData }) => {
  const { data: permissions } = useGetPermissionsQuery();

  const [
    create,
    {
      isLoading: isLoadingCreate,
      isSuccess: isSuccessCreate,
      data: dataCreate,
      error: errorCreate,
      isError: isErrorCreate,
      reset: resetCreate,
    },
  ] = useCreateRoleMutation();

  const [
    update,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      data: dataUpdate,
      error: errorUpdate,
      isError: isErrorUpdate,
      reset: resetUpdate,
    },
  ] = useUpdateRoleMutation();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    permissions: Yup.array().required("Permissions are required"),
  });

  const {
    handleBlur,
    handleChange,
    values,
    errors,
    setErrors,
    handleSubmit,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: {
      name: editData?.name || "",
      permissions: editData?.permissions.map((item) => item.id) || [],
    },
    validationSchema,
    onSubmit: (values) => {
      if (editData) {
        update({
          _method: "PUT",
          id: editData.id,
          permissions: values.permissions,
          name: values.name,
        });
      } else {
        create(values);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isSuccessCreate) {
      toast.success(dataCreate?.message || "Created successfully");
      onClose();
      resetForm();
      resetCreate();
    }
    if (isErrorCreate) {
      setErrors(
        transformErrorsToObjectStructure(errorCreate?.data?.errors || {})
      );
      toast.error(errorCreate?.message || "Failed to create");
    }
    if (isSuccessUpdate) {
      toast.success(dataUpdate?.message || "Updated successfully");
      onClose();
      resetForm();
      resetUpdate();
    }
    if (isErrorUpdate) {
      setErrors(
        transformErrorsToObjectStructure(errorUpdate?.data?.errors || {})
      );
      toast.error(errorUpdate?.message || "Failed to update");
    }
  }, [
    isSuccessCreate,
    isErrorCreate,
    isSuccessUpdate,
    isErrorUpdate,
    onClose,
    dataCreate,
    errorCreate,
    dataUpdate,
    errorUpdate,
    setErrors,
    resetForm,
  ]);

  const groupedPermissions = permissions?.data.reduce((acc, permission) => {
    acc[permission.group] = acc[permission.group] || [];
    acc[permission.group].push(permission);
    return acc;
  }, {});

  const handleCheckboxChange = (permissionId) => {
    const updatedPermissions = values.permissions.includes(permissionId)
      ? values.permissions.filter((id) => id !== permissionId)
      : [...values.permissions, permissionId];
    setValues({ ...values, permissions: updatedPermissions });
  };

  return (
    <Modal
    className="modal"
      title={editData ? "Update Role" : "Add Role"}
      open={open}
      onCancel={onClose}
      footer={
        <div className="text-right">
          <Button
            className="px-7"
            type="primary"
            onClick={handleSubmit}
            loading={isLoadingCreate || isLoadingUpdate}
            disabled={isLoadingCreate || isLoadingUpdate}
            icon={<FiSave />}
          >
            Save
          </Button>
        </div>
      }
      width={800}
    >
      <Form layout="vertical" onSubmitCapture={handleSubmit}>
        <Form.Item
          label="Name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name}
        >
          <Input
            id="name"
            name="name"
            type="text"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
          />
        </Form.Item>

        <div className="grid grid-cols-3 gap-3 w-full">
          {groupedPermissions &&
            Object.keys(groupedPermissions).map((group, idx) => (
              <div className="col-span-3 md:col-span-1" key={idx}>
                <div className="p-2 border-md rounded-md bg-slate-100 h-full ">
                  <Divider>{group}</Divider>
                  {groupedPermissions[group].map((permission) => (
                    <div
                      className="hover:bg-white p-2 rounded duration-500"
                      key={permission.id}
                    >
                      <Checkbox
                        checked={values.permissions.includes(permission.id)}
                        onChange={() => handleCheckboxChange(permission.id)}
                      >
                        {permission.name}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </Form>
    </Modal>
  );
};

export default AddUpdateForm;
