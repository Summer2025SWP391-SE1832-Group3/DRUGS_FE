import React, { useEffect } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useOutletContext();

  
  const fakeAccount = {
    userName: 'anhvu',
    password: '1'
  }
  const onFinish = (values) => {
    if (values.username === fakeAccount.userName && values.password === fakeAccount.password) {
      message.success('Login successfully!');
      setIsLoggedIn(true);
      navigate('/profile');
    } else {
      message.error('Login failed! Please enter again your information.');
    }
  }
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{
      minHeight: '90vh',
      background: '#f5f6fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Card         
        style={{
          minWidth: 370,
          maxWidth: 400,
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
    </div>
  )
}