import React from 'react';
import { Typography, Button, Row, Col, Card } from 'antd';
import styled from 'styled-components';
import homeImage from '../assets/homeImage.png';

const { Title, Paragraph } = Typography;

const HeroSection = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${homeImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  position: relative;
`;

const StyledCard = styled(Card)`
  height: 100%;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
`;

const CallToActionSection = styled.div`
  background-color: #1890ff;
  color: white;
  padding: 48px 0;
  text-align: center;
`;

export default function Home() {
  return (
    <div>
      <HeroSection>
        <div>
          <Title level={1} style={{ color: 'white' }}>
            Drug Use Prevention Support System
          </Title>
          <Title level={3} style={{ color: 'white' }}>
            Empowering communities through education, support, and prevention
          </Title>
          <Button type="primary" size="large">
            Get Help Now
          </Button>
        </div>
      </HeroSection>

      <div style={{ padding: '64px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
            Our Services
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <StyledCard>
                <Title level={4}>Education & Awareness</Title>
                <Paragraph>
                  Access comprehensive resources and educational materials about drug prevention and healthy lifestyle choices.
                </Paragraph>
              </StyledCard>
            </Col>
            <Col xs={24} md={8}>
              <StyledCard>
                <Title level={4}>Support Network</Title>
                <Paragraph>
                  Connect with trained professionals and peer support groups for guidance and assistance.
                </Paragraph>
              </StyledCard>
            </Col>
            <Col xs={24} md={8}>
              <StyledCard>
                <Title level={4}>Crisis Intervention</Title>
                <Paragraph>
                  Immediate support and resources for those in need of urgent assistance.
                </Paragraph>
              </StyledCard>
            </Col>
          </Row>
        </div>
      </div>

      <CallToActionSection>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ color: 'white', marginBottom: 16 }}>
            Need Help? We're Here For You
          </Title>
          <Title level={4} style={{ color: 'white', marginBottom: 32 }}>
            24/7 Support Hotline: 1-800-HELP-NOW
          </Title>
          <div>
            <Button 
              type="default" 
              size="large"
              style={{ marginRight: 16, color: 'white', borderColor: 'white' }}
            >
              Contact Us
            </Button>
            <Button 
              type="primary" 
              size="large"
              style={{ backgroundColor: 'white', color: '#1890ff' }}
            >
              Find Resources
            </Button>
          </div>
        </div>
      </CallToActionSection>
    </div>
  );
}