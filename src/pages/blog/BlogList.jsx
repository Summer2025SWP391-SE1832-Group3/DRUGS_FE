import React from 'react';
import { Card, List, Typography, Tag, Space } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';
import blogs from '../../data/blog';

const { Title, Paragraph } = Typography;

export default function BlogList() {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>Blog Posts</Title>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
          xxl: 3,
        }}
        dataSource={blogs}
        renderItem={(blog) => (
          <List.Item>
            <Card
              hoverable
              style={{ height: '100%', width: '100%' }}
              cover={
                <img
                  alt={blog.title}
                  src={blog.blogImage}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
              title={blog.title}
            >
              <Paragraph ellipsis={{ rows: 3 }}>
                {blog.content}
              </Paragraph>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <UserOutlined />
                  <span>{blog.postedBy}</span>
                </Space>
                <Space>
                  <CalendarOutlined />
                  <span>{new Date(blog.postedAt).toLocaleDateString()}</span>
                </Space>
                <Tag color="blue">{blog.category}</Tag>
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}