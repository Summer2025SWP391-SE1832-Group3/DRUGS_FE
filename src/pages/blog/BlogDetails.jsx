import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Space, Avatar, Tag, Spin, Button, Divider, List, Empty } from 'antd';
import { UserOutlined, CalendarOutlined, ArrowLeftOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { BlogAPI } from '../../apis/blog';
import styled from 'styled-components';

const { Title, Paragraph, Text } = Typography;

const StyledContainer = styled.div`
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const StyledImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const StyledMeta = styled.div`
  margin: 16px 0;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
`;

const StyledTag = styled(Tag)`
  margin-right: 8px;
  padding: 4px 8px;
  border-radius: 4px;
`;

const DEFAULT_BLOG_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000';

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);

  console.log('BlogDetails - id from useParams:', id);
  console.log('BlogDetails - typeof id:', typeof id);
  console.log('BlogDetails - window.location.pathname:', window.location.pathname);
  console.log('BlogDetails - user from localStorage:', JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching blog with id:', id);
        
        // Try public endpoint first
        try {
          const response = await BlogAPI.getById(id);
          setBlog(response);
          return;
        } catch (publicError) {
          console.log('Public endpoint failed, trying authenticated endpoint:', publicError);
        }
        
        // Fall back to authenticated endpoint
        const response = await BlogAPI.getById(id);
        setBlog(response);
      } catch (error) {
        console.error('Error fetching blog details:', error);
        console.error('Error response:', error.response);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogDetails();
    } else {
      console.error('No blog ID provided');
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <StyledContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </StyledContainer>
    );
  }

  if (!blog) {
    return (
      <StyledContainer>
        <Card>
          <Empty description="Blog not found" />
        </Card>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/blogList')}
        style={{ marginBottom: '16px' }}
      >
        Back to Blogs
      </Button>

      <StyledCard>
        <Title level={2}>{blog.title}</Title>
        
        <StyledMeta>
          <Space size="large">
            <Space>
              <Avatar icon={<UserOutlined />} />
              <Text strong>{blog.postedBy}</Text>
            </Space>
            <Space>
              <CalendarOutlined />
              <Text>{new Date(blog.postedAt).toLocaleDateString()}</Text>
            </Space>
            <StyledTag color="blue">{blog.status}</StyledTag>
          </Space>
        </StyledMeta>

        {blog.blogImages && blog.blogImages.length > 0 ? (
          <StyledImage 
            src={blog.blogImages[0]} 
            alt={blog.title}
          />
        ) : (
          <StyledImage 
            src={DEFAULT_BLOG_IMAGE} 
            alt="Default blog image"
          />
        )}

        <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
          {blog.content}
        </Paragraph>

        <Divider />

        <div style={{ marginTop: '24px' }}>
          <Space>
            <Button type="text" icon={<LikeOutlined />}>
              Like
            </Button>
            <Button type="text" icon={<MessageOutlined />}>
              Comment
            </Button>
          </Space>
        </div>

        {blog.comments && blog.comments.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <Title level={4}>Comments</Title>
            <List
              className="comment-list"
              itemLayout="horizontal"
              dataSource={blog.comments}
              renderItem={comment => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={comment.author}
                    description={
                      <Space direction="vertical">
                        <Text>{comment.content}</Text>
                        <Text type="secondary">
                          {new Date(comment.postedAt).toLocaleDateString()}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </StyledCard>
    </StyledContainer>
  );
}
