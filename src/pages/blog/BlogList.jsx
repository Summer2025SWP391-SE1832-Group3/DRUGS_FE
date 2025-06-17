import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Tag, Space, Spin, Empty } from 'antd';
import { UserOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import { BlogAPI } from '../../apis/blog';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

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
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const StyledCard = styled(Card)`
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .ant-card-cover img {
    transition: all 0.3s ease;
  }

  &:hover .ant-card-cover img {
    transform: scale(1.05);
  }
`;

const StyledTag = styled(Tag)`
  margin-top: 8px;
  padding: 4px 8px;
  border-radius: 4px;
`;

const StyledMeta = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`;

// Default image for blogs without images
const DEFAULT_BLOG_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000';

export default function BlogList() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await BlogAPI.getAll();
        console.log('API Response:', response); // Debug log
        if (response && Array.isArray(response)) {
          console.log('First blog object:', response[0]); // Debug log
          setBlogs(response);
        } else if (response && response.data && Array.isArray(response.data)) {
          console.log('First blog object from response.data:', response.data[0]); // Debug log
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

  const handleReadMore = (id) => {
    console.log('BlogList - Navigating to blog details with id:', id);
    console.log('BlogList - typeof id:', typeof id);
    console.log('BlogList - blog object:', blogs.find(blog => blog.blogId === id));
    navigate(`/blogDetails/${id}`);
  };

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
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>Weekly Blog Posts</Title>
        <Paragraph style={{ marginTop: '8px', color: '#666' }}>
          Discover insights and updates from our community
        </Paragraph>
      </StyledHeader>

      {blogs.length === 0 ? (
        <Empty description="No blog posts available" />
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
          dataSource={blogs}
          renderItem={(blog) => (
            <List.Item>
              <StyledCard
                hoverable
                cover={
                  <img
                    alt={blog.title}
                    src={blog.blogImages && blog.blogImages.length > 0 ? blog.blogImages[0] : DEFAULT_BLOG_IMAGE}
                    style={{ height: 240, objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Space 
                    onClick={() => handleReadMore(blog.blogId)}
                    style={{ cursor: 'pointer' }}
                  >
                    <EyeOutlined />
                    Read More
                  </Space>
                ]}
              >
                <Card.Meta
                  title={
                    <Title level={4} style={{ margin: 0 }}>
                      {blog.title}
                    </Title>
                  }
                  description={
                    <>
                      <Paragraph ellipsis={{ rows: 2 }} style={{ marginTop: '16px' }}>
                        {blog.content}
                      </Paragraph>
                      <StyledMeta>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Space>
                            <UserOutlined style={{ color: '#1890ff' }} />
                            <span>{blog.postedBy}</span>
                          </Space>
                          <Space>
                            <CalendarOutlined style={{ color: '#1890ff' }} />
                            <span>{new Date(blog.postedAt).toLocaleDateString()}</span>
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