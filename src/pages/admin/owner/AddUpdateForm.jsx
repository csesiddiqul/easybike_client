import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Checkbox,
  Upload,
} from "antd";
import { useFormik } from "formik";
import {  useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiSave } from "react-icons/fi";
import { createFormData } from "../../../utils/main/createFormData";
import { transformErrorsToObjectStructure } from "../../../utils/main/transformErrorsToObjectStructure";
import {
  useCreateOwnerMutation,
  useUpdateOwnerMutation,
} from "../../redux/api/ownersApiSlice";

import PresentAddress from "../driver/PresentAddress";
import PermanentAddress from "../driver/PermanentAddress";
import { getInitialValues, validationSchema } from "./validation";


import * as Yup from "yup";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const AddUpdateForm = ({ open, onClose, editData }) => {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [createOwner, createState] = useCreateOwnerMutation();
  const [updateOwner, updateState] = useUpdateOwnerMutation();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: {
      name: editData?.user?.name || "",
      phone: editData?.user?.phone || "",
      email: editData?.user?.email || "",
      status: editData?.user?.status || "",
      father_or_husband_name: editData?.father_or_husband_name || "",
      nid_number: editData?.nid_number || "",
      birth_registration_number: editData?.birth_registration_number || "",
      same_as_present: false,

      ...getInitialValues(editData),
    },

    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = createFormData(values);

      if (fileList.length) {
        formData.append("image", fileList[0].originFileObj);
      }

      try {
        if (editData) {
          formData.append("_method", "PATCH");
          await updateOwner({ id: editData.id, formData }).unwrap();
          toast.success("Owner updated successfully");
        } else {
          await createOwner(formData).unwrap();
          toast.success("Owner created successfully");
        }
        resetForm();
        setFileList([]);
        onClose();
      } catch (error) {
        setErrors(
          transformErrorsToObjectStructure(error?.data?.errors || {})
        );
        toast.error("Operation failed");
      }
    },
  });

useEffect(() => {
  if (editData?.image) {
    setFileList([
      {
        uid: "-1",
        name: "owner.jpg",
        status: "done",
        url: editData.image, // backend full URL
      },
    ]);
  }
}, [editData]);


  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return (
    <Modal
      className="modal"
      open={open}
      title={editData ? "Update Owner" : "Add Owner"}
      width={800}
      onCancel={onClose}
      footer={
        <Button
          type="primary"
          icon={<FiSave />}
          loading={createState.isLoading || updateState.isLoading}
          onClick={handleSubmit}
        >
          Save Owner
        </Button>
      }
    >
      <Spin spinning={createState.isLoading || updateState.isLoading}>
        <Form layout="vertical">

          {/* ================= BASIC INFORMATION ================= */}
          <fieldset className="bg-slate-100 rounded px-3 py-2 border-2 border-gray-300">
            <legend className="px-2 text-sm font-semibold">
              Basic Information
            </legend>

            <Row gutter={16}>
              <Col md={6}>
                <Form.Item label="Image">
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={({ fileList }) => setFileList(fileList)}
                    onPreview={handlePreview}
                    maxCount={1}
                    beforeUpload={() => false}
                  >
                    {fileList.length < 1 && "Upload"}
                  </Upload>
                </Form.Item>
              </Col>

             

              <Col md={18}>
                <Row gutter={16}>
                  <Col md={12}>
                    <Form.Item
                      label="Name"
                      validateStatus={touched.name && errors.name ? "error" : ""}
                      help={touched.name && errors.name}
                    >
                      <Input name="name" value={values.name} onChange={handleChange} />
                    </Form.Item>
                  </Col>

                  <Col md={12}>
                    <Form.Item
                      label="Phone"
                      validateStatus={touched.phone && errors.phone ? "error" : ""}
                      help={touched.phone && errors.phone}
                    >
                      <Input name="phone" value={values.phone} onChange={handleChange} />
                    </Form.Item>
                  </Col>

                  <Col md={12}>
                    <Form.Item
                      label="Email"
                      validateStatus={touched.email && errors.email ? "error" : ""}
                      help={touched.email && errors.email}
                    >
                      <Input name="email" value={values.email} onChange={handleChange} />
                    </Form.Item>
                  </Col>

                  <Col md={12}>
                    <Form.Item label="Status">
                      <Select
                        value={values.status}
                        onChange={(v) => setFieldValue("status", v)}
                        options={[
                          { value: "Active", label: "Active" },
                          { value: "Inactive", label: "Inactive" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </fieldset>

          {/* ================= PERSONAL ================= */}
          <fieldset className="bg-green-100 rounded px-3 py-2 mt-4 border-2 border-gray-300">
            <legend className="px-2 text-sm font-semibold">
              Personal Information
            </legend>

            <Row gutter={16}>
              <Col md={24}>
                <Form.Item label="Father / Husband Name">
                  <Input
                    name="father_or_husband_name"
                    value={values.father_or_husband_name}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>

              {/* <Col md={6}>
                <Form.Item label="Ward Number">
                  <Input name="ward_number" value={values.ward_number} onChange={handleChange} />
                </Form.Item>
              </Col>

              <Col md={6}>
                <Form.Item label="Mohalla Name">
                  <Input name="mohalla_name" value={values.mohalla_name} onChange={handleChange} />
                </Form.Item>
              </Col> */}
            </Row>
          </fieldset>

          {/* ================= IDENTITY ================= */}
          <fieldset className="bg-blue-100 rounded px-3 py-2 mt-4 border-2 border-gray-300">
            <legend className="px-2 text-sm font-semibold">
              Identity Information
            </legend>

            <Row gutter={16}>
              <Col md={12}>
                <Form.Item label="NID Number">
                  <Input name="nid_number" value={values.nid_number} onChange={handleChange} />
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
          </fieldset>

          {/* ================= ADDRESS ================= */}
        <fieldset className="bg-gray-100 rounded px-3 py-2 mt-4 border-2 border-gray-300">
          <legend className="px-2 text-sm font-semibold text-gray-700">
            Present Address
          </legend>

          <Row gutter={16}>
            <PresentAddress
              editData={editData}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setValues={setValues}
              setFieldValue={setFieldValue}
            />
          </Row>
        </fieldset>

        <fieldset className="bg-indigo-100 rounded py-1 px-3 mt-4 border-2 border-gray-300">
          <legend className="px-2 text-sm font-semibold text-gray-700">
            Permanent Address
          </legend>

          <div className="mb-2 py-2">
            <Checkbox
              checked={values.same_as_present}
              onChange={(e) =>
                setFieldValue("same_as_present", e.target.checked)
              }
            >
              Permanent address is same as present address
            </Checkbox>
          </div>

          <Row gutter={16}>
            <PermanentAddress
              editData={editData}
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              setValues={setValues}
              setFieldValue={setFieldValue}
            />
          </Row>
        </fieldset>
        </Form>

        <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
          <Image src={previewImage} style={{ width: "100%" }} />
        </Modal>
      </Spin>
    </Modal>
  );
};

export default AddUpdateForm;