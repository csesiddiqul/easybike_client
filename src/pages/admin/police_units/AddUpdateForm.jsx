import React, { useEffect } from "react";
import { Button, Modal, Input, Form } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import {
  useCreatePoliceUnitsMutation,
  useUpdatePoliceUnitsMutation,
} from "../../redux/api/policeUnitsApiSlice";
import { transformErrorsToObjectStructure } from "../../../utils/main/transformErrorsToObjectStructure";
import { FiSave } from "react-icons/fi";

const AddUpdateForm = ({ open, onClose, editData }) => {
  // create
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
  ] = useCreatePoliceUnitsMutation();

  // update
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
  ] = useUpdatePoliceUnitsMutation();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
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
    },
    validationSchema,
    onSubmit: (values) => {
      if (editData) {
        update({
          _method: "PUT",
          id: editData.id,
          name: values.name,
        });
      } else {
        create({ name: values.name, index: values.index });
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

  return (
    <Modal
     className="modal"
      title={editData ? "Update Police Units" : "Add Police Units"}
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
            placeholder="Enter Police Units"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
          />
        </Form.Item>
        
      </Form>
    </Modal>
  );
};

export default AddUpdateForm;
