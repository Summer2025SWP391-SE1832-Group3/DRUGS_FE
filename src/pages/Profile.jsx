import React, { useState, useEffect } from 'react';
import { Button, Input, message, Space, Card, DatePicker, Select, Form, Row, Col, Avatar, Modal } from 'antd';
import { EditOutlined, SaveOutlined, UserOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined, KeyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { AccountAPI } from '../apis/account';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [userInfo, setUserInfo] = useState({});
  const [tempUserInfo, setTempUserInfo] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.userId || user?.id;
    const token = localStorage.getItem('accessToken');
    if (userId && token) {
      AccountAPI.getAccountById(userId, token).then(data => {
        if (data) {
          setUserInfo({
            fullName: data.fullName || '',
            username: data.userName || '',
            email: data.email || '',
            phone: data.phoneNumber || '',
            dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth).format('DD/MM/YYYY') : '',
            gender: data.gender || ''
          });
          setTempUserInfo({
            fullName: data.fullName || '',
            username: data.userName || '',
            email: data.email || '',
            phone: data.phoneNumber || '',
            dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth).format('DD/MM/YYYY') : '',
            gender: data.gender || ''
          });
        }
      });
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempUserInfo({...userInfo});
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('accessToken');
      // Chuẩn bị dữ liệu gửi lên API
      const updateData = {
        userName: tempUserInfo.username,
        fullName: tempUserInfo.fullName,
        phoneNumber: tempUserInfo.phone,
        dateOfBirth: tempUserInfo.dateOfBirth ? dayjs(tempUserInfo.dateOfBirth, 'DD/MM/YYYY').toISOString() : null,
        gender: tempUserInfo.gender,
        email: tempUserInfo.email
      };
      await AccountAPI.updateProfile(updateData, token);
      message.success('Profile updated successfully!');
      setIsEditing(false);
      // Reload lại thông tin mới nhất từ API
      const userId = user?.userId || user?.id;
      if (userId && token) {
        AccountAPI.getAccountById(userId, token).then(data => {
          if (data) {
            setUserInfo({
              fullName: data.fullName || '',
              username: data.userName || '',
              email: data.email || '',
              phone: data.phoneNumber || '',
              dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth).format('DD/MM/YYYY') : '',
              gender: data.gender || ''
            });
            setTempUserInfo({
              fullName: data.fullName || '',
              username: data.userName || '',
              email: data.email || '',
              phone: data.phoneNumber || '',
              dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth).format('DD/MM/YYYY') : '',
              gender: data.gender || ''
            });
          }
        });
      }
    } catch (error) {
      message.error('Failed to update profile!');
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

  const handlePasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields();
      message.success('Password changed successfully!');
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      console.log('Password validation failed:', error);
    }
  };

  const fakeInputStyle = {
    border: '1px solid #e1e5e9',
    borderRadius: 12,
    padding: '12px 16px',
    minHeight: 44,
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
    color: '#374151',
    transition: 'all 0.2s ease',
  };

  const gradientBg = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    padding: '40px 24px',
  };

  return (
    <div style={gradientBg}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Row gutter={[32, 32]} justify="center" style={{ marginTop: 40 }}>
          {/* Profile Card */}
          <Col xs={24} lg={8}>
            <Card
              style={{
                borderRadius: 20,
                border: 'none',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                padding: '40px 24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div style={{ marginBottom: 24 }}>
                <Avatar 
                  size={120} 
                  icon={<UserOutlined />} 
                  style={{ 
                    marginBottom: 16,
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
                  }} 
                />
              </div>
              <div style={{ 
                fontSize: 24, 
                fontWeight: 700, 
                marginBottom: 4,
                color: '#1f2937'
              }}>
                {userInfo.fullName}
              </div>
            </Card>
          </Col>

          {/* Details Card */}
          <Col xs={24} lg={16}>
            <Card
              style={{
                borderRadius: 20,
                border: 'none',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                padding: '40px'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 32
              }}>
                <h2 style={{ 
                  fontSize: 28, 
                  fontWeight: 700, 
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Account Information
                </h2>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Button
                    type="primary"
                    icon={<KeyOutlined />}
                    onClick={() => setIsPasswordModalVisible(true)}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      borderRadius: 12,
                      height: 44,
                      fontSize: 16,
                      fontWeight: 600,
                      paddingLeft: 24,
                      paddingRight: 24,
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    Change Password
                  </Button>
                  {!isEditing && (
                    <Button 
                      type="primary" 
                      icon={<EditOutlined />}
                      onClick={handleEdit}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: 12,
                        height: 44,
                        fontSize: 16,
                        fontWeight: 600,
                        paddingLeft: 24,
                        paddingRight: 24,
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              <Form
                form={form}
                layout="vertical"
                style={{ width: '100%' }}
              >
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item 
                      name="fullName" 
                      label={<span style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>Full Name</span>}
                      rules={[
                        { required: true, message: 'Please enter your full name!' },
                        { min: 2, message: 'Name must be at least 2 characters!' }
                      ]} 
                      initialValue={tempUserInfo.fullName}
                    >
                      {isEditing ? (
                        <Input 
                          placeholder="Enter your full name" 
                          onChange={e => handleInputChange('fullName', e.target.value)}
                          style={{
                            borderRadius: 12,
                            height: 44,
                            fontSize: 15,
                            border: '2px solid #e1e5e9',
                            transition: 'all 0.2s ease'
                          }}
                        />
                      ) : (
                        <div style={fakeInputStyle}>{userInfo.fullName}</div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item 
                      name="username" 
                      label={<span style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>Username</span>}
                      rules={[
                        { required: true, message: 'Please enter username!' },
                        { min: 4, message: 'Username must be at least 4 characters!' },
                        { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers and underscore!' }
                      ]} 
                      initialValue={tempUserInfo.username}
                    >
                      {isEditing ? (
                        <Input 
                          placeholder="Enter username" 
                          onChange={e => handleInputChange('username', e.target.value)}
                          style={{
                            borderRadius: 12,
                            height: 44,
                            fontSize: 15,
                            border: '2px solid #e1e5e9',
                            transition: 'all 0.2s ease'
                          }}
                        />
                      ) : (
                        <div style={fakeInputStyle}>{userInfo.username}</div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item 
                      name="email" 
                      label={<span style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>Email Address</span>}
                      rules={[
                        { required: true, message: 'Please enter your email!' },
                        { type: 'email', message: 'Please enter a valid email address!' }
                      ]} 
                      initialValue={tempUserInfo.email}
                    >
                      {isEditing ? (
                        <Input 
                          placeholder="Enter your email" 
                          onChange={e => handleInputChange('email', e.target.value)}
                          style={{
                            borderRadius: 12,
                            height: 44,
                            fontSize: 15,
                            border: '2px solid #e1e5e9',
                            transition: 'all 0.2s ease'
                          }}
                        />
                      ) : (
                        <div style={fakeInputStyle}>{userInfo.email}</div>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item 
                      name="phone" 
                      label={<span style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>Phone Number</span>}
                      rules={[
                        { required: true, message: 'Please enter your phone number!' },
                        { pattern: /^[0-9]{10}$/, message: 'Phone number must be 10 digits!' }
                      ]} 
                      initialValue={tempUserInfo.phone}
                    >
                      {isEditing ? (
                        <Input 
                          placeholder="Enter your phone number" 
                          onChange={e => handleInputChange('phone', e.target.value)}
                          style={{
                            borderRadius: 12,
                            height: 44,
                            fontSize: 15,
                            border: '2px solid #e1e5e9',
                            transition: 'all 0.2s ease'
                          }}
                        />
                      ) : (
                        <div style={fakeInputStyle}>{userInfo.phone}</div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item 
                      name="dateOfBirth" 
                      label={<span style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>Date of Birth</span>}
                      rules={[
                        { required: true, message: 'Please select your date of birth!' }
                      ]} 
                      initialValue={tempUserInfo.dateOfBirth ? dayjs(tempUserInfo.dateOfBirth, 'DD/MM/YYYY') : null}
                    >
                      {isEditing ? (
                        <DatePicker 
                          style={{ 
                            width: '100%',
                            borderRadius: 12,
                            height: 44,
                            fontSize: 15,
                            border: '2px solid #e1e5e9'
                          }}
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
                    <Form.Item 
                      name="gender" 
                      label={<span style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>Gender</span>}
                      rules={[
                        { required: true, message: 'Please select your gender!' }
                      ]} 
                      initialValue={tempUserInfo.gender}
                    >
                      {isEditing ? (
                        <Select
                          style={{ 
                            height: 44,
                            fontSize: 15
                          }}
                          onChange={value => handleInputChange('gender', value)}
                          options={[
                            { value: 'Male', label: 'Male' },
                            { value: 'Female', label: 'Female' },
                            { value: 'Other', label: 'Other' }
                          ]}
                        />
                      ) : (
                        <div style={fakeInputStyle}>{userInfo.gender}</div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                {isEditing && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: 16, 
                    marginTop: 32,
                    paddingTop: 24,
                    borderTop: '2px solid #f3f4f6'
                  }}>
                    <Button 
                      onClick={handleCancel}
                      style={{
                        borderRadius: 12,
                        height: 44,
                        fontSize: 16,
                        fontWeight: 600,
                        paddingLeft: 24,
                        paddingRight: 24,
                        border: '2px solid #e5e7eb',
                        background: 'white'
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<SaveOutlined />}
                      onClick={handleSave}
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        borderRadius: 12,
                        height: 44,
                        fontSize: 16,
                        fontWeight: 600,
                        paddingLeft: 24,
                        paddingRight: 24,
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
      {/* Password Change Modal */}
      <Modal
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            fontSize: 20,
            fontWeight: 700
          }}>
            <LockOutlined style={{ color: '#ef4444' }} />
            Change Password
          </div>
        }
        open={isPasswordModalVisible}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        width={500}
        style={{ top: 100 }}
        bodyStyle={{ padding: '32px' }}
      >
        <Form
          form={passwordForm}
          layout="vertical"
        >
          <Form.Item
            name="currentPassword"
            label={<span style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>Current Password</span>}
            rules={[
              { required: true, message: 'Please enter your current password!' }
            ]}
          >
            <Input.Password
              placeholder="Enter current password"
              style={{
                borderRadius: 12,
                height: 44,
                fontSize: 15,
                border: '2px solid #e1e5e9'
              }}
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label={<span style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>New Password</span>}
            rules={[
              { required: true, message: 'Please enter your new password!' },
              { min: 8, message: 'Password must be at least 8 characters!' },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number!' }
            ]}
          >
            <Input.Password
              placeholder="Enter new password"
              style={{
                borderRadius: 12,
                height: 44,
                fontSize: 15,
                border: '2px solid #e1e5e9'
              }}
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label={<span style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>Confirm New Password</span>}
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm new password"
              style={{
                borderRadius: 12,
                height: 44,
                fontSize: 15,
                border: '2px solid #e1e5e9'
              }}
              iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 16, 
            marginTop: 32,
            paddingTop: 24,
            borderTop: '2px solid #f3f4f6'
          }}>
            <Button 
              onClick={() => {
                setIsPasswordModalVisible(false);
                passwordForm.resetFields();
              }}
              style={{
                borderRadius: 12,
                height: 44,
                fontSize: 16,
                fontWeight: 600,
                paddingLeft: 24,
                paddingRight: 24,
                border: '2px solid #e5e7eb'
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={handlePasswordChange}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                borderRadius: 12,
                height: 44,
                fontSize: 16,
                fontWeight: 600,
                paddingLeft: 24,
                paddingRight: 24,
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
            >
              Update Password
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}