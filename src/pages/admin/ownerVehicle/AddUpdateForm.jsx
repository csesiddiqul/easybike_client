import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
} from "antd";
import { useFormik } from "formik";
import { FiSave } from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
} from "../../redux/api/vehicleApiSlice";

import {
  useGetOwnerSelectQuery,
  useGetDriverSelectQuery,
} from "../../redux/api/ownersApiSlice";

import { transformErrorsToObjectStructure } from "../../../utils/main/transformErrorsToObjectStructure";
import * as Yup from "yup";
import { createFormData } from "../../../utils/main/createFormData";
import { useState } from "react";

const { Option } = Select;

const AddUpdateForm = ({ open, onClose, editData }) => {
  const [fileList, setFileList] = useState([]);
  const [createVehicle, createState] = useCreateVehicleMutation();
  const [updateVehicle, updateState] = useUpdateVehicleMutation();

  const { data: ownersData, isLoading: ownersLoading } = useGetOwnerSelectQuery();
  const { data: driversData, isLoading: driversLoading } = useGetDriverSelectQuery();




  /* ================= VALIDATION ================= */
  const validationSchema = Yup.object({
    owner_id: Yup.number().required("Owner is required"),
    vehicle_type: Yup.string().required("Vehicle type is required"),
    supplier_type: Yup.string().required("Supplier type is required"),
    vehicle_model_name: Yup.string().required("Vehicle model is required"),
    chassis_number: Yup.string().required("Chassis number is required"),
    driver_id: Yup.number().required("Driver is required"),
    status: Yup.string().required("Status is required"),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    setErrors,
    resetForm,
  } = useFormik({
    initialValues: {
      owner_id: editData?.owner_id || "",
      vehicle_type: editData?.vehicle_type || "",
      supplier_type: editData?.supplier_type || "",
      vehicle_model_name: editData?.vehicle_model_name || "",
      chassis_number: editData?.chassis_number || "",
      driver_id: editData?.current_driver?.driver_id || "",
      status: editData?.status || "pending",
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
          await updateVehicle({ id: editData.id, formData }).unwrap();
          toast.success("Owner updated successfully");
        } else {
          await createVehicle(formData).unwrap();
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

    // onSubmit: async (values) => {
    //   try {
    //     if (editData) {
    //       await updateVehicle({
    //         id: editData.id,
    //         data: values,
    //       }).unwrap();
    //       toast.success("Vehicle updated successfully");
    //     } else {
    //       await createVehicle(values).unwrap();
    //       toast.success("Vehicle created successfully");
    //     }

    //     resetForm();
    //     onClose();
    //   } catch (error) {
    //     setErrors(
    //       transformErrorsToObjectStructure(error?.data?.errors || {})
    //     );
    //     toast.error(error?.data?.message || "Operation failed");
    //   }
    // },


  });

  return (
    <Modal
      className="modal"
      open={open}
      onCancel={onClose}
      title={editData ? "Update Vehicle" : "Add Vehicle"}
      width={700}
      footer={
        <Button
          type="primary"
          icon={<FiSave />}
          loading={createState.isLoading || updateState.isLoading}
          onClick={handleSubmit}
        >
          Save Vehicle
        </Button>
      }
    >
      <Spin spinning={createState.isLoading || updateState.isLoading}>
        <Form layout="vertical">

          {/* ================= VEHICLE INFO ================= */}
          <fieldset className="bg-slate-100 rounded px-3 py-2 border-2 border-gray-300">
            <legend className="px-2 font-semibold">Vehicle Information</legend>

            <Row gutter={16}>
              <Col md={12}>
                <Form.Item
                  label="Vehicle Type"
                  validateStatus={touched.vehicle_type && errors.vehicle_type ? "error" : ""}
                  help={touched.vehicle_type && errors.vehicle_type}
                >
                  <Input
                    name="vehicle_type"
                    value={values.vehicle_type}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>

              <Col md={12}>
                <Form.Item
                  label="Supplier Type"
                  validateStatus={touched.supplier_type && errors.supplier_type ? "error" : ""}
                  help={touched.supplier_type && errors.supplier_type}
                >
                  <Select
                    value={values.supplier_type}
                    onChange={(v) => setFieldValue("supplier_type", v)}
                  >
                    <Option value="person">Person</Option>
                    <Option value="company">Company</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col md={12}>
                <Form.Item
                  label="Vehicle Model"
                  validateStatus={touched.vehicle_model_name && errors.vehicle_model_name ? "error" : ""}
                  help={touched.vehicle_model_name && errors.vehicle_model_name}
                >
                  <Input
                    name="vehicle_model_name"
                    value={values.vehicle_model_name}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>

              <Col md={12}>
                <Form.Item
                  label="Chassis Number"
                  validateStatus={touched.chassis_number && errors.chassis_number ? "error" : ""}
                  help={touched.chassis_number && errors.chassis_number}
                >
                  <Input
                    name="chassis_number"
                    value={values.chassis_number}
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
            </Row>
          </fieldset>

          {/* ================= ASSIGNMENT ================= */}
          <fieldset className="bg-green-100 rounded px-3 py-2 mt-4 border-2 border-gray-300">
            <legend className="px-2 font-semibold">Assignment</legend>

            <Row gutter={16}>
              <Col md={12}>
                <Form.Item
                  label="Owner"
                  validateStatus={touched.owner_id && errors.owner_id ? "error" : ""}
                  help={touched.owner_id && errors.owner_id}
                >
                  <Select
                    showSearch
                    placeholder="Select owner"
                    value={values.owner_id}
                    onChange={(val) => setFieldValue("owner_id", val)}
                    loading={ownersLoading}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {ownersData?.map((owner) => (
                      <Option key={owner.id} value={owner.id}>
                        {owner.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col md={12}>
                <Form.Item
                  label="Driver"
                  validateStatus={touched.driver_id && errors.driver_id ? "error" : ""}
                  help={touched.driver_id && errors.driver_id}
                >
                  <Select
                    showSearch
                    placeholder="Select driver"
                    value={values.driver_id}
                    onChange={(val) => setFieldValue("driver_id", val)}
                    loading={driversLoading}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {driversData?.map((driver) => (
                      <Option key={driver.id} value={driver.id}>
                        {driver.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

              </Col>
            </Row>
          </fieldset>

          {/* ================= STATUS ================= */}
          <Form.Item
            className="mt-2"
            label="Vehicle Status "
            validateStatus={touched.status && errors.status ? "error" : ""}
            help={touched.status && errors.status}
          >
            <Select
              value={values.status}
              onChange={(v) => setFieldValue("status", v)}
            >
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="expired">Expired</Option>
            </Select>
          </Form.Item>

        </Form>
      </Spin>
    </Modal>
  );
};

export default AddUpdateForm;
