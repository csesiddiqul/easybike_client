import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Checkbox, Segmented } from "antd";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import "./Login.css";
import { assets } from "../../../assets";
import { useNavigate } from "react-router-dom";
import { themeToggle } from "../../redux/features/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import toast from "react-hot-toast";
import { setCredentials } from "../../redux/features/authSlice";
import { useLoginMutation } from "../../redux/api/authApiSlice";
import { PulseLoader } from "react-spinners";
import ForgotPassword from "./ForgotPassword";

const Auth = () => {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  const [login, { isLoading, isError, isSuccess, error, data }] =
    useLoginMutation();

  useEffect(() => {
    if (mode) {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(mode);
    }
  }, [mode]);

  const toggleDarkMode = () => {
    dispatch(themeToggle());
  };

  const showModal = () => {
    setOpen(true);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email address is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password field is required"),
  });

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Login failed");
    }
    if (isSuccess) {
      toast.success(data?.message || "Login success");
      dispatch(setCredentials(data?.data));
      navigate("/profile");
    }
    // eslint-disable-next-line
  }, [isError, isSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
      <div className="absolute top-4 right-4">
        <Segmented
          options={[
            {
              label: <MdOutlineLightMode size={20} className="p-1" />,
              value: "light",
            },
            {
              label: <MdOutlineDarkMode size={20} className="p-1" />,
              value: "dark",
            },
          ]}
          value={mode}
          onChange={toggleDarkMode}
        />
      </div>

      {/* Card */}
      <div className="login-card max-w-md w-full relative">
        {/* top thin blue border */}
        <div className="top-border" />

        {/* content */}
        <div className="card-body px-8 pt-6 pb-8">
          <div className="flex justify-center mb-6">
            <img src={assets.logo} alt="Logo" className="h-24" />
          </div>

          <h2 className="text-center text-gray-700 dark:text-gray-100 text-lg font-bold">
            Sign in to start your session
          </h2>

          <p className="text-center text-gray-500 dark:text-gray-400 text-md mb-6">
            Please enter your email and password to sign in and start your session.
          </p>


          <Formik
            initialValues={{ email: "", password: "", remember: true }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              login(values);
            }}
          >
            {({
              errors,
              touched,
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              setFieldValue,
            }) => (
              <Form onFinish={handleSubmit} layout="vertical">
                {/* Email */}
                <Form.Item
                  validateStatus={errors.email && touched.email ? "error" : ""}
                  help={errors.email && touched.email ? errors.email : ""}
                >
                  <div className="input-with-icon mb-1">
                    <input
                      name="email"
                      placeholder="Enter Your Email"
                      type="text"
                      className="input-left"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                    />
                    <div className="input-icon-box" aria-hidden>
                      <FiMail size={18} />
                    </div>
                  </div>
                </Form.Item>

                {/* Password */}
                <Form.Item
                  validateStatus={
                    errors.password && touched.password ? "error" : ""
                  }
                  help={
                    errors.password && touched.password ? errors.password : ""
                  }
                >
                  <div className="input-with-icon mb-1">
                    <input
                      name="password"
                      placeholder="Enter Password"
                      type={showPassword ? "text" : "password"}
                      className="input-left"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="current-password"
                    />
                    {/* eye toggle button */}
                    <button
                      type="button"
                      className="input-icon-box eye-toggle"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </Form.Item>

                {/* Remember and forgot */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Checkbox
                      className="mt-4"
                      name="remember"
                      checked={values.remember}
                      onChange={(e) => setFieldValue("remember", e.target.checked)}
                    >
                      <span className="text-gray-900 dark:text-gray-100">Remember Me</span>
                    </Checkbox>
                  </div>

                  <button
                    type="button"
                    className="mt-4"
                    onClick={showModal}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <Form.Item className="submit-item">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="w-full custom-submit"
                    disabled={isLoading}
                  >
                    {isLoading ? <PulseLoader size={8} /> : "Sign In"}
                  </Button>
                </Form.Item>

               
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <ForgotPassword open={open} setOpen={setOpen} />
    </div>
  );
};

export default Auth;
