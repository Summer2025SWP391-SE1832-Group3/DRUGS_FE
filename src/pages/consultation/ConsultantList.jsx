import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Tag, Space, Spin, Empty, Rate, Avatar } from 'antd';
import { UserOutlined, CalendarOutlined, EyeOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { ConsultantAPI } from '../../apis/consultant';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const apiBase = "https://api-drug-be.purintech.id.vn";  


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
  margin: 4px 0;
  padding: 6px 12px;
  border-radius: 20px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  font-size: 12px;
`;

const StyledMeta = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e8f2ff;
`;

const AvatarWrapper = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const StyledAvatar = styled(Avatar)`
  width: 80px;
  height: 80px;
  border: 3px solid #f0f0f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    border-color: #667eea;
  }
`;

const CertificateSection = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  padding: 8px 0;
`;


const MALE_AVATARS = [
  'https://images.unsplash.com/photo-1557862921-37829c790f19?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
];

const FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
];


const getAvatarForConsultant = (consultantName) => {
  if (!consultantName) return MALE_AVATARS[0];
  
  if (consultantName.toLowerCase().includes('pham thi hoa')) {
    return FEMALE_AVATARS[0];
  }
  
  const nameMapping = {
    'đặng lâm anh tuấn': 0, 
    'đặng võ minh trung': 1, 
    'nguyễnn văn an': 2, 
    'nguyễn văn a': 3, 
    'nguyễn văn minh': 4, 
  };
  
  const lowerName = consultantName.toLowerCase();
  const mappedIndex = nameMapping[lowerName];
  
  if (mappedIndex !== undefined) {
    return MALE_AVATARS[mappedIndex];
  }

  const nameHash = consultantName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const maleIndex = nameHash % MALE_AVATARS.length;
  return MALE_AVATARS[maleIndex];
};

export default function ConsultantList() {
  const [loading, setLoading] = useState(true);
  const [consultants, setConsultants] = useState([]);
  const [visibleConsultants, setVisibleConsultants] = useState([]);
  const [certificatesMap, setCertificatesMap] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchConsultants = async () => {
      setLoading(true);
      try {
        const data = await ConsultantAPI.getConsultants({ page: 1, pageSize: 10 });
        setConsultants(data);
        
        const certPromises = data.map(async (c) => {
          try {
            const certs = await ConsultantAPI.getCertificatesByConsultantId(c.id);
            return [c.id, certs];
          } catch {
            return [c.id, []];
          }
        });
        const certResults = await Promise.all(certPromises);
        const certMap = {};
        certResults.forEach(([id, certs]) => {
          certMap[id] = certs;
        });
        setCertificatesMap(certMap);
      } catch (error) {
        setConsultants([]);
        setCertificatesMap({});
      } finally {
        setLoading(false);
      }
    };
    fetchConsultants();
  }, []);

 
  useEffect(() => {
    if (consultants.length > 0 && !loading) {
      const timer = setTimeout(() => {
        const animateConsultants = () => {
          setVisibleConsultants(prev => {
            if (prev.length < consultants.length) {
              return consultants.slice(0, prev.length + 1);
            }
            return prev;
          });
        };

        
        const interval = setInterval(() => {
          animateConsultants();
          if (visibleConsultants.length >= consultants.length) {
            clearInterval(interval);
          }
        }, 200);

        return () => clearInterval(interval);
      }, 500); 

      return () => clearTimeout(timer);
    }
  }, [consultants, loading]);

  const handleViewDetails = (id) => {
    navigate(`/consultantDetails/${id}`);
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
          Our Professional Consultants
        </Title>
        <Paragraph style={{ 
          marginTop: '12px', 
          color: '#6c757d',
          fontSize: '1.1rem',
          fontWeight: '500'
        }}>
          Connect with experienced professionals for expert guidance
        </Paragraph>
      </StyledHeader>

      {consultants.length === 0 ? (
        <Empty 
          description="No consultants available" 
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
          dataSource={visibleConsultants}
          renderItem={(consultant, index) => (
            <List.Item>
              <StyledCard
                hoverable
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: '0.6s'
                }}
                actions={[
                  <Space 
                    onClick={() => handleViewDetails(consultant.id)}
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
                    View Details
                  </Space>
                ]}
              >
                <Card.Meta
                  description={
                    <>
                      <AvatarWrapper>
                        <StyledAvatar
                          size={80}
                          src={consultant.avatarUrl ? `${apiBase}${consultant.avatarUrl}` : getAvatarForConsultant(consultant.fullName)}
                          icon={<UserOutlined />}
                        />
                      </AvatarWrapper>
                      
                      <Title level={4} style={{ 
                        margin: 0, 
                        fontSize: '20px', 
                        lineHeight: '1.4',
                        color: '#1a1a1a',
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}>
                        {consultant.fullName || 'Professional Consultant'}
                      </Title>

                      <RatingSection>
                        <Rate disabled defaultValue={consultant.rating} style={{ fontSize: '16px' }} />
                        <Text style={{ marginLeft: '8px', color: '#6c757d' }}>
                          ({consultant.rating}/5)
                        </Text>
                      </RatingSection>

                      {consultant.bio && (
                        <Paragraph ellipsis={{ rows: 3 }} style={{ 
                          marginTop: '20px', 
                          marginBottom: '20px', 
                          fontSize: '15px', 
                          lineHeight: '1.7',
                          color: '#5a6c7d',
                          textAlign: 'center'
                        }}>
                          {consultant.bio}
                        </Paragraph>
                      )}

                      {/* Hiển thị chứng chỉ */}
                      <CertificateSection>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text strong style={{ color: '#1a1a1a' }}>Certificates:</Text>
                          {Array.isArray(certificatesMap[consultant.id]) && certificatesMap[consultant.id].length > 0 ? (
                            certificatesMap[consultant.id].map(cert => (
                              <div key={cert.id} style={{ marginBottom: 6 }}>
                                <Space direction="vertical" size={0}>
                                  <Text>{cert.name}</Text>
                                  <Text type="secondary" style={{ fontSize: '13px' }}>{cert.issuingOrganization}</Text>
                                  <Text type="secondary" style={{ fontSize: '13px' }}>Issued: {new Date(cert.dateIssued).toLocaleDateString()}</Text>
                                </Space>
                              </div>
                            ))
                          ) : (
                            <Text type="secondary">No certificates</Text>
                          )}
                        </Space>
                      </CertificateSection>

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