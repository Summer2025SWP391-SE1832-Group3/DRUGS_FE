import React, { useState } from 'react';
import { Descriptions, Button, Input, message, Space, Card, DatePicker, Select, Form, Row, Col, Avatar } from 'antd';
import { EditOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
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
    description: 'Sinh viên trường Đại học Dược Hà Nội.'
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

  const fakeInputStyle = {
    border: '1px solid #d9d9d9',
    borderRadius: 6,
    padding: '4px 11px',
    minHeight: 32,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
  };

  return (
    <div style={{ 
      padding: '24px',
      background: '#f5f6fa',
      minHeight: '90vh'
    }}>
      <Row gutter={32} justify="center" align="stretch" style={{ minHeight: '75vh', display: 'flex' }}>
        <Col xs={24} md={8} style={{ display: 'flex', flexDirection: 'column' }}>
          <Card
            style={{
              width: '100%',
              minHeight: '100%',
              height: '100%',
              marginBottom: 24,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
              borderRadius: 16,
              border: 'none',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 16px',
              flex: 1
            }}
          >
            <Avatar size={96} icon={<UserOutlined />} src={null} style={{ marginBottom: 16 }} />
            <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 4 }}>{userInfo.fullName}</div>
            <div style={{ color: '#888', fontSize: 16, marginBottom: 16 }}>User</div>
            <div style={{ color: '#444', fontSize: 15, textAlign: 'center' }}>{userInfo.description}</div>
          </Card>
        </Col>
        <Col xs={24} md={16} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Card
              style={{
                width: '100%',
                maxWidth: 800,
                minHeight: '100%',
                height: '100%',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
                borderRadius: 16,
                border: 'none',
                background: 'rgba(255,255,255,0.95)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '32px 32px',
              }}
            >
              <Form
                form={form}
                layout="horizontal"
                style={{ paddingBlock: 32 }}
              >
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, textAlign: 'left' }}>Account Details</div>
                <Row gutter={32}>
                  <Col xs={24} md={12}>
                    <Form.Item name="fullName" label="Full Name" labelCol={{span:10}} wrapperCol={{span:14}}
                      rules={[
                        { required: true, message: 'Please enter your full name!' },
                        { min: 2, message: 'Name must be at least 2 characters!' }
                      ]} initialValue={tempUserInfo.fullName}>
                      {isEditing ? (
                        <Input placeholder="Enter your full name" onChange={e => handleInputChange('fullName', e.target.value)} />
                      ) : (
                        <div style={fakeInputStyle}>{userInfo.fullName}</div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="username" label="Username" labelCol={{span:10}} wrapperCol={{span:14}}
                      rules={[
                        { required: true, message: 'Please enter username!' },
                        { min: 4, message: 'Username must be at least 4 characters!' },
                        { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers and underscore!' }
                      ]} initialValue={tempUserInfo.username}>
                      {isEditing ? (
                        <Input placeholder="Enter username" onChange={e => handleInputChange('username', e.target.value)} />
                      ) : (
                        <div style={fakeInputStyle}>{userInfo.username}</div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={32}>
                  <Col xs={24} md={12}>
                    <Form.Item name="email" label="Email" labelCol={{span:10}} wrapperCol={{span:14}}
                      rules={[
                        { required: true, message: 'Please enter your email!' },
                        { type: 'email', message: 'Please enter a valid email address!' }
                      ]} initialValue={tempUserInfo.email}>
                      {isEditing ? (
                        <Input placeholder="Enter your email" onChange={e => handleInputChange('email', e.target.value)} />
                      ) : (
                        <div style={fakeInputStyle}>{userInfo.email}</div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="phone" label="Phone Number" labelCol={{span:10}} wrapperCol={{span:14}}
                      rules={[
                        { required: true, message: 'Please enter your phone number!' },
                        { pattern: /^[0-9]{10}$/, message: 'Phone number must be 10 digits!' }
                      ]} initialValue={tempUserInfo.phone}>
                      {isEditing ? (
                        <Input placeholder="Enter your phone number" onChange={e => handleInputChange('phone', e.target.value)} />
                      ) : (
                        <div style={fakeInputStyle}>{userInfo.phone}</div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={32}>
                  <Col xs={24} md={12}>
                    <Form.Item name="dateOfBirth" label="Date of Birth" labelCol={{span:10}} wrapperCol={{span:14}}
                      rules={[
                        { required: true, message: 'Please select your date of birth!' }
                      ]} initialValue={tempUserInfo.dateOfBirth ? dayjs(tempUserInfo.dateOfBirth, 'DD/MM/YYYY') : null}>
                      {isEditing ? (
                        <DatePicker 
                          style={{ width: '100%' }}
                          size="large"
                          format="DD/MM/YYYY"
                          onChange={date => handleInputChange('dateOfBirth', date ? date.format('DD/MM/YYYY') : '')}
                          disabledDate={current => current && current > dayjs().endOf('day')}
                        />
                      ) : (
                        <div style={fakeInputStyle}>{userInfo.dateOfBirth}</div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="gender" label="Gender" labelCol={{span:10}} wrapperCol={{span:14}}
                      rules={[
                        { required: true, message: 'Please select your gender!' }
                      ]} initialValue={tempUserInfo.gender}>
                      {isEditing ? (
                        <Select
                          size="large"
                          onChange={value => handleInputChange('gender', value)}
                          options={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                            { value: 'other', label: 'Other' }
                          ]}
                        />
                      ) : (
                        <div style={fakeInputStyle}>{userInfo.gender}</div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={32}>
                  <Col xs={24} md={12}>
                    <Form.Item name="age" label="Age" labelCol={{span:10}} wrapperCol={{span:14}}
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
                      ]} initialValue={tempUserInfo.age}>
                      {isEditing ? (
                        <Input type="number" placeholder="Enter your age" onChange={e => handleInputChange('age', e.target.value)} />
                      ) : (
                        <div style={fakeInputStyle}>{userInfo.age}</div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="address" label="Address" labelCol={{span:10}} wrapperCol={{span:14}}
                      rules={[
                        { required: true, message: 'Please enter your address!' },
                        { min: 5, message: 'Address must be at least 5 characters!' }
                      ]} initialValue={tempUserInfo.address}>
                      {isEditing ? (
                        <Input placeholder="Enter your address" onChange={e => handleInputChange('address', e.target.value)} />
                      ) : (
                        <div style={fakeInputStyle}>{userInfo.address}</div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={32}>
                  <Col xs={24} md={24}>
                    <Form.Item name="description" label="Description" labelCol={{span:3}} wrapperCol={{span:21}} initialValue={tempUserInfo.description}>
                      {isEditing ? (
                        <Input.TextArea rows={4} placeholder="Enter description" onChange={e => handleInputChange('description', e.target.value)} />
                      ) : (
                        <div style={{...fakeInputStyle, minHeight: 80}}>{userInfo.description}</div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item wrapperCol={{ offset: 10 }}>
                  {isEditing ? (
                    <>
                      <Button 
                        type="primary" 
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        style={{
                          background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
                          border: 'none',
                          marginRight: 8
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
                </Form.Item>
              </Form>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}