import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Tag, Space, Spin, Empty } from 'antd';
import { UserOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { BlogAPI } from '../../apis/blog';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const apiBase = "https://localhost:7045";  // Base URL without /api for static files

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
  background: #ffffff;
  min-height: 100vh;
`;

const StyledHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  animation: ${fadeInUp} 0.8s ease-out;
`;

const StyledCard = styled(Card)`
  transition: all 0.4s ease-in-out;
  border-radius: 20px;
  overflow: hidden;
  border: none;
  background: #ffffff;
  box-shadow: 0 8px 25px rgba(0,0,0,0.06);
  opacity: 0;
  animation: ${fadeInUp} 0.6s ease-out forwards;
  
  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.12);
  }

  .ant-card-cover img {
    transition: all 0.4s ease;
    height: 240px;
    object-fit: cover;
  }

  &:hover .ant-card-cover img {
    transform: scale(1.08);
  }
  
  .ant-card-body {
    padding: 28px;
  }
  
  .ant-card-actions {
    background: #ffffff;
    border-top: 1px solid #f0f0f0;
  }
  
  .ant-card-actions > li {
    margin: 12px 0;
  }
`;

const StyledTag = styled(Tag)`
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
`;

const StyledMeta = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e8f2ff;
`;

// Default image for blogs without images
const DEFAULT_BLOG_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000';

export default function BlogList() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [visibleBlogs, setVisibleBlogs] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await BlogAPI.getApprovedBlogs();
        if (response && Array.isArray(response)) {
          setBlogs(response);
        } else if (response && response.data && Array.isArray(response.data)) {
          setBlogs(response.data);
        } else {
          console.error('Unexpected API response format:', response);
          setBlogs([]);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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

  const handleReadMore = (id) => {
    navigate(`/blogDetails/${id}`);
  };

  if (loading) {
    return (
      <StyledContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" style={{ color: '#667eea' }} />
        </div>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <Title level={2} style={{ 
          margin: 0, 
          color: '#1a1a1a',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          Weekly Blog Posts
        </Title>
        <Paragraph style={{ 
          marginTop: '12px', 
          color: '#6c757d',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          Discover insights and updates from our community
        </Paragraph>
      </StyledHeader>

      {blogs.length === 0 ? (
        <Empty 
          description="No blog posts available" 
          style={{ 
            background: '#ffffff', 
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.06)'
          }}
        />
      ) : (
        <List
          grid={{
            gutter: 24,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 3,
          }}
          dataSource={visibleBlogs}
          renderItem={(blog, index) => (
            <List.Item>
              <StyledCard
                hoverable
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: '0.6s'
                }}
                cover={
                  <img
                    alt={blog.title}
                    src={blog.blogImages && blog.blogImages.length > 0 
                      ? `${apiBase}${blog.blogImages[0]}` 
                      : DEFAULT_BLOG_IMAGE}
                    style={{ height: 240, objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Space 
                    onClick={() => handleReadMore(blog.blogId)}
                    style={{ 
                      cursor: 'pointer', 
                      background: '#1a1a1a',
                      color: 'white',
                      fontWeight: '600',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <EyeOutlined />
                    Read More
                  </Space>
                ]}
              >
                <Card.Meta
                  title={
                    <Title level={4} style={{ 
                      margin: 0, 
                      fontSize: '20px', 
                      lineHeight: '1.4',
                      color: '#1a1a1a',
                      fontWeight: 'bold'
                    }}>
                      {blog.title}
                    </Title>
                  }
                  description={
                    <>
                      <Paragraph ellipsis={{ rows: 3 }} style={{ 
                        marginTop: '20px', 
                        marginBottom: '20px', 
                        fontSize: '15px', 
                        lineHeight: '1.7',
                        color: '#5a6c7d'
                      }}>
                        {blog.content}
                      </Paragraph>
                      <StyledMeta>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Space>
                            <UserOutlined style={{ color: '#1a1a1a', fontSize: '16px' }} />
                            <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '500' }}>{blog.postedBy}</span>
                          </Space>
                          <Space>
                            <CalendarOutlined style={{ color: '#1a1a1a', fontSize: '16px' }} />
                            <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '500' }}>{new Date(blog.postedAt).toLocaleDateString()}</span>
                          </Space>
                        </Space>
                      </StyledMeta>
                    </>
                  }
                />
              </StyledCard>
            </List.Item>
          )}
        />
      )}
    </StyledContainer>
  );
}