import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Card } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { BlogStaffAPI } from "../apis/blogStaff";

export default function CreateBlogStaff() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("Title", values.title);
    formData.append("Content", values.content);
    formData.append("Category", values.category);
    if (values.images) {
      values.images.forEach((file) => {
        formData.append("images", file.originFileObj);
      });
    }
    setLoading(true);
    try {
      await BlogStaffAPI.create(formData);
      message.success("Blog created successfully!");
      form.resetFields();
    } catch (err) {
      message.error("Failed to create blog!");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <Card title="Create New Blog" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the title!" }]}
          >
            <Input placeholder="Enter blog title" />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: "Please enter the content!" }]}
          >
            <Input.TextArea rows={6} placeholder="Enter blog content" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please enter the category!" }]}
          >
            <Input placeholder="Enter blog category" />
          </Form.Item>
          <Form.Item label="Images" name="images" valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}>
            <Upload
              listType="picture"
              beforeUpload={() => false}
              multiple
            >
              <Button icon={<UploadOutlined />}>Select Images</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create Blog
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
