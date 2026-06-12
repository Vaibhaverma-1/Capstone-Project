import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select } from "antd";
import CustomCard from "src/asserts/UI_components/Card/card.styled";
import StyledButton from "src/asserts/UI_components/ButtonComponent/button.styled";
import { ToastMessage } from "src/asserts/UI_components/ToastMessage.tsx/toastMessage.styled";
import { userStore } from "src/utils/userStore";
import { StyledForgotPasswordPage } from "./forgotPassword.styled";

// const { Option } = Select;

type Step = "verify_user" | "verify_answer" | "reset_password";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("verify_user");
  const [username, setUsername] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [form] = Form.useForm();

  // ── Step 1: Verify username exists
  const handleVerifyUser = (values: { user_unique_id: string }) => {
    const user = userStore.getUser(values.user_unique_id);

    if (!user) {
      ToastMessage.error("Username not found. Please register first.", 3);
      return;
    }

    if (!user.security_question) {
      ToastMessage.error("No security question set for this account.", 3);
      return;
    }

    setUsername(values.user_unique_id);
    setSecurityQuestion(user.security_question);
    form.resetFields();
    setCurrentStep("verify_answer");
  };

  // ── Step 2: Verify security answer
  const handleVerifyAnswer = (values: { security_answer: string }) => {
    const isCorrect = userStore.validateSecurityAnswer(
      username,
      values.security_answer
    );

    if (!isCorrect) {
      ToastMessage.error("Incorrect answer. Please try again.", 3);
      return;
    }

    form.resetFields();
    setCurrentStep("reset_password");
  };

  // ── Step 3: Reset password
  const handleResetPassword = (values: { new_password: string }) => {
    const success = userStore.updatePassword(
      username,
      values.new_password
    );

    if (!success) {
      ToastMessage.error("Something went wrong. Please try again.", 3);
      return;
    }

    ToastMessage.success(
      "Password reset successfully! Please login.",
      3
    );

    navigate("/");
  };

  // ── Card title per step
  const stepTitle = {
    verify_user: "Forgot Password — Step 1 of 3",
    verify_answer: "Forgot Password — Step 2 of 3",
    reset_password: "Forgot Password — Step 3 of 3",
  };

  const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 10 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
  };

  return (
    <StyledForgotPasswordPage>
      <CustomCard
        title={stepTitle[currentStep]}
        width={"400px"}
      >
        {/* ── Step 1: Enter username ── */}
        {currentStep === "verify_user" && (
          <Form
            {...formItemLayout}
            form={form}
            onFinish={handleVerifyUser}
            autoComplete="off"
          >
            <Form.Item
              name="user_unique_id"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Please enter your username!",
                },
              ]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <StyledButton
                type="primary"
                htmlType="submit"
                style={{ marginRight: 8 }}
              >
                Next
              </StyledButton>

              <StyledButton onClick={() => navigate("/")}>
                Back to Login
              </StyledButton>
            </Form.Item>
          </Form>
        )}

        {/* ── Step 2: Answer security question ── */}
        {currentStep === "verify_answer" && (
          <Form
            {...formItemLayout}
            form={form}
            onFinish={handleVerifyAnswer}
            autoComplete="off"
          >
            <Form.Item label="Security Question">
              <span style={{ fontWeight: 500 }}>
                {securityQuestion}
              </span>
            </Form.Item>

            <Form.Item
              name="security_answer"
              label="Your Answer"
              rules={[
                {
                  required: true,
                  message: "Please enter your answer!",
                },
              ]}
            >
              <Input placeholder="Enter your answer" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <StyledButton
                type="primary"
                htmlType="submit"
                style={{ marginRight: 8 }}
              >
                Verify
              </StyledButton>

              <StyledButton
                onClick={() => {
                  form.resetFields();
                  setCurrentStep("verify_user");
                }}
              >
                Back
              </StyledButton>
            </Form.Item>
          </Form>
        )}

        {/* ── Step 3: Set new password ── */}
        {currentStep === "reset_password" && (
          <Form
            {...formItemLayout}
            form={form}
            onFinish={handleResetPassword}
            autoComplete="off"
          >
            <Form.Item
              name="new_password"
              label="New Password"
              rules={[
                {
                  required: true,
                  message: "Please enter a new password!",
                },
                {
                  min: 8,
                  message:
                    "Password must be at least 8 characters",
                },
                {
                  pattern:
                    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                  message:
                    "Must contain uppercase, number and special character",
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Enter new password" />
            </Form.Item>

            <Form.Item
              name="confirm_new_password"
              label="Confirm Password"
              dependencies={["new_password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      getFieldValue("new_password") === value
                    ) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error("Passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm new password" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <StyledButton
                type="primary"
                htmlType="submit"
              >
                Reset Password
              </StyledButton>
            </Form.Item>
          </Form>
        )}
      </CustomCard>
    </StyledForgotPasswordPage>
  );
}