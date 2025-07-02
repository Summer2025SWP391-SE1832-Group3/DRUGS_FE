import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Empty, Typography } from 'antd'
import { CourseAPI } from '../../apis/course';
import { ActionButton } from '../../components/ui/Buttons';
import { useNavigate } from 'react-router-dom';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await CourseAPI.getAllCourses();
        setCourses(data);
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div style={{
      padding: '25px 20px',
      minHeight: '100vh',
      fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica Neue", Arial, sans-serif',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)'
    }}>
      {/* Header Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#222'
      }}>
        <Typography.Title level={1} style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          margin: 0,
          letterSpacing: '-0.02em',
          textShadow: '0 4px 12px rgba(0,0,0,0.08)',
          fontFamily: 'inherit',
          color: '#222'
        }}>
          Explore Our Courses
        </Typography.Title>
        <Typography.Text style={{
          fontSize: '1.1rem',
          color: '#666',
          fontWeight: 500,
          marginTop: 8,
          display: 'block',
          fontFamily: 'inherit'
        }}>
          Discover knowledge, skills, and support for a better future
        </Typography.Text>
      </div>

      <Row gutter={[32, 32]} justify="center">
        {courses.length === 0 && !loading && (
          <Col span={24} style={{ textAlign: 'center', marginTop: 80 }}>
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '24px',
              padding: '48px 32px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <Empty
                description={
                  <span style={{
                    fontSize: '18px',
                    color: '#666',
                    fontWeight: '500'
                  }}>
                    No courses available at the moment
                  </span>
                }
              />
            </div>
          </Col>
        )}

        {courses.map((course) => (
          <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
            <Card
              hoverable
              style={{
                height: '100%',
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.97)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
              }}
              styles={{
                body: {
                  padding: '28px 24px 20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  fontFamily: 'inherit'
                }
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between',
                fontFamily: 'inherit'
              }}>
                <div>
                  <Typography.Title level={4} style={{
                    fontSize: '1.25rem',
                    marginBottom: '14px',
                    color: '#1a1a1a',
                    fontWeight: 700,
                    lineHeight: '1.3',
                    letterSpacing: '-0.01em',
                    fontFamily: 'inherit'
                  }}>
                    {course.title}
                  </Typography.Title>

                  <Typography.Paragraph style={{
                    color: '#555',
                    fontSize: '1rem',
                    lineHeight: '1.7',
                    marginBottom: '22px',
                    fontWeight: 400,
                    fontFamily: 'inherit'
                  }}
                    ellipsis={{rows: 5}}
                  >
                    {course.description}
                  </Typography.Paragraph>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '20px',
                    fontFamily: 'inherit'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Typography.Text style={{
                        background: 'linear-gradient(135deg, #52c41a, #389e0d)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontFamily: 'inherit'
                      }}>
                        Topic
                      </Typography.Text>
                      <Typography.Text style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#333',
                        fontFamily: 'inherit'
                      }}>
                        {course.topic || 'General'}
                      </Typography.Text>
                    </div>
                  </div>
                </div>

                <ActionButton
                  className="edit-btn"
                  block
                  style={{
                    height: '48px',
                    fontSize: '1.08rem',
                    fontWeight: 700,
                    borderRadius: '16px',
                    letterSpacing: '0.02em',
                    fontFamily: 'inherit'
                  }}
                >
                  View Course Details
                </ActionButton>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}