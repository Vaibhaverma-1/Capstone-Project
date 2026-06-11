import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "src/context/appContext";
import type { FormProps } from "antd";
import { Checkbox, Form, Input, Modal } from "antd";
import CustomCard from "src/asserts/UI_components/Card/card.styled";
import { StyledLoginPage } from "./login.styled";
import StyledButton from "src/asserts/UI_components/ButtonComponent/button.styled";
import { ToastMessage } from "src/asserts/UI_components/ToastMessage.tsx/toastMessage.styled";
import { getSummaryAPI } from "src/services/summaryAPi";
import { tokenUtils } from "src/utils/tokenUtils";
import { userStore, StoredUser } from "src/utils/userStore";

type FieldType = {
  user_unique_id?: string;
  user_password?: string;
  remember?: string;
};

type ModalType = "not_registered" | "wrong_password";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUserDetails } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType]     = useState<ModalType>("not_registered");

  const showModal = (type: ModalType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const user_unique_id = values?.user_unique_id ?? "";
    const user_password  = values?.user_password  ?? "";

    const userExists     = userStore.usernameExists(user_unique_id);
    const registeredUser = userStore.validateLogin(user_unique_id, user_password);

    if (!userExists) {
      showModal("not_registered");
      return;
    }
    if (!registeredUser) {
      showModal("wrong_password");
      return;
    }

    // ✅ Valid credentials — generate unique JWT and load summary
    const fakeToken = generateFakeJWT(registeredUser);
    tokenUtils.setToken(fakeToken);
    await getSummary(registeredUser);
  };

  const generateFakeJWT = (user: StoredUser): string => {
    const header  = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        userId:    user.user_unique_id,
        email:     user.user_email,
        firstName: user.user_first_name,
        lastName:  user.user_last_name,
        phone:     user.user_phone,
        gender:    user.user_gender,
        country:   user.user_country,
        role:      "user",
        iat:       Math.floor(Date.now() / 1000),
        exp:       Math.floor(Date.now() / 1000) + 60 * 60 * 8,
      })
    );
    const signature = btoa(`stub-sig-${user.user_unique_id}`);
    return `${header}.${payload}.${signature}`;
  };

  const getSummary = async (registeredUser: StoredUser) => {
    try {
      const summaryResponse = await getSummaryAPI();

      // Build userDetails from the registered user's actual data
      // (summary.json is a stub — we override with real registered data)
      const userDetails = {
        user_unique_id:    registeredUser.user_unique_id,
        user_first_name:   registeredUser.user_first_name,
        user_middle_name:  registeredUser.user_middle_name ?? "",
        user_last_name:    registeredUser.user_last_name,
        user_email:        registeredUser.user_email,
        user_phone:        registeredUser.user_phone ?? "",
        user_dob:          registeredUser.user_dob ?? "",
        user_gender:       registeredUser.user_gender ?? "",
        user_bio:          registeredUser.user_bio ?? "",
        user_img:          registeredUser.user_img ?? "",
        user_country:      registeredUser.user_country ?? "",
        user_state:        registeredUser.user_state ?? "",
        user_city:         registeredUser.user_city ?? "",
        user_pincode:      registeredUser.user_pincode ?? "",
        user_landmark:     registeredUser.user_landmark ?? "",
        user_address:      registeredUser.user_address ?? "",
        user_agreement:    registeredUser.user_agreement ?? false,
        user_is_active:    registeredUser.user_is_active ?? true,
        user_verified:     registeredUser.user_verified ?? "false",
        user_org_limit:    registeredUser.user_org_limit ?? null,
        user_selected_org: registeredUser.user_selected_org ?? null,
        user_created_date: registeredUser.user_created_date ?? "",
        user_last_login:   new Date().toISOString(),
        // services from summary stub (role-based features)
        services: summaryResponse?.userSummary?.services ?? [],
        roles:    summaryResponse?.userSummary?.roles    ?? ["user"],
      };

      setUserDetails(userDetails);
      sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
      navigate("assets");
    } catch (error) {
      ToastMessage.error("Something went wrong, please try again", 3);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const actions: React.ReactNode[] = [
    <StyledButton onClick={() => navigate("/forgot-password")}>
      Forget Password
    </StyledButton>,
    <StyledButton onClick={() => navigate("/register")}>
      Register
    </StyledButton>,
  ];

  const modalConfig = {
    not_registered: {
      title:   "Account Not Found",
      message: "You don't have an account yet. Please register first before trying to login.",
      footer: [
        <StyledButton
          key="register"
          type="primary"
          onClick={() => { setIsModalOpen(false); navigate("/register"); }}
        >
          Go to Register
        </StyledButton>,
        <StyledButton key="close" onClick={() => setIsModalOpen(false)}>
          Cancel
        </StyledButton>,
      ],
    },
    wrong_password: {
      title:   "Incorrect Password",
      message: "The password you entered is incorrect. Please try again.",
      footer: [
        <StyledButton key="close" type="primary" onClick={() => setIsModalOpen(false)}>
          Try Again
        </StyledButton>,
      ],
    },
  };

  const currentModal = modalConfig[modalType];

  return (
    <StyledLoginPage>
      <Modal
        title={currentModal.title}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={currentModal.footer}
        centered
      >
        <p style={{ fontSize: "14px", padding: "12px 0" }}>
          {currentModal.message}
        </p>
      </Modal>

      <CustomCard title="Login" width={"300px"} actions={actions}>
        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Username"
            name="user_unique_id"
            rules={[{ required: true, message: "Please enter a valid username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Password"
            name="user_password"
            rules={[
              { required: true, message: "Please enter your password!" },
              {
                pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                message: "Password must contain at least one uppercase letter and one special character!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 0, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <StyledButton type="primary" htmlType="submit">
              Submit
            </StyledButton>
          </Form.Item>
        </Form>
      </CustomCard>
    </StyledLoginPage>
  );
}