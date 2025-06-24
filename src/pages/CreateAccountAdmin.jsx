import React, { useState } from "react";
import { Form, Input, Button, Card, message, Select } from "antd";
import { AccountAdminAPI } from "../apis/accountadmin";

export default function CreateAccountAdmin() {
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const onFinish = async (values) => {
    setLoading(true);
    setErrorMessages([]);
    try {
      await AccountAdminAPI.createAccount(values);
      message.success("Account has been created successfully!");
    } catch (error) {
      let errors = [];
      if (error.response?.data?.Errors && Array.isArray(error.response.data.Errors)) {
        const passwordErrors = error.response.data.Errors.filter(e =>
          e.toLowerCase().includes("password")
        );
        const usernameErrors = error.response.data.Errors.filter(e =>
          e.toLowerCase().includes("user name") || e.toLowerCase().includes("username")
        );
        const otherErrors = error.response.data.Errors.filter(e =>
          !e.toLowerCase().includes("password") &&
          !e.toLowerCase().includes("user name") &&
          !e.toLowerCase().includes("username")
        );
        if (passwordErrors.length > 0) {
          errors.push(
            "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số."
          );
        }
        if (usernameErrors.length > 0) {
          errors.push("Username is already taken or invalid. Please choose another username.");
        }
        errors = [...errors, ...otherErrors];
      } else if (error.response?.data?.message) {
        if (
          error.response.data.message.toLowerCase().includes("password") ||
          error.response.data.message.toLowerCase().includes("mật khẩu")
        ) {
          errors = [
            "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số."
          ];
        } else {
          errors = [error.response.data.message];
        }
      } else {
        errors = ["An error occurred. Please try again!"];
      }
      errors.forEach(errMsg => message.error(errMsg));
      setErrorMessages(errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card style={{ minWidth: 370, maxWidth: 400 }}>
        <h2 style={{ textAlign: "center" }}>Create Account</h2>
        {errorMessages.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {errorMessages.map((err, idx) => (
              <div key={idx} style={{ color: "red" }}>{err}</div>
            ))}
          </div>
        )}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="User Name"
            name="userName"
            rules={[
              { required: true, message: "Please enter username!" },
              { pattern: /^[a-zA-Z0-9_]+$/, message: "Username can only contain letters, numbers and underscore!" }
            ]}
          >
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter the password!" },
              { min: 8, message: "Password must be at least 8 characters!" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: "Password must contain at least one uppercase letter, one lowercase letter, and one number!"
              }
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please choose the role!" }]}
          >
            <Select placeholder="Select role">
              <Select.Option value="Manager">Manager</Select.Option>
              <Select.Option value="Staff">Staff</Select.Option>
              <Select.Option value="Consultant">Consultant</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
