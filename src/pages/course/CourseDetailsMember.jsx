import React, { useState, useEffect } from 'react';
import { Typography, Card, Collapse, List, Divider, Row, Col, Tag, Space, Checkbox, Progress } from 'antd';
import { PlayCircleOutlined, BookOutlined, ClockCircleOutlined, UserOutlined, StarFilled, CheckCircleOutlined, ExclamationCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { CourseAPI } from '../../apis/course';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

// Giữ nguyên components nút của bạn
const ActionButton = ({ children, className, ...props }) => (
  <button 
    className={className}
    style={{
      padding: '6px 12px',
      border: '1px solid #d9d9d9',
      borderRadius: '4px',
      backgroundColor: '#fff',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      color: '#333'
    }}
    {...props}
  >
    {children}
  </button>
);

const CreateButton = ({ children, ...props }) => (
  <button 
    style={{
      padding: '10px 20px',
      backgroundColor: '#1890ff',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
      transition: 'all 0.3s ease'
    }}
    onMouseOver={(e) => e.target.style.backgroundColor = '#40a9ff'}
    onMouseOut={(e) => e.target.style.backgroundColor = '#1890ff'}
    {...props}
  >
    {children}
  </button>
);

export default function CourseDetailsMember() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonProgress, setLessonProgress] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await CourseAPI.getCourseById(id);
        setCourse(data);
        // Nếu có lessions, khởi tạo progress cho từng lesson
        if (data.lessions && Array.isArray(data.lessions)) {
          setLessonProgress(
            data.lessions.reduce((acc, lesson, idx) => {
              acc[idx] = lesson.progress || {};
              return acc;
            }, {})
          );
        }
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleProgressChange = (lessonIdx, type, checked) => {
    setLessonProgress(prev => ({
      ...prev,
      [lessonIdx]: {
        ...prev[lessonIdx],
        [type]: checked
      }
    }));
  };

  const welcomeText = 'Take a look at the science of how addictive drugs affect your body and why substance addiction can be so difficult to treat.';
  const author = 'Judy Grisel From TED Ed';
  const type = course?.topic || '';
  const duration = '30 minutes to complete';
  const lessonCount = course?.lessions?.length || 0;

  if (loading) return <div style={{textAlign:'center',padding:'80px 0'}}>Loading...</div>;
  if (!course) return <div>Course not found</div>;

  // Nếu chưa đăng ký hoặc không có bài học
  if (!course.lessions || !Array.isArray(course.lessions) || course.lessions.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: 20
      }}>
        <Title level={2} style={{color:'white',marginBottom:16}}>{course.title}</Title>
        <Paragraph style={{color:'white',fontSize:18,maxWidth:600,textAlign:'center'}}>{course.message || 'No lessons available.'}</Paragraph>
        <Paragraph style={{color:'white',fontSize:16,maxWidth:600,textAlign:'center', marginTop: 8}}>{course.description}</Paragraph>
        <Paragraph style={{color:'white',fontSize:16,maxWidth:600,textAlign:'center', marginTop: 8}}>Topic: {course.topic}</Paragraph>
        
        
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '0'
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
        padding: '60px 0',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }} />
        
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 32px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[...Array(5)].map((_, i) => (
                <StarFilled key={i} style={{ color: '#ffd700', fontSize: '16px', marginRight: '2px' }} />
              ))}
              <Text style={{ color: 'rgba(255,255,255,0.8)', marginLeft: '8px', fontSize: '14px' }}>
                4.8 (2,847 reviews)
              </Text>
            </div>
          </div>
          
          <Title 
            level={1} 
            style={{ 
              fontSize: '48px', 
              fontWeight: '800', 
              color: 'white',
              marginBottom: '20px',
              lineHeight: '1.2',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {course.title}
          </Title>
          
          <Paragraph style={{ 
            fontSize: '20px', 
            color: 'rgba(255,255,255,0.9)', 
            marginBottom: '32px',
            lineHeight: '1.6',
            maxWidth: '800px'
          }}>
            {welcomeText}
          </Paragraph>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '20px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <UserOutlined style={{ fontSize: '24px', color: 'white' }} />
            </div>
            <div>
              <Text style={{ 
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                display: 'block'
              }}>
                Course Instructor
              </Text>
              <Text style={{ 
                color: 'white',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {author}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        backgroundColor: '#f8fafc',
        padding: '40px 0',
        minHeight: '100vh'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 32px' 
        }}>
          {/* Course Overview Card */}
          <Card style={{ 
            marginBottom: '32px',
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
          }}>
            <Row gutter={32} align="middle">
              <Col xs={24} md={16}>
                <div style={{ marginBottom: '24px' }}>
                  <Title level={3} style={{ 
                    color: '#1a202c',
                    marginBottom: '12px',
                    fontSize: '24px',
                    fontWeight: '700'
                  }}>
                    Course Overview
                  </Title>
                  <Paragraph style={{ 
                    fontSize: '16px',
                    color: '#4a5568',
                    lineHeight: '1.6',
                    marginBottom: 0
                  }}>
                    {course.description}
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '24px',
                  borderRadius: '12px',
                  color: 'white'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <BookOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
                    <Text style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                      {lessonCount} Lessons
                    </Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <ClockCircleOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
                    <Text style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
                      {duration}
                    </Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginRight: '8px' }}>
                      Type:
                    </Text>
                    <Tag style={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      borderRadius: '20px',
                      padding: '4px 16px'
                    }}>
                      {type}
                    </Tag>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Lessons Section */}
          <Card style={{ 
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '24px',
              margin: '-24px -24px 24px -24px'
            }}>
              <Title level={2} style={{ 
                color: 'white',
                marginBottom: 0,
                fontSize: '28px',
                fontWeight: '700'
              }}>
                Course Curriculum
              </Title>
            </div>
            
            <Collapse 
              accordion 
              ghost
              style={{ 
                backgroundColor: 'transparent'
              }}
              expandIconPosition="end"
            >
              {course.lessions.map((lesson, idx) => (
                <Panel 
                  header={
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      width: '100%',
                      paddingRight: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '16px'
                        }}>
                          <PlayCircleOutlined style={{ 
                            color: 'white',
                            fontSize: '18px'
                          }} />
                        </div>
                        <div>
                          <Text style={{ 
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#1a202c',
                            display: 'block'
                          }}>
                            Lesson {idx + 1}: {lesson.title}
                          </Text>
                          <Text style={{ 
                            fontSize: '14px',
                            color: '#718096'
                          }}>
                            Video lesson • Interactive quiz
                          </Text>
                        </div>
                      </div>
                    </div>
                  }
                  key={idx}
                  style={{
                    backgroundColor: '#fff',
                    marginBottom: '16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ padding: '0 16px 16px 16px' }}>
                    {/* Progress Section */}
                    <div style={{
                      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                      padding: '20px',
                      borderRadius: '12px',
                      marginBottom: '24px',
                      color: 'white'
                    }}>
                      <Title level={4} style={{
                        color: 'white',
                        marginBottom: '16px',
                        fontSize: '18px',
                        fontWeight: '600'
                      }}>
                        📊 Learning Progress
                      </Title>
                      <Row gutter={16}>
                        <Col span={8}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                              {Math.round(((lessonProgress[idx]?.contentCompleted ? 1 : 0) + 
                                          (lessonProgress[idx]?.videoCompleted ? 1 : 0)) / 2 * 100)}%
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.9 }}>Overall</div>
                          </div>
                        </Col>
                        <Col span={16}>
                          <div style={{ marginBottom: '8px' }}>
                            <Text style={{ color: 'white', fontSize: '14px' }}>Content: </Text>
                            <Text style={{ color: 'white', fontWeight: '600' }}>
                              {lessonProgress[idx]?.contentCompleted ? '✓ Completed' : '○ Not completed'}
                            </Text>
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <Text style={{ color: 'white', fontSize: '14px' }}>Video: </Text>
                            <Text style={{ color: 'white', fontWeight: '600' }}>
                              {lessonProgress[idx]?.videoCompleted ? '✓ Watched' : '○ Not watched'}
                            </Text>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    {/* Content Section with Checkbox */}
                    <div style={{
                      backgroundColor: '#f7fafc',
                      padding: '20px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '24px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <Checkbox 
                          checked={lessonProgress[idx]?.contentCompleted}
                          onChange={(e) => handleProgressChange(idx, 'contentCompleted', e.target.checked)}
                          style={{ marginRight: '12px', marginTop: '4px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <Title level={5} style={{ marginBottom: '8px', color: '#2d3748' }}>
                            📖 Lesson Content
                          </Title>
                          <Paragraph style={{ 
                            fontSize: '16px', 
                            color: '#4a5568',
                            lineHeight: '1.6',
                            marginBottom: 0
                          }}>
                            {lesson.content}
                          </Paragraph>
                        </div>
                      </div>
                    </div>
                    
                    {/* Video Section with Checkbox */}
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <Checkbox 
                          checked={lessonProgress[idx]?.videoCompleted}
                          onChange={(e) => handleProgressChange(idx, 'videoCompleted', e.target.checked)}
                          style={{ marginRight: '12px' }}
                        />
                        <Title level={5} style={{ marginBottom: 0, color: '#2d3748' }}>
                          🎥 Video Lesson
                        </Title>
                      </div>
                      <div style={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                      }}>
                        <iframe
                          width="100%"
                          height="400"
                          src={lesson.videoUrl}
                          title={lesson.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </Panel>
              ))}
            </Collapse>
          </Card>
        </div>
      </div>
    </div>
  );
}