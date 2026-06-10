import React, { useState, useEffect } from "react";
import { useAppContext } from "src/context/appContext";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Form as AntForm,
  App,
  Input,
  Button,
  Row,
  Col,
  Space,
  Typography,
  // message,
  Divider,
  Select,
} from "antd";
import { Avatar, Upload } from "antd";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
//import { updateProfileAPI } from "src/services/updateProfileAPI";
// import { OrganizationForm } from "./orgProfile";

const { Text } = Typography;

const profileSchema = Yup.object({
  user_first_name: Yup.string().required("First Name is required"),

  user_middle_name: Yup.string(),

  user_last_name: Yup.string().required("Last Name is required"),

  user_email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  user_phone: Yup.string()
    .matches(/^\d{10}$/, "Phone must be exactly 10 digits")
    .required("Phone number is required"),

  user_gender: Yup.string().required("Gender is required"),

  user_pincode: Yup.string()
    .matches(/^\d{6}$/, "Pincode must be 6 digits")
    .required("Pincode is required"),

  user_city: Yup.string().required("City is required"),

  user_state: Yup.string().required("State is required"),

  user_country: Yup.string().required("Country is required"),

  user_address: Yup.string().required("Address is required"),
});

export const Profile = () => {
  const { userDetails, setUserDetails } = useAppContext(); // Replace with your global state management
  // const [form] = Form.useForm();
  const [isEditable, setIsEditable] = useState(false);
  const { Option } = Select;
  const { message } = App.useApp();
  // useEffect(() => {
  //   // Pre-fill form with user data when the component mounts
  //   if (userDetails) {
  //     form.setFieldsValue({
  //       ...userDetails,
  //     });
  //   }
  // }, [userDetails]);
  const handleEditToggle = () => {
    setIsEditable(true);
  };

  const handleFormSubmit = async (values: any) => {
    try {
      const updatedUser = {
        ...userDetails,
        ...values,
      };

      setUserDetails(updatedUser);

      sessionStorage.setItem("userDetails", JSON.stringify(updatedUser));

      message.success("Profile updated successfully!");
      setIsEditable(false);
    } catch (err) {
      message.error("Failed to update profile");
    }
  };

  const handleCancel = (resetForm: () => void) => {
    setIsEditable(false);
    console.log(userDetails.user_avatar);
    resetForm(); // Reset the form values
  };

  const colLayout = isEditable
    ? { xs: 24, sm: 12, lg: 8 }
    : { xs: 24, sm: 12, lg: 6 };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        user_unique_id: userDetails?.user_unique_id || "",
        user_first_name: userDetails?.user_first_name || "",
        user_middle_name: userDetails?.user_middle_name || "",
        user_last_name: userDetails?.user_last_name || "",
        user_email: userDetails?.user_email || "",
        user_phone: userDetails?.user_phone || "",
        user_gender: userDetails?.user_gender || "",
        user_pincode: userDetails?.user_pincode || "",
        user_landmark: userDetails?.user_landmark || "",
        user_city: userDetails?.user_city || "",
        user_state: userDetails?.user_state || "",
        user_country: userDetails?.user_country || "",
        user_address: userDetails?.user_address || "",
      }}
      validationSchema={profileSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        values,
        handleChange,
        handleBlur,
        errors,
        touched,
        resetForm,
        setFieldValue,
        setFieldTouched,
      }) => (
        <Form>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: "24px" }}
          >
            <Col>
              <h2>Profile Details</h2>
            </Col>
            <Col>
              <Space>
                {!isEditable && (
                  <Button
                    icon={<EditOutlined />}
                    type="primary"
                    onClick={() => setIsEditable(true)}
                  >
                    Edit
                  </Button>
                )}

                {isEditable && (
                  <Button
                    icon={<SaveOutlined />}
                    type="primary"
                    htmlType="submit"
                  >
                    Save
                  </Button>
                )}

                {isEditable && (
                  <Button
                    icon={<CloseOutlined />}
                    danger
                    onClick={() => handleCancel(resetForm)}
                  >
                    Cancel
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
          <Divider />
          <div>
            <Row gutter={[16, 8]}>
              <Col span={24}>
                <Avatar
                  src={userDetails?.user_avatar}
                  size={100}
                  icon={<UserOutlined />}
                />
                <Button>Change Avatar</Button>
              </Col>
              {/* User ID */}
              <Col {...colLayout}>
                <AntForm.Item
                  label="User ID"
                  labelCol={{
                    style: {
                      fontWeight: "bold",
                      padding: !isEditable ? 0 : "",
                    },
                  }}
                >
                  <Text>{userDetails?.user_unique_id}</Text>
                </AntForm.Item>
              </Col>

              {/* First Name */}
              <Col {...colLayout}>
                <AntForm.Item
                  label="First Name"
                  validateStatus={
                    touched.user_first_name && errors.user_first_name
                      ? "error"
                      : ""
                  }
                  help={
                    touched.user_first_name && errors.user_first_name
                      ? (errors.user_first_name as string)
                      : undefined
                  }
                  labelCol={{
                    style: {
                      fontWeight: "bold",
                      padding: !isEditable ? 0 : "",
                    },
                  }}
                >
                  {isEditable ? (
                    <Input
                      name="user_first_name"
                      value={values.user_first_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : (
                    <Text>{userDetails?.user_first_name}</Text>
                  )}
                </AntForm.Item>
              </Col>

              {/* Middle Name */}
              <Col {...colLayout}>
                <AntForm.Item
                  label="Middle Name"
                  labelCol={{
                    style: {
                      fontWeight: "bold",
                      padding: !isEditable ? 0 : "",
                    },
                  }}
                >
                  {isEditable ? (
                    <Input
                      name="user_middle_name"
                      value={values.user_middle_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : (
                    <Text>{userDetails?.user_middle_name || "--"}</Text>
                  )}
                </AntForm.Item>
              </Col>
              {/* Last Name */}
              <Col {...colLayout}>
                <AntForm.Item
                  label="Last Name"
                  validateStatus={
                    touched.user_last_name && errors.user_last_name
                      ? "error"
                      : ""
                  }
                  help={
                    touched.user_last_name && errors.user_last_name
                      ? (errors.user_last_name as string)
                      : undefined
                  }
                  labelCol={{
                    style: {
                      fontWeight: "bold",
                      padding: !isEditable ? 0 : "",
                    },
                  }}
                >
                  {isEditable ? (
                    <Input
                      name="user_last_name"
                      value={values.user_last_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : (
                    <Text>{userDetails?.user_last_name}</Text>
                  )}
                </AntForm.Item>
              </Col>

              {/* Email */}
              <Col {...colLayout}>
                <AntForm.Item
                  label="Email"
                  validateStatus={
                    touched.user_email && errors.user_email ? "error" : ""
                  }
                  help={
                    touched.user_email && errors.user_email
                      ? (errors.user_email as string)
                      : undefined
                  }
                  labelCol={{
                    style: {
                      fontWeight: "bold",
                      padding: !isEditable ? 0 : "",
                    },
                  }}
                >
                  {isEditable ? (
                    <Input
                      name="user_email"
                      value={values.user_email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : (
                    <Text>{userDetails?.user_email}</Text>
                  )}
                </AntForm.Item>
              </Col>

              {/* Phone */}
              <Col {...colLayout}>
                <AntForm.Item
                  label="Phone"
                  validateStatus={
                    touched.user_phone && errors.user_phone ? "error" : ""
                  }
                  help={
                    touched.user_phone && errors.user_phone
                      ? (errors.user_phone as string)
                      : undefined
                  }
                  labelCol={{
                    style: {
                      fontWeight: "bold",
                      padding: !isEditable ? 0 : "",
                    },
                  }}
                >
                  {isEditable ? (
                    <Input
                      name="user_phone"
                      maxLength={10}
                      inputMode="numeric"
                      addonBefore={userDetails?.prefix}
                      value={values.user_phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : (
                    <Text>{`${userDetails?.prefix || ""}${userDetails?.user_phone}`}</Text>
                  )}
                </AntForm.Item>
              </Col>

              {/* Gender Dropdown */}
              <Col {...colLayout}>
                <AntForm.Item
                  label="Gender"
                  validateStatus={
                    touched.user_gender && errors.user_gender ? "error" : ""
                  }
                  help={
                    touched.user_gender && errors.user_gender
                      ? (errors.user_gender as string)
                      : undefined
                  }
                  labelCol={{
                    style: {
                      fontWeight: "bold",
                      padding: !isEditable ? 0 : "",
                    },
                  }}
                >
                  {isEditable ? (
                    <Select
                      value={values.user_gender || undefined}
                      placeholder="Select Gender"
                      onChange={(val) => setFieldValue("user_gender", val)}
                      onBlur={() => setFieldTouched("user_gender", true)}
                    >
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  ) : (
                    <Text>{userDetails?.user_gender || "N/A"}</Text>
                  )}
                </AntForm.Item>
              </Col>

              {/* Pincode */}
              <Col {...colLayout}>
                <AntForm.Item
                  label="Pincode"
                  validateStatus={
                    touched.user_pincode && errors.user_pincode ? "error" : ""
                  }
                  help={
                    touched.user_pincode && errors.user_pincode
                      ? (errors.user_pincode as string)
                      : undefined
                  }
                  labelCol={{
                    style: {
                      fontWeight: "bold",
                      padding: !isEditable ? 0 : "",
                    },
                  }}
                >
                  {isEditable ? (
                    <Input
                      name="user_pincode"
                      value={values.user_pincode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : (
                    <Text>{userDetails?.user_pincode || "--"}</Text>
                  )}
                </AntForm.Item>
              </Col>
              {/* Landmark */}
              <Col {...colLayout}>
                <AntForm.Item
                  label="Landmark"
                  labelCol={{
                    style: {
                      fontWeight: "bold",
                      padding: !isEditable ? 0 : "",
                    },
                  }}
                >
                  {isEditable ? (
                    <Input
                      name="user_landmark"
                      value={values.user_landmark}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : (
                    <Text>{userDetails?.user_landmark || "--"}</Text>
                  )}
                </AntForm.Item>
              </Col>
              {/* City */}
              <Col {...colLayout}>
                <AntForm.Item
                  label="City"
                  validateStatus={
                    touched.user_city && errors.user_city ? "error" : ""
                  }
                  help={
                    touched.user_city && errors.user_city
                      ? (errors.user_city as string)
                      : undefined
                  }
                  labelCol={{
                    style: {
                      fontWeight: "bold",
                      padding: !isEditable ? 0 : "",
                    },
                  }}
                >
                  {isEditable ? (
                    <Input
                      name="user_city"
                      value={values.user_city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : (
                    <Text>{userDetails?.user_city || "--"}</Text>
                  )}
                </AntForm.Item>
              </Col>

              <Col {...colLayout}>
                <AntForm.Item
                  label="State"
                  validateStatus={
                    touched.user_state && errors.user_state ? "error" : ""
                  }
                  help={
                    touched.user_state && errors.user_state
                      ? (errors.user_state as string)
                      : undefined
                  }
                  labelCol={{
                    style: {
                      fontWeight: "bold",
                      padding: !isEditable ? 0 : "",
                    },
                  }}
                >
                  {isEditable ? (
                    <Input
                      name="user_state"
                      value={values.user_state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : (
                    <Text>{userDetails?.user_state || "--"}</Text>
                  )}
                </AntForm.Item>
              </Col>
              <Col {...colLayout}>
                <AntForm.Item
                  label="Country"
                  validateStatus={
                    touched.user_country && errors.user_country ? "error" : ""
                  }
                  help={
                    touched.user_country && errors.user_country
                      ? (errors.user_country as string)
                      : undefined
                  }
                  labelCol={{
                    style: {
                      fontWeight: "bold",
                      padding: !isEditable ? 0 : "",
                    },
                  }}
                >
                  {isEditable ? (
                    <Input
                      name="user_country"
                      value={values.user_country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : (
                    <Text>{userDetails?.user_country || "--"}</Text>
                  )}
                </AntForm.Item>
              </Col>

              {/* Address */}
              <Col xs={24}>
                <AntForm.Item
                  label="Address"
                  validateStatus={
                    touched.user_address && errors.user_address ? "error" : ""
                  }
                  help={
                    touched.user_address && errors.user_address
                      ? (errors.user_address as string)
                      : undefined
                  }
                  labelCol={{
                    style: {
                      fontWeight: "bold",
                      padding: !isEditable ? 0 : "",
                    },
                  }}
                >
                  {isEditable ? (
                    <Input.TextArea
                      name="user_address"
                      rows={3}
                      value={values.user_address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  ) : (
                    <Text>{userDetails?.user_address || "--"}</Text>
                  )}
                </AntForm.Item>
              </Col>
            </Row>
          </div>
        </Form>
      )}
    </Formik>
  );
};
