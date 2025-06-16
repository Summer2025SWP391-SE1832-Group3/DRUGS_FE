import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Tag, Space, Spin, Empty, message } from 'antd';
import { CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { BlogAPI } from '../../apis/blog';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const StyledContainer = styled.div`
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
`;

export default function BlogByUserId() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();
  
  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        setLoading(true);
        const response = await BlogAPI.getByUserId(userId);
        setBlogs(response);
      } catch (error) {
        console.error('Error fetching user blogs:', error);
        message.error('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [userId]);

  if (loading) {
    return (
      <StyledContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Title level={2} style={{ marginBottom: 24 }}>User's Blog Posts</Title>

      {blogs.length === 0 ? (
        <Empty description="No blog posts found" />
      ) : (
        <List
          dataSource={blogs}
          renderItem={(blog) => (
            <StyledCard
              title={blog.title}
              extra={
                <Space>
                  <Tag color={blog.status === 'Approved' ? 'green' : 'orange'}>
                    {blog.status}
                  </Tag>
                  <EyeOutlined 
                    onClick={() => navigate(`/blogDetails/${blog.blogId}`)} 
                    style={{ cursor: 'pointer', fontSize: '16px' }} 
                  />
                </Space>
              }
            >
              <Paragraph ellipsis={{ rows: 2 }}>{blog.content}</Paragraph>
              <Space style={{ marginTop: 16 }}>
                <CalendarOutlined />
                <span>{new Date(blog.postedAt).toLocaleDateString()}</span>
              </Space>
            </StyledCard>
          )}
        />
      )}
    </StyledContainer>
  );
}

