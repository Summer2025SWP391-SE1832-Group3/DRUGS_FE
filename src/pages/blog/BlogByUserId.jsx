import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Tag, Space, Spin, Empty, message } from 'antd';
import { CalendarOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { BlogAPI } from '../../apis/blog';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Paragraph } = Typography;

// Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledContainer = styled.div`
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const StyledHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  animation: ${fadeInUp} 0.8s ease-out;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.4s ease-in-out;
  opacity: 0;
  animation: ${fadeInUp} 0.6s ease-out forwards;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 0 24px;
  }
  
  .ant-card-head-title {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    line-height: 1.4;
  }
  
  .ant-card-body {
    padding: 24px;
  }
  
  .ant-card-extra {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const StyledTag = styled(Tag)`
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 500;
  border: none;
  
  &.ant-tag-green {
    background: #f6ffed;
    color: #52c41a;
  }
  
  &.ant-tag-orange {
    background: #fff7e6;
    color: #fa8c16;
  }
`;

const StyledMeta = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 13px;
`;

const ViewButton = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 13px;
  
  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export default function BlogByUserId() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [visibleBlogs, setVisibleBlogs] = useState([]);
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

  // Animate blogs appearing one by one
  useEffect(() => {
    if (blogs.length > 0 && !loading) {
      const timer = setTimeout(() => {
        const animateBlogs = () => {
          setVisibleBlogs(prev => {
            if (prev.length < blogs.length) {
              return blogs.slice(0, prev.length + 1);
            }
            return prev;
          });
        };

        // Show blogs one by one with 200ms delay
        const interval = setInterval(() => {
          animateBlogs();
          if (visibleBlogs.length >= blogs.length) {
            clearInterval(interval);
          }
        }, 200);

        return () => clearInterval(interval);
      }, 500); // Start animation after header appears

      return () => clearTimeout(timer);
    }
  }, [blogs, loading]);

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
      <StyledHeader>
        <Title level={2} style={{ margin: 0, color: '#2c3e50' }}>
          <UserOutlined style={{ marginRight: '12px', color: '#667eea' }} />
          My Blog Posts
        </Title>
        <Paragraph style={{ marginTop: '8px', color: '#666', marginBottom: 0 }}>
          Manage and view your published articles
        </Paragraph>
      </StyledHeader>

      {blogs.length === 0 ? (
        <Empty 
          description="No blog posts found" 
          style={{ 
            background: 'white', 
            padding: '40px', 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        />
      ) : (
        <List
          dataSource={visibleBlogs}
          renderItem={(blog, index) => (
            <StyledCard
              key={blog.blogId}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '0.6s'
              }}
              title={blog.title}
              extra={
                <Space>
                  <StyledTag color={blog.status === 'Approved' ? 'green' : 'orange'}>
                    {blog.status}
                  </StyledTag>
                  <ViewButton onClick={() => navigate(`/blogDetails/${blog.blogId}`)}>
                    <EyeOutlined />
                    View
                  </ViewButton>
                </Space>
              }
            >
              <Paragraph 
                ellipsis={{ rows: 3 }} 
                style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  marginBottom: '16px'
                }}
              >
                {blog.content}
              </Paragraph>
              <StyledMeta>
                <CalendarOutlined />
                <span>Published on {new Date(blog.postedAt).toLocaleDateString()}</span>
              </StyledMeta>
            </StyledCard>
          )}
        />
      )}
    </StyledContainer>
  );
}

