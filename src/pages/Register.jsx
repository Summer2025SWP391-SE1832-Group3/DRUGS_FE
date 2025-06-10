import React from 'react';
import { Form, Input, Button, Card, message, Select, DatePicker, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { AccountAPI } from '../apis/account';

export default function Register() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = (values) => {
    AccountAPI.register(values)
    .then(value => {
      console.log("Register response",value)
      messageApi.success('Registration ok!');
      navigate('/login'); 
    })
    .catch(e=>{
      console.log(e)
      messageApi.error('Registration fail!');
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Registration failed:', errorInfo);
  };

  return (
    <div style={{
      minHeight: '90vh',
      background: '#f5f6fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      {contextHolder}
      <Card         
        style={{
          width: '100%',
          maxWidth: 1000,
          color: '#888', 
          fontSize: 15, 
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          borderRadius: 16,
          border: 'none',
          background: 'rgba(255,255,255,0.95)'
        }}
      >
        <div className='d-flex justify-content-center align-items-center' style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src="https://cdn.iconscout.com/icon/premium/png-256-thumb/drug-abuse-2755791-2288754.png?f=webp"
            alt="Logo"
            style={{ width: 25, height: 25, borderRadius: '50%', marginRight: 8 }}
          />
          <div style={{color:"#000", fontWeight: 500, fontSize: 20 }}>Create your account</div>
        </div> 
        <Form layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Full Name</span>}
                name="fullName"
                rules={[
                  { required: true, message: 'Please enter your full name!' },
                  { min: 2, message: 'Name must be at least 2 characters!' }
                ]}
              >
                <Input placeholder="Enter your full name" size="large"/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Email</span>}
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email!' },
                  { type: 'email', message: 'Please enter a valid email address!' }
                ]}
              >
                <Input placeholder="Enter your email" size="large"/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Phone Number</span>}
                name="phoneNumber"
                rules={[
                  { required: true, message: 'Please enter your phone number!' },
                  { pattern: /^[0-9]{10}$/, message: 'Phone number must be 10 digits!' }
                ]}
              >
                <Input placeholder="Enter your phone number" size="large"/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Date of Birth</span>}
                name="dateOfBirth"
                rules={[
                  { required: true, message: 'Please select your date of birth!' }
                ]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  size="large"
                  format="DD/MM/YYYY"
                  disabledDate={(current) => {
                    return current && current > dayjs().endOf('day');
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Gender</span>}
                name="gender"
                rules={[
                  { required: true, message: 'Please select your gender!' }
                ]}
              >
                <Select
                  size="large"
                  placeholder="Select your gender"
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' }
                  ]}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Age</span>}
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
              >
                <Input type="number" placeholder="Enter your age" size="large"/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Address</span>}
                name="address"
                rules={[
                  { required: true, message: 'Please enter your address!' },
                  { min: 5, message: 'Address must be at least 5 characters!' }
                ]}
              >
                <Input placeholder="Enter your address" size="large"/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Username</span>}
                name="username"
                rules={[
                  { required: true, message: 'Please enter username!' },
                  { min: 4, message: 'Username must be at least 4 characters!' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers and underscore!' }
                ]}
              >
                <Input placeholder="Enter username" size="large"/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Password</span>}
                name="password"
                rules={[
                  { required: true, message: 'Please enter password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' },
                  { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, 
                    message: 'Password must contain at least one letter and one number!' }
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Enter password" size="large"/>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Confirm Password</span>}
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm password" size="large"/>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
                border: 'none',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <span style={{ color: '#888' }}>Already have an account?</span>
          <Button
            type="link"
            style={{ paddingLeft: 4, fontWeight: 500 }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </div>
      </Card>
    </div>
  );
}