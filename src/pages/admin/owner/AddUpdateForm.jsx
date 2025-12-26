import { useEffect } from "react";
import { Button, Modal, Input, Form, Row, Col, Upload, Select, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useCreateOwnerMutation,
  useUpdateOwnerMutation,
} from "../../redux/api/ownersApiSlice";
import toast from "react-hot-toast";
import { createFormData } from "../../../utils/main/createFormData";
import { transformErrorsToObjectStructure } from "../../../utils/main/transformErrorsToObjectStructure";
import { FiSave } from "react-icons/fi";

const AddUpdateForm = ({ open, onClose, editData }) => {
  const [
    createOwner,
    {
      isLoading: isLoadingCreate,
      isSuccess: isSuccessCreate,
      data: dataCreate,
      error: errorCreate,
      isError: isErrorCreate,
      reset: resetCreate,
    },
  ] = useCreateOwnerMutation();

  const [
    updateOwner,
    {
      isLoading: isLoadingUpdate,
      isSuccess: isSuccessUpdate,
      data: dataUpdate,
      error: errorUpdate,
      isError: isErrorUpdate,
      reset: resetUpdate,
    },
  ] = useUpdateOwnerMutation();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    phone: Yup.string().required("Phone is required"),
    status: Yup.string().required("Status is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    father_or_husband_name: Yup.string().required("Required"),
    ward_number: Yup.string().required("Required"),
    mohalla_name: Yup.string().required("Required"),
    present_address: Yup.string().required("Required"),
    permanent_address: Yup.string().required("Required"),
  });

  const {
    setValues,
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setErrors,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      name: editData?.user?.name || "",
      phone: editData?.user?.phone || "",
      email: editData?.user?.email || "",
      status: editData?.user?.status || "",
      password: "",
      father_or_husband_name: editData?.father_or_husband_name || "",
      ward_number: editData?.ward_number || "",
      mohalla_name: editData?.mohalla_name || "",
      nid_number: editData?.nid_number || "",
      birth_registration_number: editData?.birth_registration_number || "",
      present_address: editData?.present_address || "",
      permanent_address: editData?.permanent_address || "",
      image: null,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = createFormData(values);

      if (editData) {
        formData.append("_method", "PATCH");
        updateOwner({ id: editData.id, formData });
      } else {
        createOwner(formData);
      }
    },
  });

  useEffect(() => {
    if (isSuccessCreate) {
      toast.success(dataCreate?.message || "Owner created");
      resetForm();
      onClose();
      resetCreate();
    }

    if (isErrorCreate) {
      setErrors(
        transformErrorsToObjectStructure(errorCreate?.data?.errors || {})
      );
      toast.error("Create failed");
      resetCreate();
    }

    if (isSuccessUpdate) {
      toast.success(dataUpdate?.message || "Owner updated");
      resetForm();
      onClose();
      resetUpdate();
    }

    if (isErrorUpdate) {
      setErrors(
        transformErrorsToObjectStructure(errorUpdate?.data?.errors || {})
      );
      toast.error("Update failed");
      resetUpdate();
    }
  }, [
    isSuccessCreate,
    isErrorCreate,
    isSuccessUpdate,
    isErrorUpdate,
  ]);

  return (
    <Modal
      title={editData ? "Update Owner" : "Create Owner"}
      open={open}
      onCancel={onClose}
      width={800}
      footer={
        <Button
          type="primary"
          icon={<FiSave />}
          loading={isLoadingCreate || isLoadingUpdate}
          onClick={handleSubmit}
        >
          Save
        </Button>
      }
    >
      <Form layout="vertical">

        {/* ================= USER ACCOUNT INFO ================= */}
        <Card title="User Account Information" className="mb-3" bordered={false}>
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item
                label="Name"
                help={touched.name && errors.name}
                validateStatus={errors.name && "error"}
              >
                <Input name="name" value={values.name} onChange={handleChange} />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                label="Phone"
                help={touched.phone && errors.phone}
                validateStatus={errors.phone && "error"}
              >
                <Input name="phone" value={values.phone} onChange={handleChange} />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                label="Email"
                help={touched.email && errors.email}
                validateStatus={errors.email && "error"}
              >
                <Input name="email" value={values.email} onChange={handleChange} />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item
                label="Status"
                validateStatus={touched.status && errors.status ? "error" : ""}
                help={touched.status && errors.status}
              >
                <Select
                  value={values.status}
                  onChange={(value) => setFieldValue("status", value)}
                  placeholder="Select status"
                >
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* ================= PERSONAL INFO ================= */}
        <Card title="Personal Information" className="mb-3" bordered={false}>
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item label="Father / Husband Name">
                <Input
                  name="father_or_husband_name"
                  value={values.father_or_husband_name}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item label="Ward Number">
                <Input
                  name="ward_number"
                  value={values.ward_number}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item label="Mohalla Name">
                <Input
                  name="mohalla_name"
                  value={values.mohalla_name}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* ================= IDENTITY INFO ================= */}
        <Card title="Identity Information" className="mb-3" bordered={false}>
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item label="NID Number">
                <Input
                  name="nid_number"
                  value={values.nid_number}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item label="Birth Registration Number">
                <Input
                  name="birth_registration_number"
                  value={values.birth_registration_number}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* ================= ADDRESS INFO ================= */}
        <Card title="Address Information" className="mb-3" bordered={false}>
          <Row gutter={16}>
            <Col md={12}>
              <Form.Item label="Present Address">
                <Input
                  name="present_address"
                  value={values.present_address}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>

            <Col md={12}>
              <Form.Item label="Permanent Address">
                <Input
                  name="permanent_address"
                  value={values.permanent_address}
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* ================= IMAGE ================= */}
        <Card title="Profile Image" bordered={false}>
          <Row gutter={16}>
            <Col md={24}>
              <Form.Item label="Image">
                <Upload
                  showUploadList={false}
                  beforeUpload={(file) => {
                    setFieldValue("image", file);
                    return false;
                  }}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Select Image</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Card>

      </Form>


    </Modal>
  );
};

export default AddUpdateForm;
