import React, { useEffect } from 'react';
import { Form, Input, Upload, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const CreateBlogForm = ({ onFinish, onCancel, uploading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, []);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ blogImages: [] }}
      preserve={false}
      autoComplete="off"
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please input the title!' }]}
      >
        <Input placeholder="Enter blog title" />
      </Form.Item>

      <Form.Item
        name="content"
        label="Content"
        rules={[{ required: true, message: 'Please input the content!' }]}
      >
        <Input.TextArea 
          placeholder="Write your blog content here..." 
          rows={6}
        />
      </Form.Item>

      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: 'Please input the category!' }]}
      >
        <Input placeholder="Enter blog category" />
      </Form.Item>

      <Form.Item
        name="blogImages"
        label="Image"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: 'Please upload an image!' }]}
      >
        <Upload
          listType="picture-card"
          maxCount={1}
          beforeUpload={() => false}
          accept="image/*"
        >
          {form.getFieldValue('blogImages')?.length ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={() => {
            form.resetFields();
            onCancel();
          }}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={uploading}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
          >
            Create Blog
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CreateBlogForm; 