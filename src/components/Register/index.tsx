import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateUsername } from "src/services/validateUsernameAPI";
import { validateEmail } from "src/services/validateEmailAPI";
import { validatePhone } from "src/services/validatePhoneAPI";
import { Checkbox, Form, Input, Select, DatePicker } from "antd";
import codes from "../../utils/codes.json";
import CustomCard from "src/asserts/UI_components/Card/card.styled";
import { StyledRegisterPage } from "./register.styled";
import StyledButton from "src/asserts/UI_components/ButtonComponent/button.styled";
import { ToastMessage } from "src/asserts/UI_components/ToastMessage.tsx/toastMessage.styled";
import { userStore } from "src/utils/userStore";

const { Option } = Select;

const SECURITY_QUESTIONS = [
  "What is the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What is your favourite movie?",
  "What city were you born in?",
];

interface PrefixOption {
  label: string;
  value: string;
  key: string;
}

type FormFields = {
  user_unique_id: string;
  user_first_name: string;
  user_middle_name?: string;
  user_last_name: string;
  user_email: string;
  user_password: string;
  confirm_password: string;
  prefix: string;
  user_phone: string;
  user_dob: any;
  user_gender: string;
  user_bio?: string;
  user_img?: string;
  user_country?: string;
  user_state?: string;
  user_city?: string;
  user_pincode?: string;
  user_landmark?: string;
  user_address?: string;
  user_agreement: boolean;
  user_role?: string;
  user_verified?: boolean;
  user_active?: boolean;
  user_org_limit?: number;
  security_question?: string;
  security_answer?: string;
};

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 10 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};

