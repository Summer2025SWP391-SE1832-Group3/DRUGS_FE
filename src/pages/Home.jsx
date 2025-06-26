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

const MainContainer = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
`;

const HeroCard = styled(Card)`
  width: 100%;
  border-radius: 0;
  box-shadow: 0 4px 24px rgba(34,76,139,0.08);
  padding: 36px 0 28px 0;
  margin-bottom: 0;
  text-align: center;
  background: #fff;
  border: none;
  .ant-card-body { padding: 0; }
`;

const StyledCard = styled(Card)`
  width: 100%;
  height: 100%;
  transition: all 0.4s ease-in-out;
  border-radius: 0;
  border: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  background: #ffffff;
  margin: 0;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.1);
  }
  .ant-card-body {
    padding: 20px 0;
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
  width: 100%;
  height: 100%;
  transition: all 0.4s ease-in-out;
  border-radius: 0;
  overflow: hidden;
  border: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  background: #ffffff;
  margin: 0;
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
    padding: 16px 0;
  }
`;

const SectionCard = styled(Card)`
  width: 100%;
  box-shadow: 0 4px 24px rgba(34,76,139,0.08);
  background: #fff;
  border: none;
  border-radius: 0;
  margin-bottom: 0;
  .ant-card-body {
    padding: 2px 18px;
  }
`;

const BlogSection = styled.div`
  background: #f8f9fa;
  padding: 0;
`;

const StatsSection = styled(SectionCard)`
  text-align: center;
  margin-bottom: 0;
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

const CallToActionSection = styled(SectionCard)`
  border-radius: 0 !important;
  margin-bottom: 0 !important;
  background: linear-gradient(135deg,rgb(46, 105, 139) 0%,rgb(34, 76, 139) 50%,rgb(53, 50, 205) 100%);
  color: white;
  text-align: center;
  .ant-typography, .ant-typography h2, .ant-typography h4 { color: white !important; }
`;

const DEFAULT_BLOG_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000';

const DividerSection = styled.div`
  width: 100%;
  border-top: 1px solid #e0e3e8;
  margin: 0;
`;

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await BlogAPI.getApprovedBlogs();
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
    <MainContainer>
      <HeroCard>
        <Title level={1} style={{ color: '#2c3e50', fontWeight: 700 }}>
          Drug Use Prevention Support System
        </Title>
        <Title level={3} style={{ color: '#2c3e50', opacity: 0.9, fontWeight: 400 }}>
          Empowering communities through education, support, and prevention
        </Title>
        <Button 
          type="primary" 
          size="large" 
          style={{ 
            background: 'linear-gradient(135deg,rgb(46, 105, 139) 0%,rgb(34, 76, 139) 50%,rgb(53, 50, 205) 100%)',
            border: 'none',
            color: 'white',
            height: '48px',
            padding: '0 32px',
            fontSize: '16px',
            borderRadius: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}
          icon={<SafetyOutlined style={{ color: 'white' }} />}
        >
          Get Help Now
        </Button>
      </HeroCard>
      <DividerSection />
      <StatsSection>
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
      </StatsSection>
      <DividerSection />
      <SectionCard>
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
      </SectionCard>
      <DividerSection />
      <BlogSection>
        <MainContainer>
          <SectionCard style={{ background: '#f8f9fa', boxShadow: 'none' }}>
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
                    background: 'linear-gradient(135deg,rgb(46, 105, 139) 0%,rgb(34, 76, 139) 50%,rgb(53, 50, 205) 100%)',
                    border: 'none',
                    color: 'white',
                    height: '48px',
                    padding: '0 32px',
                    fontSize: '16px',
                    borderRadius: '24px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                  }}
                >
                  View All Blogs
                </Button>
              </div>
            )}
          </SectionCard>
        </MainContainer>
      </BlogSection>
      <DividerSection />
      <CallToActionSection>
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
      </CallToActionSection>
    </MainContainer>
  );
}