import React from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const {setIsLoggedIn} = useOutletContext();
  const fakeAccount = {
    userName: 'anhvu',
    password: '1'
  }
  const onFinish = (values) => {
    if (values.username === fakeAccount.userName && values.password === fakeAccount.password) {
      message.success('Đăng nhập thành công!');
      setIsLoggedIn(true);
      navigate('/courseList');
    } else {
      message.error('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập của bạn.');
    }
  }
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ minHeight: '80vh', background: '#f5f6fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card title="Login" style={{ minWidth: 350, maxWidth: 400, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Form layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item label="User Name" name="username" rules={[{ required: true, message: 'Please enter the username!' }]}>
            <Input placeholder="Enter username" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter the password!' }]}>
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}