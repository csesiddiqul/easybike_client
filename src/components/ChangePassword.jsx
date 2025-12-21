import { Form, Input, Button } from "antd";
import React, { useEffect } from "react";
import { transformErrorsToObjectStructure } from "../utils/main/transformErrorsToObjectStructure";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useChangePasswordMutation } from "../pages/redux/api/authApiSlice";

export const ChangePassword = () => {
  const [update, { isLoading, isSuccess, data, error, isError, reset }] =
    useChangePasswordMutation();

  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Old password is required")
      .min(6, "Old password must have at least 6 characters"),
    new_password: Yup.string()
      .required("New password is required")
      .min(6, "New password must have at least 6 characters"),
    new_confirm_password: Yup.string()
      .required("New Confirm Password is required")
      .oneOf([Yup.ref("new_password"), null], "New Passwords must match"),
  });

  const {
    handleBlur,
    handleChange,
    values,
    errors,
    setErrors,
    handleSubmit,
    resetForm,
    touched,
  } = useFormik({
    initialValues: {
      password: "",
      new_password: "",
      new_confirm_password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      update(values);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Password updated successfully");
      resetForm();
      reset();
    }
    if (isError) {
      setErrors(transformErrorsToObjectStructure(error?.data?.errors || {}));
      toast.error(error?.data?.message || "Failed to update password");
    }
  }, [isSuccess, isError, data, error, resetForm, reset, setErrors]);

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-3"></div>
      <div className="col-span-6">
        <Form layout="vertical" onSubmitCapture={handleSubmit}>
          <Form.Item
            label="Old Password"
            validateStatus={errors.password && touched.password ? "error" : ""}
            help={ errors.password && touched.password ? errors.password : ""}
          >
            <Input.Password
              id="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            validateStatus={
              errors.new_password && touched.new_password ? "error" : ""
            }
            help={errors.new_password && touched.new_password ? errors.new_password : ""}
          >
            <Input.Password
              id="new_password"
              name="new_password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.new_password}
            />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            validateStatus={
              errors.new_confirm_password && touched.new_confirm_password
                ? "error"
                : ""
            }
            help={ errors.new_confirm_password && touched.new_confirm_password ? errors.new_confirm_password : ""}
          >
            <Input.Password
              id="new_confirm_password"
              name="new_confirm_password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.new_confirm_password}
            />
          </Form.Item>

          <Form.Item>
            <div className="text-center">
              <Button type="primary" className="w-full" htmlType="submit" loading={isLoading}>
                Update Password
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
      <div className="col-span-3"></div>
    </div>
  );
};
