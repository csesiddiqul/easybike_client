import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Spin,
  Upload,
  Checkbox
} from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  useCreateDriverMutation,
  useUpdateDriverMutation,
} from "../../redux/api/driverApiSlice";

import PermanentAddress from "./PermanentAddress";
import PresentAddress from "./PresentAddress";

import { getInitialValues, validationSchema } from "./validation";

import { transformErrorsToObjectStructure } from "../../../utils/main/transformErrorsToObjectStructure";
import * as Yup from "yup";

/* ===================== IMAGE PREVIEW ===================== */
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const AddUpdateForm = ({ open, onClose, editData }) => {
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const [createDriver, createRes] = useCreateDriverMutation();
  const [updateDriver, updateRes] = useUpdateDriverMutation();

/* ===================== FORMIK ===================== */
const {
  values,
  errors,
  touched,
  handleBlur,
  setErrors,
  handleChange,
  handleSubmit,
  setFieldValue,
  resetForm,
  setValues,
} = useFormik({
  initialValues: {
    name: "",
    phone: "",
    email: "",
    nid: "",
    years_of_experience: "",
    same_as_present: false,

    ...getInitialValues(editData),
  },

  validationSchema,
  onSubmit: async (values) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    if (fileList.length && fileList[0]?.originFileObj) {
      formData.append("driver_image", fileList[0].originFileObj);
    }

    try {
      if (editData) {
        formData.append("_method", "PUT");
        await updateDriver({ id: editData.id, formData }).unwrap();
        toast.success("Driver updated successfully");
      } else {
        await createDriver(formData).unwrap();
        toast.success("Driver created successfully");
      }

      resetForm();
      setFileList([]);
      onClose();
    } catch (err) {
      if (err?.data?.errors) {
        setErrors(transformErrorsToObjectStructure(err.data.errors));
      } else {
        toast.error("Failed to save driver information");
      }
    }
  },
});

  /* ===================== SET EDIT DATA ===================== */
useEffect(() => {
  if (open && editData) {
    setValues({
      // Basic
      name: editData.user?.name || "",
      phone: editData.user?.phone || "",
      email: editData.user?.email || "",
      nid: editData.nid || "",
      years_of_experience: editData.years_of_experience || "",

      // Present Address
      present_division_id: editData.present_division?.id || "",
      present_district_id: editData.present_district?.id || "",
      present_upazila_id: editData.present_upazila?.id || "",
      present_union_id: editData.present_union?.id || "",
      present_ward: editData.present_ward || "",
      present_village: editData.present_village || "",

      // Permanent Address
      permanent_division_id: editData.permanent_division?.id || "",
      permanent_district_id: editData.permanent_district?.id || "",
      permanent_upazila_id: editData.permanent_upazila?.id || "",
      permanent_union_id: editData.permanent_union?.id || "",
      permanent_ward: editData.permanent_ward || "",
      permanent_village: editData.permanent_village || "",
    });

    if (editData.driver_image) {
      setFileList([
        {
          uid: "-1",
          name: "driver.jpg",
          status: "done",
          url: editData.driver_image,
        },
      ]);
    }
  }

  if (!open) {
    resetForm();
    setFileList([]);
  }
}, [open, editData]);



  /* ===================== MAIN FIX (SEQUENTIAL SYNC) ===================== */
  // 1. division
  useEffect(() => {
    if (values.same_as_present) {
      setFieldValue("permanent_division_id", values.present_division_id);
    }
  }, [values.same_as_present, values.present_division_id]);

  // 2. district
  useEffect(() => {
    if (values.same_as_present && values.permanent_division_id) {
      setFieldValue("permanent_district_id", values.present_district_id);
    }
  }, [values.permanent_division_id]);

  // 3. upazila
  useEffect(() => {
    if (values.same_as_present && values.permanent_district_id) {
      setFieldValue("permanent_upazila_id", values.present_upazila_id);
    }
  }, [values.permanent_district_id]);

  // 4. union + ward + village
  useEffect(() => {
    if (values.same_as_present && values.permanent_upazila_id) {
      setFieldValue("permanent_union_id", values.present_union_id);
      setFieldValue("permanent_ward", values.present_ward);
      setFieldValue("permanent_village", values.present_village);
    }
  }, [values.permanent_upazila_id]);


  /* ===================== IMAGE PREVIEW ===================== */
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
      destroyOnClose
      open={open}
      onCancel={onClose}
      title={editData ? "Update Driver" : "Add Driver"}
      width={900}
      footer={
        <div className="text-right">
          <Button
            type="primary"
            loading={createRes.isLoading || updateRes.isLoading}
            onClick={handleSubmit}
          >
            Save Driver
          </Button>
        </div>
      }
    >
      <Spin spinning={createRes.isLoading || updateRes.isLoading}>
        <Form layout="vertical">
          <fieldset className="bg-slate-100 rounded py-1 px-3 mt-4 border-2 border-gray-300">
            <legend className="px-2 text-sm font-semibold text-gray-700">
              Driver information
            </legend>

            <Row gutter={16}>
              {/* Image */}
              <Col xs={24} md={6}>
                <Form.Item label="Driver Photo">
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={({ fileList }) => setFileList(fileList)}
                    onPreview={handlePreview}
                    maxCount={1}
                    accept=".jpg,.jpeg,.png"
                  >
                    {fileList.length >= 1 ? null : "Upload"}
                  </Upload>
                </Form.Item>
              </Col>

              {/* Info */}
              <Col xs={24} md={18}>
                <Row gutter={16}>
                  <Col md={12}>
                    <Form.Item
                      label="Driver Name"
                      validateStatus={errors.name ? "error" : ""}
                      help={errors.name}
                    >
                      <Input
                        name="name"
                        placeholder="Enter driver full name"   
                        value={values.name}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>

                  <Col md={12}>
                    <Form.Item
                      label="Phone Number"
                      validateStatus={errors.phone ? "error" : ""}
                      help={errors.phone}
                    >
                      <Input
                        name="phone"
                        placeholder="01XXXXXXXXX"               
                        value={values.phone}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>

                  <Col md={24}>
                    <Form.Item
                      label="Email (Optional)"
                      validateStatus={errors.email ? "error" : ""}
                      help={errors.email}
                    >
                      <Input
                        name="email"
                        placeholder="driver@email.com"         
                        value={values.email}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>

                  <Col md={12}>
                    <Form.Item
                      label="NID Number"
                      validateStatus={errors.nid ? "error" : ""}
                      help={errors.nid}
                    >
                      <Input
                        name="nid"
                        placeholder="Enter NID number"          
                        value={values.nid}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </Col>

                  <Col md={12}>
                    <Form.Item
                      label="Experience (Years Optional)"
                      validateStatus={errors.years_of_experience ? "error" : ""}
                      help={errors.years_of_experience}
                    >
                      <InputNumber
                        className="w-full"
                        min={0}
                        placeholder="0"                          
                        value={values.years_of_experience}
                        onChange={(v) =>
                          setFieldValue("years_of_experience", v)
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </fieldset>

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

        <Modal
          open={previewOpen}
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <Image src={previewImage} />
        </Modal>
      </Spin>
    </Modal>
  );
};

export default AddUpdateForm;
