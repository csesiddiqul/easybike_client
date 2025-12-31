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
} from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FiSave } from "react-icons/fi";

import {
  useCreateDriverMutation,
  useUpdateDriverMutation,
} from "../../redux/api/driverApiSlice";

import { transformErrorsToObjectStructure } from "../../../utils/main/transformErrorsToObjectStructure";
import * as Yup from "yup";

/* ===================== VALIDATION ===================== */
const validationSchema = Yup.object({
  name: Yup.string().required("Driver name is required"),
  phone: Yup.string().required("Phone number is required"),
  nid: Yup.string().required("NID is required"),
  present_address: Yup.string().required("Present address is required"),
  permanent_address: Yup.string().required("Permanent address is required"),
});

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
    setErrors,
    handleChange,
    handleBlur,
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
      present_address: "",
      permanent_address: "",
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
        }
        toast.error("Failed to save driver information");
      }
    },
  });

  /* ===================== SET EDIT DATA ===================== */
  useEffect(() => {
    if (open && editData) {
      setValues({
        name: editData.user?.name || "",
        phone: editData.user?.phone || "",
        email: editData.user?.email || "",
        nid: editData.nid || "",
        years_of_experience: editData.years_of_experience || "",
        present_address: editData.present_address || "",
        permanent_address: editData.permanent_address || "",
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
      width={800}
        footer={
        <div className="text-right">
            <Button
            disabled={createRes.isLoading || updateRes.isLoading}
            loading={createRes.isLoading || updateRes.isLoading}
            type="primary"
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
          validateStatus={touched.name && errors.name ? "error" : ""}
          help={touched.name && errors.name}
        >
          <Input 
            name="name" 
            placeholder="Enter driver full name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Form.Item>
      </Col>

      <Col md={12}>
        <Form.Item 
          label="Phone Number"
          validateStatus={touched.phone && errors.phone ? "error" : ""}
          help={touched.phone && errors.phone}
        >
          <Input 
            name="phone" 
            placeholder="01XXXXXXXXX"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Form.Item>
      </Col>

      {/* Email - Full width */}
      <Col md={24}>
        <Form.Item label="Email (Optional)">
          <Input 
            name="email" 
            placeholder="driver@email.com"
            value={values.email}
            onChange={handleChange}
          />
        </Form.Item>
      </Col>

      {/* NID - 6 columns */}
      <Col md={12} lg={12}>
        <Form.Item 
          label="NID Number"
          validateStatus={touched.nid && errors.nid ? "error" : ""}
          help={touched.nid && errors.nid}
        >
          <Input 
            name="nid" 
            placeholder="Enter NID number"
            value={values.nid}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Form.Item>
      </Col>

      {/* Experience - 6 columns */}
      <Col md={12} lg={12}>
        <Form.Item 
          label="Experience (Years Optional)"
          validateStatus={
            touched.years_of_experience && errors.years_of_experience ? "error" : ""
          }
          help={touched.years_of_experience && errors.years_of_experience}
        >
        <InputNumber
          className="w-full"
          min={0}
          placeholder="0"
          value={values.years_of_experience}
          onChange={(value) =>
            setFieldValue("years_of_experience", value)
          }
        />
        </Form.Item>
      </Col>
    </Row>
  </Col>

  {/* Address */}
  <Col md={12}>
    <Form.Item 
      label="Present Address"
      validateStatus={
        touched.present_address && errors.present_address ? "error" : ""
      }
      help={touched.present_address && errors.present_address}
    >
      <Input.TextArea 
        rows={3} 
        name="present_address" 
        placeholder="Current address"
        value={values.present_address}
        onChange={handleChange}
      />
    </Form.Item>
  </Col>

  <Col md={12}>
    <Form.Item 
      label="Permanent Address"
      validateStatus={
        touched.permanent_address && errors.permanent_address ? "error" : ""
      }
      help={touched.permanent_address && errors.permanent_address}
    >
      <Input.TextArea 
        rows={3} 
        name="permanent_address" 
        placeholder="Permanent address"
        value={values.permanent_address}
        onChange={handleChange}
      />
    </Form.Item>
  </Col>
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
