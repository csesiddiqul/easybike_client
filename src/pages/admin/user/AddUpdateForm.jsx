import { useEffect } from "react";
import {
  Button,
  Modal,
  Input,
  Form,
  Select,
  Row,
  Col,
  Spin,
} from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/userApiSlice";
import toast from "react-hot-toast";
import { transformErrorsToObjectStructure } from "./../../../utils/main/transformErrorsToObjectStructure";
import { createFormData } from "./../../../utils/main/createFormData";

import { FiSave } from "react-icons/fi";
import { useGetRolesQuery } from "../../redux/api/authorizedApiSlice";

const AddUpdateForm = ({ open, onClose, editData }) => {
  const { data: roles, isLoading: isLoadingRoles } = useGetRolesQuery();

  const [
    createUser,
    {
      isLoading: isLoadingCreate,
      isSuccess: isSuccessCreate,
      data: dataCreate,
      error: errorCreate,
      isError: isErrorCreate,
      reset: resetCreate,
    },
  ] = useCreateUserMutation();

  const [
    updateUser,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      data: dataUpdate,
      error: errorUpdate,
      isError: isErrorUpdate,
      reset: resetUpdate,
    },
  ] = useUpdateUserMutation();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    role_id: Yup.string().required("Role is required"),
    status: Yup.string().required("Status is required"),
    email: Yup.string()
      .email("Email should be valid")
      .required("Email is required"),
  });

  const {
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
    handleSubmit,
    setValues,
    setErrors,
    resetForm,
  } = useFormik({
    initialValues: {
      name: editData?.name || "",
      role_id: editData?.role?.id || "",
      email: editData?.email || "",
      status: editData?.status || "",
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = createFormData(values);

      if (editData) {
        formData.append("id", editData.id);
        formData.append("_method", "PATCH");
        updateUser({ id: editData.id, formData });
      } else {
        createUser(formData);
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
      resetCreate();
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
      resetUpdate();
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

  return (
    <Modal
    className="modal"
      title={editData ? "Update User" : "Add User"}
      open={open}
      onCancel={onClose}
      footer={
        <div className="text-right">
          <Button
            disabled={isLoadingUpdate || isLoadingCreate}
            loading={isLoadingUpdate || isLoadingCreate}
            type="primary"
            onClick={handleSubmit}
            icon={<FiSave />}
          >
            Save
          </Button>
        </div>
      }
      width={700}
    >
      <Form layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Name"
              validateStatus={touched.name && errors.name ? "error" : ""}
              help={touched.name && errors.name ? errors.name : ""}
            >
              <Input
                id="name"
                name="name"
                placeholder="Enter user name"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Email"
              validateStatus={touched.email && errors.email ? "error" : ""}
              help={touched.email && errors.email ? errors.email : ""}
            >
              <Input
                id="email"
                name="email"
                placeholder="Enter user email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Role"
              validateStatus={touched.role_id && errors.role_id ? "error" : ""}
              help={touched.role_id && errors.role_id ? errors.role_id : ""}
            >
              <Select
                showSearch
                placeholder="Select a role"
                value={values.role_id || null}
                onChange={(value) => setValues({ ...values, role_id: value })}
                options={roles?.data.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                filterOption={true}
              />

              {isLoadingRoles && (
                <div className="text-center py-2">
                  <Spin />
                </div>
              )}
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Status"
              validateStatus={touched.status && errors.status ? "error" : ""}
              help={touched.status && errors.status ? errors.status : ""}
            >
              <Select
                id="status"
                name="status"
                placeholder="Select status"
                value={values.status}
                onBlur={handleBlur}
                onChange={(value) => setValues({ ...values, status: value })}
              >
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddUpdateForm;