const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } },
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [formCurrentStep, setFormCurrentStep] = useState(1);
  const [finalFormFieldsData, setFinalFormFieldsData] = useState<FormFields>({
    user_unique_id: "",
    user_first_name: "",
    user_middle_name: "",
    user_last_name: "",
    user_email: "",
    user_password: "",
    confirm_password: "",
    prefix: "",
    user_phone: "",
    user_dob: "",
    user_gender: "",
    user_bio: "",
    user_img: "",
    user_country: "",
    user_state: "",
    user_city: "",
    user_pincode: "",
    user_landmark: "",
    user_address: "",
    user_agreement: false,
    user_role: "",
    user_verified: false,
    user_active: true,
    user_org_limit: 1,
    security_question: "",
    security_answer: "",
  });

  const [prefixOptions, setPrefixOptions] = useState<PrefixOption[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const options = codes.map((country) => ({
      label: `${country.countryTelephonyCode} (${country.fullCountryName})`,
      value: country.countryTelephonyCode,
      key: country.shortCountryName,
    }));
    setPrefixOptions(options);
  }, []);

  const handleUsernameBlur = async (username: string) => {
    if (!username) return;
    if (userStore.usernameExists(username)) {
      // setUsernameError("Username already exists, please select another one");
      return;
    }
    try {
      const response = await validateUsername(username);
      if (response?.success && response?.usernameValidation) {
        if (response.usernameValidation.exists) {
          // setUsernameError("Username already exists, please select another one");
        } else {
          setUsernameError(null);
        }
      }
    } catch (error) {
      console.error("Error validating username:", error);
    }
  };

  const handleEmailBlur = async (email: string) => {
    if (!email) return;
    if (userStore.emailExists(email)) {
      setEmailError("Email already exists, please use another one");
      return;
    }
    try {
      const response = await validateEmail(email);
      if (response?.success && response?.emailValidation) {
        if (response.emailValidation.exists) {
          setEmailError("Email already exists, please use another one");
        } else {
          setEmailError(null);
        }
      }
    } catch (error) {
      console.error("Error validating email:", error);
    }
  };

  const handlePhoneBlur = async (phone: string) => {
    if (!phone) return;
    try {
      const response = await validatePhone(phone);
      if (response?.success && response?.phoneValidation) {
        if (response.phoneValidation.exists) {
          setPhoneError("Phone already exists, please use another one");
        } else {
          setPhoneError(null);
        }
      }
    } catch (error) {
      console.error("Error validating phone:", error);
    }
  };

  const onFinish = async () => {
    const currentValues = form.getFieldsValue();

    if (formCurrentStep === 1) {
      setFinalFormFieldsData((prev) => ({ ...prev, ...currentValues }));
      setFormCurrentStep(2);
      return;
    }
    if (formCurrentStep === 2) {
      setFinalFormFieldsData((prev) => ({ ...prev, ...currentValues }));
      setFormCurrentStep(3);
      return;
    }
    if (formCurrentStep === 3) {
      setFinalFormFieldsData((prev) => ({ ...prev, ...currentValues }));
      setFormCurrentStep(4);
      return;
    }

    // Step 4 — final submit
    const mergedData: FormFields = { ...finalFormFieldsData, ...currentValues };
    const now = new Date().toISOString();

    // Save full registration details to sessionStorage
    userStore.registerUser({
      user_unique_id: mergedData.user_unique_id,
      user_password: mergedData.user_password,
      user_first_name: mergedData.user_first_name,
      user_middle_name: mergedData.user_middle_name,
      user_last_name: mergedData.user_last_name,
      user_email: mergedData.user_email,
      prefix: mergedData.prefix,
      user_phone: mergedData.user_phone,
      user_dob: mergedData.user_dob
        ? mergedData.user_dob.$d?.toISOString()
        : "",
      user_gender: mergedData.user_gender,
      user_bio: mergedData.user_bio,
      user_img: mergedData.user_img,
      user_country: mergedData.user_country,
      user_state: mergedData.user_state,
      user_city: mergedData.user_city,
      user_pincode: mergedData.user_pincode,
      user_landmark: mergedData.user_landmark,
      user_address: mergedData.user_address,
      user_agreement: mergedData.user_agreement,
      user_active: true,
      user_is_active: true,
      user_org_limit: null,
      user_verified: "false",
      user_selected_org: null,
      user_created_date: now,
      user_last_login: now,
      registered_at: now,
      security_question: mergedData.security_question,
      security_answer: mergedData.security_answer,
    });

    ToastMessage.success("User created successfully! Please login.", 3);
    navigate("/");
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 75 }}>
        {prefixOptions.map((option) => (
          <Option key={option.key} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );

  const getRegisterActions = () => {
    if (formCurrentStep === 1) {
      return [
        <StyledButton onClick={() => navigate("/")}>
          Back to Login
        </StyledButton>,
        <Form.Item {...tailFormItemLayout}>
          <StyledButton color="default" variant="text" htmlType="submit">
            Next
          </StyledButton>
        </Form.Item>,
      ];
    }
    if (formCurrentStep === 2) {
      return [
        <StyledButton onClick={() => setFormCurrentStep(1)}>Back</StyledButton>,
        <Form.Item {...tailFormItemLayout}>
          <StyledButton variant="text" htmlType="submit">
            Next
          </StyledButton>
        </Form.Item>,
      ];
    }
    if (formCurrentStep === 3) {
      return [
        <StyledButton type="text" onClick={() => setFormCurrentStep(2)}>
          Back
        </StyledButton>,
        <Form.Item {...tailFormItemLayout}>
          <StyledButton variant="text" htmlType="submit">
            Next
          </StyledButton>
        </Form.Item>,
      ];
    }
    if (formCurrentStep === 4) {
      return [
        <StyledButton type="text" onClick={() => setFormCurrentStep(3)}>
          Back
        </StyledButton>,
        <Form.Item {...tailFormItemLayout}>
          <StyledButton variant="text" htmlType="submit">
            Submit
          </StyledButton>
        </Form.Item>,
      ];
    }
  };

  return (
    <StyledRegisterPage>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{ prefix: "91" }}
        style={{ maxWidth: 600 }}
        scrollToFirstError
      >
        <CustomCard
          title={`Register (Step ${formCurrentStep} of 4)`}
          width={"400px"}
          actions={getRegisterActions()}
        >
          {/* ── Step 1: Personal details ── */}
          {formCurrentStep === 1 && (
            <>
              <Form.Item
                name="user_unique_id"
                label="User Name"
                // tooltip="Username should be unique"
                validateStatus={usernameError ? "error" : ""}
                help={usernameError}
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                    whitespace: true,
                  },
                  {
                    min: 3,
                    max: 50,
                    message: "Username must be between 3 and 50 characters",
                  },
                  {
                    pattern: /^[a-zA-Z0-9]+$/,
                    message: "Username must be alphanumeric",
                  },
                ]}
              >
                <Input onBlur={(e) => handleUsernameBlur(e.target.value)} />
              </Form.Item>

              <Form.Item
                name="user_first_name"
                label="First Name"
                tooltip="What do you want us to call you?"
                rules={[
                  {
                    required: true,
                    message: "Please input your first name!",
                    whitespace: true,
                  },
                  {
                    min: 2,
                    max: 50,
                    message: "First name must be between 2 and 50 characters",
                  },
                  {
                    pattern: /^[a-zA-Z]+$/,
                    message: "First name must contain only letters",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_middle_name"
                label="Middle Name"
                rules={[
                  {
                    max: 50,
                    message: "Middle name cannot exceed 50 characters",
                  },
                  {
                    pattern: /^[a-zA-Z]*$/,
                    message: "Middle name must contain only letters",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_last_name"
                label="Last Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your last name!",
                    whitespace: true,
                  },
                  {
                    min: 2,
                    max: 50,
                    message: "Last name must be between 2 and 50 characters",
                  },
                  {
                    pattern: /^[a-zA-Z]+$/,
                    message: "Last name must contain only letters",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_gender"
                label="Gender"
                rules={[{ required: true, message: "Please select gender!" }]}
              >
                <Select placeholder="Select your gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Date of Birth"
                name="user_dob"
                rules={[
                  {
                    required: true,
                    message: "Please input your date of birth!",
                  },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const today = new Date();
                      const thirteenYearsAgo = new Date(
                        today.getFullYear() - 13,
                        today.getMonth(),
                        today.getDate(),
                      );
                      if (value.valueOf() > thirteenYearsAgo.getTime()) {
                        return Promise.reject(
                          new Error("You must be at least 13 years old."),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  disabledDate={(current) =>
                    current && current.valueOf() > Date.now()
                  }
                />
              </Form.Item>
            </>
          )}

          {/* ── Step 2: Contact & credentials ── */}
          {formCurrentStep === 2 && (
            <>
              <Form.Item
                name="user_email"
                label="E-mail"
                validateStatus={emailError ? "error" : ""}
                help={emailError}
                rules={[
                  { type: "email", message: "The input is not a valid email" },
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input onBlur={(e) => handleEmailBlur(e.target.value)} />
              </Form.Item>

              <Form.Item
                name="user_phone"
                label="Phone Number"
                validateStatus={phoneError ? "error" : ""}
                help={phoneError}
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                  {
                    pattern: /^\d{10,10}$/,
                    message: "Phone number must be of 10 digits",
                  },
                ]}
              >
                <Input
                  addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                  onBlur={(e) => handlePhoneBlur(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                name="user_password"
                label="Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  { min: 8, message: "Password must be at least 8 characters" },
                  {
                    pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                    message:
                      "Password must contain an uppercase letter, a number, and a special character",
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                label="Confirm Password"
                dependencies={["user_password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("user_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!"),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}

          {/* ── Step 3: Address & agreement ── */}
          {formCurrentStep === 3 && (
            <>
              <Form.Item
                name="user_bio"
                label="Bio"
                rules={[
                  { max: 200, message: "Bio cannot exceed 200 characters" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_country"
                label="Country"
                rules={[
                  { required: true, message: "Please select your country!" },
                ]}
              >
                <Select placeholder="Select your country">
                  <Option value="india">India</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="user_state"
                label="State"
                rules={[
                  {
                    required: true,
                    max: 200,
                    message: "State cannot exceed 200 characters",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_city"
                label="City"
                rules={[
                  {
                    required: true,
                    max: 200,
                    message: "City cannot exceed 200 characters",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_pincode"
                label="Pincode"
                rules={[
                  {
                    required: true,
                    pattern: /^\d{6,6}$/,
                    message: "Pincode must be of 6 digits",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_landmark"
                label="Landmark"
                rules={[
                  {
                    max: 200,
                    message: "Landmark cannot exceed 200 characters",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_address"
                label="Address"
                rules={[
                  {
                    max: 255,
                    required: true,
                    message: "Address cannot exceed 255 characters",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Should accept Terms & Conditions"),
                          ),
                  },
                ]}
                {...tailFormItemLayout}
              >
                <Checkbox>
                  I have read the <a href="#">Terms &amp; Conditions</a>
                </Checkbox>
              </Form.Item>
            </>
          )}

          {/* ── Step 4: Security Question ── */}
          {formCurrentStep === 4 && (
            <>
              <Form.Item
                name="security_question"
                label="Security Question"
                rules={[
                  {
                    required: true,
                    message: "Please select a security question!",
                  },
                ]}
              >
                <Select placeholder="Select a security question">
                  {SECURITY_QUESTIONS.map((q) => (
                    <Option key={q} value={q}>
                      {q}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="security_answer"
                label="Your Answer"
                rules={[
                  {
                    required: true,
                    message: "Please enter your answer!",
                    whitespace: true,
                  },
                  { min: 2, message: "Answer must be at least 2 characters" },
                ]}
              >
                <Input placeholder="Enter your answer" />
              </Form.Item>
            </>
          )}
        </CustomCard>
      </Form>
    </StyledRegisterPage>
  );
}
