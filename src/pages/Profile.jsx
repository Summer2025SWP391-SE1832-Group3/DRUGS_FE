import React, { useState } from 'react';
import { Descriptions, Button, Input, message, Space, Card, DatePicker, Select, Form } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState({
    fullName: 'Nguyễn Anh Vũ',
    username: 'anhvu',
    email: 'example@email.com',
    phone: '0123456789',
    dateOfBirth: '01/01/2000',
    gender: 'Male',
    age: '20',
    address: '123 Lê Lợi, TP.HCM',
  });

  const [tempUserInfo, setTempUserInfo] = useState({...userInfo});

  const handleEdit = () => {
    setIsEditing(true);
    setTempUserInfo({...userInfo});
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      setUserInfo({...tempUserInfo});
      setIsEditing(false);
      message.success('Profile updated successfully!');
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    setTempUserInfo({...userInfo});
    setIsEditing(false);
    form.resetFields();
  };

  const handleInputChange = (field, value) => {
    setTempUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const items = [
    {
      key: '1',
      label: 'Full Name',
      children: isEditing ? (
        <Form.Item
          name="fullName"
          rules={[
            { required: true, message: 'Please enter your full name!' },
            { min: 2, message: 'Name must be at least 2 characters!' }
          ]}
          initialValue={tempUserInfo.fullName}
        >
          <Input 
            placeholder="Enter your full name"
            onChange={(e) => handleInputChange('fullName', e.target.value)}
          />
        </Form.Item>
      ) : userInfo.fullName,
    },
    {
      key: '2',
      label: 'Username',
      children: isEditing ? (
        <Form.Item
          name="username"
          rules={[
            { required: true, message: 'Please enter username!' },
            { min: 4, message: 'Username must be at least 4 characters!' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers and underscore!' }
          ]}
          initialValue={tempUserInfo.username}
        >
          <Input 
            placeholder="Enter username"
            onChange={(e) => handleInputChange('username', e.target.value)}
          />
        </Form.Item>
      ) : userInfo.username,
    },
    {
      key: '3',
      label: 'Email',
      children: isEditing ? (
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please enter your email!' },
            { type: 'email', message: 'Please enter a valid email address!' }
          ]}
          initialValue={tempUserInfo.email}
        >
          <Input 
            placeholder="Enter your email"
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </Form.Item>
      ) : userInfo.email,
    },
    {
      key: '4',
      label: 'Phone Number',
      children: isEditing ? (
        <Form.Item
          name="phone"
          rules={[
            { required: true, message: 'Please enter your phone number!' },
            { pattern: /^[0-9]{10}$/, message: 'Phone number must be 10 digits!' }
          ]}
          initialValue={tempUserInfo.phone}
        >
          <Input 
            placeholder="Enter your phone number"
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </Form.Item>
      ) : userInfo.phone,
    },
    {
      key: '5',
      label: 'Date of Birth',
      children: isEditing ? (
        <Form.Item
          name="dateOfBirth"
          rules={[
            { required: true, message: 'Please select your date of birth!' }
          ]}
          initialValue={tempUserInfo.dateOfBirth ? dayjs(tempUserInfo.dateOfBirth, 'DD/MM/YYYY') : null}
        >
          <DatePicker 
            style={{ width: '100%' }}
            size="large"
            format="DD/MM/YYYY"
            onChange={(date) => handleInputChange('dateOfBirth', date ? date.format('DD/MM/YYYY') : '')}
            disabledDate={(current) => {
              return current && current > dayjs().endOf('day');
            }}
          />
        </Form.Item>
      ) : userInfo.dateOfBirth,
    },
    {
      key: '6',
      label: 'Gender',
      children: isEditing ? (
        <Form.Item
          name="gender"
          rules={[
            { required: true, message: 'Please select your gender!' }
          ]}
          initialValue={tempUserInfo.gender}
        >
          <Select
            size="large"
            onChange={(value) => handleInputChange('gender', value)}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' }
            ]}
          />
        </Form.Item>
      ) : userInfo.gender,
    },
    {
      key: '7',
      label: 'Age',
      children: isEditing ? (
        <Form.Item
          name="age"
          rules={[
            { required: true, message: 'Please enter your age!' },
            {
              validator: (_, value) => {
                if (value && (isNaN(value) || value < 6)) {
                  return Promise.reject('Age must be at least 6 years old!');
                }
                return Promise.resolve();
              }
            }
          ]}
          initialValue={tempUserInfo.age}
        >
          <Input 
            type="number"
            placeholder="Enter your age"
            onChange={(e) => handleInputChange('age', e.target.value)}
          />
        </Form.Item>
      ) : userInfo.age,
    },
    {
      key: '8',
      label: 'Address',
      span: 3,
      children: isEditing ? (
        <Form.Item
          name="address"
          rules={[
            { required: true, message: 'Please enter your address!' },
            { min: 5, message: 'Address must be at least 5 characters!' }
          ]}
          initialValue={tempUserInfo.address}
        >
          <Input 
            placeholder="Enter your address"
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </Form.Item>
      ) : userInfo.address,
    },
  ];

  return (
    <div style={{ 
      padding: '24px',
      background: '#f5f6fa',
      minHeight: '90vh'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: 2500,
          minHeight: 500,
          paddingTop: 48,
          paddingBottom: 48,
          margin: '0 auto',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          borderRadius: 16,
          border: 'none',
          background: 'rgba(255,255,255,0.95)'
        }}
      >
        <Form form={form} layout="vertical">
          <Descriptions 
            bordered 
            title={<span style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', display: 'block' }}>User Profile</span>} 
            items={items}
            style={{ marginBottom: 24 }}
            labelStyle={{ padding: '30px 24px', fontWeight: 500, fontSize: 15 }}
            contentStyle={{ padding: '30px 24px' }}
          />
          
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {isEditing ? (
              <>
                <Button 
                  type="primary" 
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  style={{
                    background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
                    border: 'none'
                  }}
                >
                  Save
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
              </>
            ) : (
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={handleEdit}
                style={{
                  background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
                  border: 'none'
                }}
              >
                Edit
              </Button>
            )}
          </Space>
        </Form>
      </Card>
    </div>
  );
}