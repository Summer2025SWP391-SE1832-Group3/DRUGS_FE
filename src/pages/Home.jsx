import React, { useState, useEffect } from 'react';
import { Typography, Button, Row, Col, Card, Spin, Statistic } from 'antd';
import styled from 'styled-components';
import { 
  EyeOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  HeartOutlined,
  SafetyOutlined,
  TeamOutlined,
  PhoneOutlined,
  BookOutlined,
  GlobalOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import homeImage from '../assets/homeImage.png';
import { BlogAPI } from '../apis/blog';

const { Title, Paragraph } = Typography;

const HeroSection = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${homeImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    pointer-events: none;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 24px;
  
  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    animation: fadeInUp 1s ease-out;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 300;
    margin-bottom: 2rem;
    opacity: 0.9;
    animation: fadeInUp 1s ease-out 0.3s both;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StyledCard = styled(Card)`
  height: 100%;
  transition: all 0.4s ease-in-out;
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  background: #ffffff;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  }
  
  .ant-card-body {
    padding: 32px 24px;
    text-align: center;
  }
  
  .service-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #2c3e50;
    transition: all 0.3s ease;
  }
  
  &:hover .service-icon {
    transform: scale(1.1);
    color: #34495e;
  }
`;

const BlogCard = styled(Card)`
  height: 100%;
  transition: all 0.4s ease-in-out;
  border-radius: 16px;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  background: #ffffff;
  
  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 16px 50px rgba(0,0,0,0.1);
  }

  .ant-card-cover img {
    transition: all 0.4s ease;
    height: 220px;
    object-fit: cover;
  }

  &:hover .ant-card-cover img {
    transform: scale(1.08);
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

const CallToActionSection = styled.div`
  background: #2c3e50;
  color: white;
  padding: 80px 0;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
    pointer-events: none;
  }
`;

const BlogSection = styled.div`
  background: #f8f9fa;
  padding: 80px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: #e9ecef;
  }
`;

const StatsSection = styled.div`
  background: white;
  padding: 60px 0;
  text-align: center;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 24px;
  
  .ant-statistic-title {
    font-size: 1rem;
    color: #6c757d;
    margin-bottom: 8px;
  }
  
  .ant-statistic-content {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
  }
