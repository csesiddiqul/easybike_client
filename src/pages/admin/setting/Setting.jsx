// src/pages/admin/settings/AppSettingPage.jsx
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Spin,
  Upload,
  Card,
} from "antd";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as Yup from "yup";

import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} from "../../redux/api/systemSettingApiSlice";

/* ================= VALIDATION ================= */
const validationSchema = Yup.object({
  system_name: Yup.string().required("System name is required"),
  city_corporation_name: Yup.string().required(
    "City Corporation name is required"
  ),
  city_corporation_phone: Yup.string().required("Phone is required"),
});

/* ================= IMAGE PREVIEW ================= */
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const AppSettingPage = () => {
  const { data, isLoading } = useGetSystemSettingsQuery();
  const [updateSettings, updateRes] =
    useUpdateSystemSettingsMutation();

  const setting = data?.data;

  const [systemLogo, setSystemLogo] = useState([]);
  const [cityLogo, setCityLogo] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  /* ================= FORMIK ================= */
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues: {
      system_name: "",
      city_corporation_name: "",
      city_corporation_phone: "",
      vehicle_charge_per_year: "",
      driver_licence_renew_charge: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      if (systemLogo[0]?.originFileObj) {
        formData.append("system_logo", systemLogo[0].originFileObj);
      }

      if (cityLogo[0]?.originFileObj) {
        formData.append(
          "city_corporation_logo",
          cityLogo[0].originFileObj
        );
      }

      try {
        await updateSettings(formData).unwrap();
        toast.success("System settings updated successfully");
      } catch {
        toast.error("Failed to update system settings");
      }
    },
  });

  /* ================= SET DATA ================= */
  useEffect(() => {
    if (setting) {
      setValues({
        system_name: setting.system_name ?? "",
        city_corporation_name: setting.city_corporation_name ?? "",
        city_corporation_phone: setting.city_corporation_phone ?? "",
        vehicle_charge_per_year:
          setting.vehicle_charge_per_year ?? "",
        driver_licence_renew_charge:
          setting.driver_licence_renew_charge ?? "",
      });

      if (setting.system_logo) {
        setSystemLogo([
          {
            uid: "-1",
            name: "system_logo.jpg",
            status: "done",
            url: setting.system_logo, // ✅ FULL URL
          },
        ]);
      }

      if (setting.city_corporation_logo) {
        setCityLogo([
          {
            uid: "-2",
            name: "city_logo.jpg",
            status: "done",
            url: setting.city_corporation_logo, // ✅ FULL URL
          },
        ]);
      }
    }
  }, [setting]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return (
    <div className="card-layout">
      {/* HEADER */}
      <div className="flex justify-between headerbg items-center py-2 mb-4">
        <h1 className="text-xl font-bold text-gray-600">
          System Settings
        </h1>
      </div>

      <Spin spinning={isLoading || updateRes.isLoading}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Card className="shadow-sm">
            <Row gutter={3}>
              {/* LOGOS */}
              <Col md={3}>
                <Form.Item label="System Logo">
                  <Upload
                    listType="picture-card"
                    fileList={systemLogo}
                    onChange={({ fileList }) =>
                      setSystemLogo(fileList)
                    }
                    onPreview={handlePreview}
                    maxCount={1}
                  >
                    {systemLogo.length ? null : "Upload"}
                  </Upload>
                </Form.Item>
              </Col>

              <Col md={4}>
                <Form.Item label="City Corporation Logo">
                  <Upload
                    listType="picture-card"
                    fileList={cityLogo}
                    onChange={({ fileList }) =>
                      setCityLogo(fileList)
                    }
                    onPreview={handlePreview}
                    maxCount={1}
                  >
                    {cityLogo.length ? null : "Upload"}
                  </Upload>
                </Form.Item>
              </Col>

              {/* TEXT INPUTS */}
              
              <Col md={12}>
                <Form.Item
                  label="System Name"
                  validateStatus={errors.system_name ? "error" : ""}
                  help={errors.system_name}
                >
                  <Input
                    name="system_name"
                    value={values.system_name}
                    onChange={handleChange}
                    placeholder="Enter system name"
                  />
                </Form.Item>

                <Form.Item
                  label="City Corporation Name"
                  validateStatus={
                    errors.city_corporation_name ? "error" : ""
                  }
                  help={errors.city_corporation_name}
                >
                  <Input
                    name="city_corporation_name"
                    value={values.city_corporation_name}
                    onChange={handleChange}
                    placeholder="Enter city corporation name"
                  />
                </Form.Item>

                <Form.Item
                  label="City Corporation Number"
                  validateStatus={
                    errors.city_corporation_phone ? "error" : ""
                  }
                  help={errors.city_corporation_phone}
                >
                  <Input
                    name="city_corporation_phone"
                    value={values.city_corporation_phone}
                    onChange={handleChange}
                    placeholder="City Corporation Number"
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col md={12}>
                    <Form.Item label="Vehicle Charge / Year">
                      <InputNumber
                        className="w-full"
                        value={values.vehicle_charge_per_year}
                        onChange={(v) =>
                          setFieldValue(
                            "vehicle_charge_per_year",
                            v
                          )
                        }
                      />
                    </Form.Item>
                  </Col>

                  <Col md={12}>
                    <Form.Item label="Driver Licence Renew Charge">
                      <InputNumber
                        className="w-full"
                        value={values.driver_licence_renew_charge}
                        onChange={(v) =>
                          setFieldValue(
                            "driver_licence_renew_charge",
                            v
                          )
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* ACTION */}
            <div className="text-center mt-6">
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={updateRes.isLoading}
              >
                Save Settings
              </Button>
            </div>
          </Card>
        </Form>
      </Spin>

      {/* IMAGE PREVIEW MODAL */}
      {previewOpen && (
        <Image
          preview={{
            visible: previewOpen,
            onVisibleChange: (v) => setPreviewOpen(v),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default AppSettingPage;
