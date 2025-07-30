import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, Row, Col, Tag, Spin, Divider, List, Tooltip, Badge } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone, BookOutlined, PlayCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { CourseAPI } from '../../apis/course';

const { Title, Paragraph, Text } = Typography;

export default function CompletedCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedCourse = async () => {
      setLoading(true);
      try {
        const data = await CourseAPI.completedCourse(id);
        setCourse(data);
      } catch {
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedCourse();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '120px 0' }}><Spin size="large" /></div>;
  if (!course) return (
    <div style={{ 
      textAlign: 'center', 
      padding: '120px 0', 
      minHeight: '100vh',
      color: 'white'
    }}>
      <Title level={3} style={{ color: 'white' }}>Completed course not found</Title>
    </div>
  );

  const completedLessons = course.lessons?.filter(lesson => lesson.isCompleted).length || 0;
  const totalLessons = course.lessons?.length || 0;

  return (
    <div>
      <div style={{ width: "100%", margin: '0 auto' }}>
        
        {/* Header Card */}
        <Card 
          style={{ 
            borderRadius: 24, 
            marginBottom: 10, 
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            border: 'none',
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            background: 'linear-gradient(135deg,rgb(147, 218, 251) 0%,rgb(90, 87, 245) 100%)',
            margin: '-24px -24px 32px -24px',
            padding: '48px 32px',
            color: 'white',
            textAlign: 'center'
          }}>
            <TrophyOutlined style={{ fontSize: 48, marginBottom: 16, color: '#ffd700' }} />
            <Title level={1} style={{ 
              color: 'white', 
              marginBottom: 8,
              fontSize: '2.5rem',
              fontWeight: 700
            }}>
              {course.title}
            </Title>
            <div style={{ marginBottom: 16 }}>
              <Tag 
                color="success" 
                style={{ 
                  fontSize: 18, 
                  padding: '8px 24px', 
                  borderRadius: 20,
                  fontWeight: 600,
                  border: 'none'
                }}
              >
                ✅ Course Completed
              </Tag>
            </div>
            <Paragraph style={{ 
              fontSize: 18, 
              color: 'rgba(255,255,255,0.9)',
              maxWidth: 600,
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              {course.description}
            </Paragraph>
          </div>

          {/* Course Stats */}
          <Row gutter={[32, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
              <div style={{ 
                padding: '24px', 
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                borderRadius: 16,
                height: '100%'
              }}>
                <BookOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
                <div style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>Topic</div>
                <Tag color="blue" style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                  {course.topic}
                </Tag>
              </div>
            </Col>
            <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
              <div style={{ 
                padding: '24px', 
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                borderRadius: 16,
                height: '100%'
              }}>
                <TrophyOutlined style={{ fontSize: 32, color: '#fa8c16', marginBottom: 8 }} />
                <div style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>Final Score</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#fa8c16', marginTop: 4 }}>
                  {course.finalScore}%
                </div>
              </div>
            </Col>
            <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
              <div style={{ 
                padding: '24px', 
                background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
                borderRadius: 16,
                height: '100%'
              }}>
                <CheckCircleTwoTone style={{ fontSize: 32, marginBottom: 8 }} />
                <div style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>Completed</div>
                <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                  {course.completedDate ? new Date(course.completedDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Lessons Section */}
        <Card 
          style={{ 
            borderRadius: 24, 
            marginBottom: 10, 
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            border: 'none'
          }}
        >
          <div style={{ marginBottom: 32 }}>
            <Title level={2} style={{ 
              marginBottom: 8,
              fontSize: '1.8rem',
              fontWeight: 600,
              color: '#262626'
            }}>
              📚 Course Lessons
            </Title>
            <div style={{ marginBottom: 24 }}>
              <Badge 
                count={`${completedLessons}/${totalLessons}`} 
                style={{ 
                  backgroundColor: '#52c41a',
                  fontSize: 14,
                  padding: '4px 8px',
                  borderRadius: 12
                }}
              />
              <Text style={{ marginLeft: 12, fontSize: 16, color: '#666' }}>
                lessons completed
              </Text>
            </div>
          </div>

          <Row gutter={[24, 24]}>
            {(course.lessons || []).map((lesson, index) => (
              <Col xs={24} key={lesson.id}>
                <Card
                  hoverable
                  style={{ 
                    borderRadius: 16, 
                    height: '100%',
                    border: lesson.isCompleted ? '2px solid #52c41a' : '1px solid #f0f0f0',
                    boxShadow: lesson.isCompleted ? '0 8px 24px rgba(82, 196, 26, 0.2)' : '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease'
                  }}
                  bodyStyle={{ padding: '20px' }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: 16,
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: '50%',
                        background: lesson.isCompleted ? '#52c41a' : '#d9d9d9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                        color: 'white',
                        fontWeight: 600
                      }}>
                        {index + 1}
                      </div>
                      <Title level={5} style={{ 
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 600
                      }}>
                        {lesson.title}
                      </Title>
                    </div>
                    {lesson.isCompleted && (
                      <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 20 }} />
                    )}
                  </div>

                  <Paragraph style={{ 
                    fontSize: 14, 
                    color: '#666',
                    lineHeight: 1.5,
                    marginBottom: 16
                  }}>
                    {lesson.content || 'No content available'}
                  </Paragraph>

                  {lesson.videoUrl && (
                    <div style={{ 
                      borderRadius: 12, 
                      overflow: 'hidden', 
                      marginBottom: 16,
                      border: '1px solid #f0f0f0'
                    }}>
                      <div style={{ 
                        position: 'relative',
                        background: '#f5f5f5',
                        height: "500px",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <PlayCircleOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                        <video 
                          width="100%" 
                          height="500px"
                          controls 
                          src={lesson.videoUrl}
                          style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            borderRadius: 12
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <Tag color={lesson.isCompleted ? 'success' : 'default'} style={{ fontWeight: 600 }}>
                      {lesson.isCompleted ? 'Completed' : 'Not Completed'}
                    </Tag>
                    
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Final Survey Results */}
        {course.finalSurveyResult && (
          <Card 
            style={{ 
              borderRadius: 24, 
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              border: 'none'
            }}
          >
            <div style={{ marginBottom: 32 }}>
              <Title level={2} style={{ 
                marginBottom: 16,
                fontSize: '1.8rem',
                fontWeight: 600,
                color: '#262626'
              }}>
                📊 Final Survey Results
              </Title>
              
              <div style={{ 
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                padding: '24px',
                borderRadius: 16,
                marginBottom: 24
              }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={6}>
                    <Tag color="blue" style={{ fontSize: 14, padding: '6px 12px', fontWeight: 600 }}>
                      📋 {course.finalSurveyResult.surveyName}
                    </Tag>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Tag color="purple" style={{ fontSize: 14, padding: '6px 12px', fontWeight: 600 }}>
                      🎯 Score: {course.finalSurveyResult.totalScore}
                    </Tag>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Tag 
                      color={course.finalSurveyResult.recommendation === 'Pass' ? 'success' : 'error'}
                      style={{ fontSize: 14, padding: '6px 12px', fontWeight: 600 }}
                    >
                      {course.finalSurveyResult.recommendation === 'Pass' ? '✅' : '❌'} {course.finalSurveyResult.recommendation}
                    </Tag>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Tag color="default" style={{ fontSize: 14, padding: '6px 12px', fontWeight: 600 }}>
                      📅 {course.finalSurveyResult.submittedAt ? new Date(course.finalSurveyResult.submittedAt).toLocaleDateString() : 'N/A'}
                    </Tag>
                  </Col>
                </Row>
              </div>
            </div>

            <Divider style={{ margin: '32px 0' }} />

            <List
              itemLayout="vertical"
              dataSource={course.finalSurveyResult.questions || []}
              renderItem={(q, index) => (
                <List.Item key={q.questionId} style={{ 
                  background: '#fafafa',
                  borderRadius: 16,
                  padding: '24px',
                  marginBottom: 16,
                  border: '1px solid #f0f0f0'
                }}>
                  <div style={{ 
                    marginBottom: 16, 
                    fontWeight: 600, 
                    fontSize: 16,
                    color: '#262626',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <div style={{ 
                      width: 28, 
                      height: 28, 
                      borderRadius: '50%',
                      background: '#1890ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 700
                    }}>
                      {index + 1}
                    </div>
                    {q.questionText}
                  </div>
                  
                  <div style={{ marginLeft: 40 }}>
                    {q.answers.map(ans => (
                      <div key={ans.answerId} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: 8,
                        padding: '12px 16px',
                        borderRadius: 12,
                        background: q.userAnswer === ans.answerText ? '#e6f7ff' : 'white',
                        border: q.userAnswer === ans.answerText ? '2px solid #1890ff' : '1px solid #f0f0f0'
                      }}>
                        <Tooltip title={ans.isCorrect ? 'Correct answer' : 'Incorrect answer'}>
                          {ans.isCorrect ? 
                            <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: 12, fontSize: 18 }} /> : 
                            <CloseCircleTwoTone twoToneColor="#f5222d" style={{ marginRight: 12, fontSize: 18 }} />
                          }
                        </Tooltip>
                        <span style={{ 
                          fontWeight: q.userAnswer === ans.answerText ? 600 : 400,
                          color: q.userAnswer === ans.answerText ? '#1890ff' : '#333',
                          flex: 1
                        }}>
                          {ans.answerText}
                        </span>
                        {q.userAnswer === ans.answerText && (
                          <Tag color="geekblue" style={{ marginLeft: 12, fontWeight: 600 }}>
                            Your Answer
                          </Tag>
                        )}
                      </div>
                    ))}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        )}
      </div>
    </div>
  );
}