`;

const DEFAULT_BLOG_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await BlogAPI.getAll();
        if (response && Array.isArray(response)) {
          const approvedBlogs = response.filter(blog => blog.status === 'Approved').slice(0, 6);
          setBlogs(approvedBlogs);
        } else if (response && response.data && Array.isArray(response.data)) {
          const approvedBlogs = response.data.filter(blog => blog.status === 'Approved').slice(0, 6);
          setBlogs(approvedBlogs);
        }
      } catch (error) {
        console.error('Error fetching blogs for home page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleReadMore = (blogId) => {
    navigate(`/blogDetails/${blogId}`);
  };

  return (
    <div>
      <HeroSection>
        <HeroContent>
          <Title level={1} style={{ color: 'white' }}>
            Drug Use Prevention Support System
          </Title>
          <Title level={3} style={{ color: 'white', opacity: 0.9 }}>
            Empowering communities through education, support, and prevention
          </Title>
          <Button 
            type="primary" 
            size="large" 
            style={{ 
              backgroundColor: 'white',
              borderColor: 'white',
              color: '#2c3e50',
              height: '48px',
              padding: '0 32px',
              fontSize: '16px',
              borderRadius: '24px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
            icon={<SafetyOutlined style={{ color: '#2c3e50' }} />}
          >
            Get Help Now
          </Button>
        </HeroContent>
      </HeroSection>

      <StatsSection>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48, color: '#2c3e50' }}>
            Our Impact
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={12} md={6}>
              <StatCard>
                <Statistic 
                  title="Communities Served" 
                  value={150} 
                  suffix="+" 
                  prefix={<TeamOutlined style={{ color: '#2c3e50', fontSize: '24px' }} />}
                />
              </StatCard>
            </Col>
            <Col xs={12} md={6}>
              <StatCard>
                <Statistic 
                  title="Lives Impacted" 
                  value={5000} 
                  suffix="+" 
                  prefix={<HeartOutlined style={{ color: '#2c3e50', fontSize: '24px' }} />}
                />
              </StatCard>
            </Col>
            <Col xs={12} md={6}>
              <StatCard>
                <Statistic 
                  title="Success Rate" 
                  value={95} 
                  suffix="%" 
                  prefix={<TrophyOutlined style={{ color: '#2c3e50', fontSize: '24px' }} />}
                />
              </StatCard>
            </Col>
            <Col xs={12} md={6}>
              <StatCard>
                <Statistic 
                  title="Years of Service" 
                  value={10} 
                  suffix="+" 
                  prefix={<GlobalOutlined style={{ color: '#2c3e50', fontSize: '24px' }} />}
                />
              </StatCard>
            </Col>
          </Row>
        </div>
      </StatsSection>

      <div style={{ padding: '80px 0', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 16, color: '#2c3e50' }}>
            Our Services
          </Title>
          <Paragraph style={{ textAlign: 'center', marginBottom: 48, fontSize: '18px', color: '#6c757d' }}>
            Comprehensive support and resources for drug prevention and community wellness
          </Paragraph>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <StyledCard>
                <BookOutlined className="service-icon" />
                <Title level={4}>Education & Awareness</Title>
                <Paragraph>
                  Access comprehensive resources and educational materials about drug prevention and healthy lifestyle choices.
                </Paragraph>
              </StyledCard>
            </Col>
            <Col xs={24} md={8}>
              <StyledCard>
                <TeamOutlined className="service-icon" />
                <Title level={4}>Support Network</Title>
                <Paragraph>
                  Connect with trained professionals and peer support groups for guidance and assistance.
                </Paragraph>
              </StyledCard>
            </Col>
            <Col xs={24} md={8}>
              <StyledCard>
                <SafetyOutlined className="service-icon" />
                <Title level={4}>Crisis Intervention</Title>
                <Paragraph>
                  Immediate support and resources for those in need of urgent assistance.
                </Paragraph>
              </StyledCard>
            </Col>
          </Row>
        </div>
      </div>

      <BlogSection>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 16, color: '#2c3e50' }}>
            Latest Blog Posts
          </Title>
          <Paragraph style={{ textAlign: 'center', marginBottom: 48, fontSize: '18px', color: '#6c757d' }}>
            Stay informed with our latest articles and insights on drug prevention and community support
          </Paragraph>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <Spin size="large" style={{ color: '#2c3e50' }} />
            </div>
          ) : (
            <Row gutter={[32, 32]}>
              {blogs.map((blog) => (
                <Col xs={24} sm={12} lg={8} key={blog.blogId}>
                  <BlogCard
                    hoverable
                    cover={
                      <img
                        alt={blog.title}
                        src={blog.blogImages && blog.blogImages.length > 0 ? blog.blogImages[0] : DEFAULT_BLOG_IMAGE}
                      />
                    }
                    actions={[
                      <Button 
                        type="text" 
                        icon={<EyeOutlined />}
                        onClick={() => handleReadMore(blog.blogId)}
                        style={{ 
                          border: 'none',
                          color: '#2c3e50',
                          fontWeight: '500'
                        }}
                      >
                        Read More
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Title level={4} style={{ margin: 0, fontSize: '18px', lineHeight: '1.4', color: '#2c3e50' }}>
                          {blog.title}
                        </Title>
                      }
                      description={
                        <div>
                          <Paragraph 
                            ellipsis={{ rows: 3 }} 
                            style={{ marginTop: '16px', marginBottom: '16px', fontSize: '14px', lineHeight: '1.6', color: '#6c757d' }}
                          >
                            {blog.content}
                          </Paragraph>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            fontSize: '12px', 
                            color: '#6c757d',
                            paddingTop: '12px',
                            borderTop: '1px solid #e9ecef'
                          }}>
                            <span>
                              <UserOutlined style={{ marginRight: '6px' }} />
                              {blog.postedBy}
                            </span>
                            <span>
                              <CalendarOutlined style={{ marginRight: '6px' }} />
                              {new Date(blog.postedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      }
                    />
                  </BlogCard>
                </Col>
              ))}
            </Row>
          )}
          
          {!loading && blogs.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate('/blogList')}
                style={{ 
                  backgroundColor: '#2c3e50',
                  borderColor: '#2c3e50',
                  height: '48px',
                  padding: '0 32px',
                  fontSize: '16px',
                  borderRadius: '24px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              >
                View All Blogs
              </Button>
            </div>
          )}
        </div>
      </BlogSection>

      <CallToActionSection>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
            Need Help? We're Here For You
          </Title>
          <Title level={4} style={{ color: 'white', marginBottom: 32, opacity: 0.9 }}>
            <PhoneOutlined style={{ marginRight: '12px' }} />
            24/7 Support Hotline: 1-800-HELP-NOW
          </Title>
          <div>
            <Button 
              type="default" 
              size="large"
              style={{ 
                marginRight: 16, 
                color: 'white', 
                borderColor: 'white',
                height: '48px',
                padding: '0 32px',
                fontSize: '16px',
                borderRadius: '24px'
              }}
            >
              Contact Us
            </Button>
            <Button 
              type="primary" 
              size="large"
              style={{ 
                backgroundColor: 'white', 
                color: '#2c3e50',
                height: '48px',
                padding: '0 32px',
                fontSize: '16px',
                borderRadius: '24px',
                borderColor: 'white'
              }}
            >
              Find Resources
            </Button>
          </div>
        </div>
      </CallToActionSection>
    </div>
  );
}
