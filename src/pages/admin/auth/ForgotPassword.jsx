import { Form, Input, Modal, Button } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import * as yup from "yup";
import { FiLock, FiMail } from "react-icons/fi";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../redux/api/authApiSlice";
import toast from "react-hot-toast";

const ForgotPassword = ({ open, setOpen }) => {
  const [isForgot, setIsForgot] = useState(true);
  const onClose = () => {
    setOpen(false);
  };
  // forgot
  const [
    forgot,
    {
      isLoading: isLoadingForgot,
      isSuccess: isSuccessForgot,
      data: dataForgot,
      error: errorForgot,
      isError: isErrorForgot,
      reset: resetForgot,
    },
  ] = useForgotPasswordMutation();
  // reset password
  const [
    resetPassword,
    {
      isLoading: isLoadingResetPassword,
      isSuccess: isSuccessResetPassword,
      data: dataResetPassword,
      error: errorResetPassword,
      isError: isErrorResetPassword,
      reset: resetResetPassword,
    },
  ] = useResetPasswordMutation();

  const initialValues = {
    email: "",
    otp: "",
    password: "",
    confirm_password: "",
  };

  const validationSchema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    ...(isForgot
      ? {}
      : {
          otp: yup.string().required("OTP is required"),
          password: yup
            .string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
          confirm_password: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match")
            .required("Confirm password is required"),
        }),
  });

  const {
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (isForgot) {
        forgot({ email: values.email });
      }
      if (!isForgot) {
        resetPassword({
          email: values.email,
          password: values.password,
          otp: values.otp,
        });
      }
    },
  });

  useEffect(() => {
    if (isSuccessForgot) {
      setIsForgot(false);
      toast.success(
        dataForgot.message || `Please check your email inbox or spam for otp`
      );
      resetForgot();
    }
    if (isErrorForgot) {
      toast.error(errorForgot.message || "Something went wrong");
    }

    if (isSuccessResetPassword) {
      onClose();
      toast.success(dataResetPassword.message || "Password reset successfully");
      resetForgot();
      resetForm();
    }
    if (isErrorResetPassword) {
      toast.error(errorResetPassword.message || "Something went wrong");
    }
  }, [
    isSuccessForgot,
    isSuccessResetPassword,
    isErrorForgot,
    isErrorResetPassword,
  ]);

  return (
    <Modal
      title={isForgot ? "Forgot Password" : "Reset Password"}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form onFinish={handleSubmit}>
        {isForgot ? (
          <Form.Item
            validateStatus={errors.email && touched.email ? "error" : ""}
            help={errors.email && touched.email ? errors.email : ""}
          >
            <Input
              name="email"
              placeholder="Email"
              prefix={<FiMail />}
              type="email"
              size="large"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form.Item>
        ) : (
          <>
            <Form.Item
              validateStatus={errors.otp && touched.otp ? "error" : ""}
              help={errors.otp && touched.otp ? errors.otp : ""}
            >
              <Input
                name="otp"
                placeholder="OTP"
                prefix={<FiMail />}
                type="text"
                size="large"
                value={values.otp}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>
            <Form.Item
              validateStatus={
                errors.password && touched.password ? "error" : ""
              }
              help={errors.password && touched.password ? errors.password : ""}
            >
              <Input.Password
                name="password"
                placeholder="New Password"
                prefix={<FiLock />}
                size="large"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>
            <Form.Item
              validateStatus={
                errors.confirm_password && touched.confirm_password
                  ? "error"
                  : ""
              }
              help={
                errors.confirm_password && touched.confirm_password
                  ? errors.confirm_password
                  : ""
              }
            >
              <Input.Password
                name="confirm_password"
                placeholder="Confirm Password"
                prefix={<FiLock />}
                size="large"
                value={values.confirm_password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Item>
          </>
        )}
        {!isForgot && (
          // resend otp
          <div className="text-center">
            <Button type="link" size="large" onClick={() => setIsForgot(true)}>
              Resend OTP
            </Button>
          </div>
        )}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full mt-5"
            disabled={isLoadingForgot || isLoadingResetPassword}
          >
            {isLoadingForgot || isLoadingResetPassword ? (
              <PulseLoader size={10} />
            ) : (
              "Submit"
            )}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ForgotPassword;
