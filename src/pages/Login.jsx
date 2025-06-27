import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { useNavigate, useOutletContext } from 'react-router-dom';
import styled from 'styled-components';
import { AccountAPI } from '../apis/account';

const LoginContainer = styled.div`
  min-height: 90vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://img.freepik.com/free-vector/pharmacy-pattern-background_53876-140935.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.08;
  z-index: 0;
`;

const DecorativeCircle = styled.div`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(30, 60, 114, 0.08), rgba(42, 82, 152, 0.08));
  z-index: 0;
`;

const Circle1 = styled(DecorativeCircle)`
  width: 400px;
  height: 400px;
  top: -150px;
  left: -150px;
`;

const Circle2 = styled(DecorativeCircle)`
  width: 300px;
  height: 300px;
  bottom: -100px;
  right: -100px;
`;

export default function Login() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useOutletContext();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await AccountAPI.login({
        userName: values.username,
        password: values.password
      });
      
      console.log('Login response:', response);
      
      if (response && response.token) {
        // Decode JWT token to get user information
        const tokenParts = response.token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Decoded token payload:', payload);
          
          // Create user object with all necessary information
          const userData = {
            ...response,
            userId: payload.sub, // 'sub' claim in JWT contains the user ID
            role: payload.role
          };
          
          message.success('Login successfully!');
          setIsLoggedIn(true);
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('Stored user data:', userData);
          navigate('/profile');
        } else {
          throw new Error('Invalid token format');
        }
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Login failed! Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <LoginContainer>
      <BackgroundImage />
      <Circle1 />
      <Circle2 />
      <Card         
        style={{
          minWidth: 370,
          maxWidth: 400,
          color: '#888', 
          fontSize: 15, 
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          borderRadius: 16,
          border: 'none',
          background: 'rgba(255,255,255,0.95)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <div className='d-flex justify-content-center align-items-center' style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src="https://cdn.iconscout.com/icon/premium/png-256-thumb/drug-abuse-2755791-2288754.png?f=webp"
            alt="Logo"
            style={{ width: 25, height: 25, borderRadius: '50%', marginRight: 8 }}
          />
          <div style={{color:"#000", fontWeight: 500, fontSize: 20 }}>Sign in to your account</div>
        </div> 
        <Form layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed} >
          <Form.Item
            label={<span style={{ fontWeight: 500 }}>User Name</span>}
            name="username"
            rules={[{ required: true, message: 'Please enter the username!' }]}
          >
            <Input placeholder="Enter username" size="large"/>
          </Form.Item>
          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Password</span>}
            name="password"
            rules={[{ required: true, message: 'Please enter the password!' }]}
          >
            <Input.Password placeholder="Enter password" size="large"/>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{
                background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
                border: 'none',
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <span style={{ color: '#888' }}>Don't have an account?</span>
          <Button
            type="link"
            style={{ paddingLeft: 4, fontWeight: 500 }}
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
      </Card>
    </LoginContainer>
  )
}