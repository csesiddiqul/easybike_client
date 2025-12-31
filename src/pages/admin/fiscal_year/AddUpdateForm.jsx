import React, { useEffect } from "react";
import { Button, Modal, Input, Form, DatePicker } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import {
  useCreateFiscalYearMutation,
  useCorrectFiscalYearMutation,
} from "../../redux/api/fiscalYearApiSlice";
import { transformErrorsToObjectStructure } from "../../../utils/main/transformErrorsToObjectStructure";
import { FiSave } from "react-icons/fi";
import dayjs from "dayjs";

const AddUpdateForm = ({ open, onClose, editData }) => {
  /* ===================== API ===================== */
  const [createFiscalYear, createRes] = useCreateFiscalYearMutation();
  const [correctFiscalYear, updateRes] = useCorrectFiscalYearMutation();

  /* ===================== VALIDATION ===================== */
  const validationSchema = Yup.object({
    name: Yup.string().required("Fiscal year name is required"),
    start_date: Yup.mixed().required("Start date is required"),
    end_date: Yup.mixed()
      .required("End date is required")
      .test(
        "after-start",
        "End date must be after start date",
        function (value) {
          const { start_date } = this.parent;
          if (!value || !start_date) return true;
          return dayjs(value).isAfter(dayjs(start_date));
        }
      ),
  });

  /* ===================== FORMIK ===================== */
  const {
    values,
    errors,
    setErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      name: "",
      start_date: null,
      end_date: null,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        name: values.name,
        start_date: dayjs(values.start_date).format("YYYY-MM-DD"),
        end_date: dayjs(values.end_date).format("YYYY-MM-DD"),
      };

      if (editData) {
        correctFiscalYear({ id: editData.id, data: payload });
      } else {
        createFiscalYear(payload);
      }
    },
  });

  /* ===================== SET EDIT DATA ===================== */
  useEffect(() => {
    if (open && editData) {
      setValues({
        name: editData.name || "",
        start_date: dayjs(editData.start_date),
        end_date: dayjs(editData.end_date),
      });
    }

    if (!open) {
      resetForm();
    }
  }, [open, editData, setValues, resetForm]);

  /* ===================== RESPONSE HANDLING ===================== */
  useEffect(() => {
   
    if (createRes.isError) {
        toast.error(
        createRes.error?.data?.message || "Create failed"
        );

        setErrors(
        transformErrorsToObjectStructure(
            createRes.error?.data?.errors || {}
        )
        );

        createRes.reset();
    }

    if (createRes.isSuccess) {
        toast.success(
        createRes.data?.message || "Fiscal year created"
        );
        onClose();
        resetForm();
        createRes.reset();
    }

    if (updateRes.isError) {
        const message = updateRes.error?.data?.message;
        toast.error(message || "Update failed");
        updateRes.reset();
    }

    if (updateRes.isSuccess) {
        toast.success(updateRes.data?.message || "Fiscal year updated");
        onClose();
        resetForm();
        updateRes.reset();
    }
  }, [
    createRes,
    updateRes,
    onClose,
    resetForm,
    setErrors,
  ]);

  /* ===================== UI ===================== */
  return (
    <Modal
      destroyOnClose
      className="modal"
      title={editData ? "Update Fiscal Year" : "Add Fiscal Year"}
      open={open}
      onCancel={onClose}
      footer={
        <div className="text-right">
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={createRes.isLoading || updateRes.isLoading}
            icon={<FiSave />}
          >
            Save
          </Button>
        </div>
      }
    >
      <Form layout="vertical" onSubmitCapture={handleSubmit}>
        {/* Name */}
        <Form.Item
          label="Fiscal Year Name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name}
        >
          <Input
            name="name"
            placeholder="2025-2026"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Form.Item>

        {/* Start Date */}
        <Form.Item
          label="Start Date"
          validateStatus={errors.start_date ? "error" : ""}
          help={errors.start_date}
        >
          <DatePicker
            className="w-full"
            value={values.start_date}
            format="DD MMM YYYY"
            getPopupContainer={(trigger) => trigger.parentElement}
            onChange={(date) => setFieldValue("start_date", date)}
          />
        </Form.Item>

        {/* End Date */}
        <Form.Item
          label="End Date"
          validateStatus={errors.end_date ? "error" : ""}
          help={errors.end_date}
        >
          <DatePicker
            className="w-full"
            value={values.end_date}
            format="DD MMM YYYY"
            getPopupContainer={(trigger) => trigger.parentElement}
            onChange={(date) => setFieldValue("end_date", date)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUpdateForm;
