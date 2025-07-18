import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Collapse,
  Row,
  Col,
  Tag,
  message,
  Checkbox,
  Spin
} from 'antd';
import {
  PlayCircleOutlined,
  BookOutlined,
  ClockCircleOutlined,
  UserOutlined,
  StarFilled
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { CourseAPI } from '../../apis/course';
import { ActionButton } from '../../components/ui/Buttons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export default function CourseDetailsMember() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonProgress, setLessonProgress] = useState({});
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await CourseAPI.getCourseById(id);
        setCourse(data);
        if (data.lessions && Array.isArray(data.lessions)) {
          setLessonProgress(
            data.lessions.reduce((acc, lesson, idx) => {
              acc[idx] = { isCompleted: lesson.isCompleted };
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

    const fetchProgress = async () => {
      try {
        const data = await CourseAPI.getCourseProgress(id);
        setProgress(data);
      } catch {
        setProgress(null);
      }
    };

    fetchCourse();
    fetchProgress();
  }, [id]);

  const handleLessonCompleteToggle = async (lessonId, idx, checked) => {
    try {
      await CourseAPI.updateLessonProgress(lessonId, checked);
      setLessonProgress((prev) => ({
        ...prev,
        [idx]: { isCompleted: checked }
      }));
      message.success(checked ? 'Marked as completed!' : 'Marked as not completed!');
    } catch {
      message.error('Failed to update lesson progress!');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 0' }}><Spin size="large" /></div>;
  if (!course) return <div>Course not found</div>;

  const welcomeText = 'Take a look at the science of how addictive drugs affect your body and why substance addiction can be so difficult to treat.';
  const author = 'Judy Grisel From TED Ed';
  const type = course?.topic || '';
  const duration = '30 minutes to complete';
  const lessonCount = course?.lessions?.length || 0;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '0',
      position: 'relative'
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
          {(progress || course) && (
            <Tag color={
              (progress?.isCompleted ?? course.isCompleted)
                ? 'green' : 'blue'
            } style={{ fontSize: 16, padding: '4px 16px' }}>
              {(progress?.isCompleted ?? course.isCompleted)
                ? 'Completed' : 'In Progress'}
            </Tag>
          )}
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
              style={{ backgroundColor: 'transparent' }}
              expandIconPosition="end"
            >
              {(course.lessions || []).map((lesson, idx) => (
                <Panel
                  header={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: '16px' }}>
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
                          <PlayCircleOutlined style={{ color: 'white', fontSize: '18px' }} />
                        </div>
                        <div>
                          <Text style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', display: 'block' }}>
                            Lesson {idx + 1}: {lesson.title}
                          </Text>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {lessonProgress[idx]?.isCompleted && (
                          <Tag color="green" style={{ fontSize: 14, fontWeight: 600, borderRadius: 8 }}>
                            Completed
                          </Tag>
                        )}
                        <Checkbox
                          checked={lessonProgress[idx]?.isCompleted}
                          onChange={e => handleLessonCompleteToggle(lesson.id, idx, e.target.checked)}
                          style={{ marginLeft: 8 }}
                        >
                          Mark as completed
                        </Checkbox>
                      </div>
                    </div>
                  }
                  key={lesson.id}
                  style={{
                    backgroundColor: '#fff',
                    marginBottom: '16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ padding: '0 16px 16px 16px' }}>
                    <Paragraph style={{ fontSize: '16px', color: '#4a5568', lineHeight: '1.6', marginBottom: 16 }}>
                      {lesson.content || ''}
                    </Paragraph>
                    {lesson.videoUrl && (
                      <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', marginBottom: 16 }}>
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
                    )}
                  </div>
                </Panel>
              ))}
            </Collapse>
          </Card>
          {/* Final Survey Exam Section */}
          {course.finalExamSurvey && (
            <Card
              style={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                marginTop: 32,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                overflow: "hidden"
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '24px',
                margin: '-24px -24px 24px -24px'
              }}>
                <Title level={3} style={{
                  color: 'white',
                  marginBottom: 0,
                  fontSize: '28px',
                  fontWeight: '700'
                }}>
                  Final Survey Exam
                </Title>
              </div>
              <div style={{ marginBottom: 12 }}>
                <Tag color={course.finalExamSurvey.isActive ? 'green' : 'default'}>
                  {course.finalExamSurvey.isActive ? 'Active' : 'Inactive'}
                </Tag>
              </div>
              <Paragraph style={{ fontSize: '16px', color: '#4a5568', marginBottom: 8 }}>
                <b>{course.finalExamSurvey.surveyName}</b>
              </Paragraph>
              <Paragraph style={{ fontSize: '15px', color: '#4a5568', marginBottom: 16 }}>
                {course.finalExamSurvey.description}
              </Paragraph>
              {/* Nút Take Final Exam */}
              <div style={{ marginTop: 16 }}>
                <ActionButton
                  disabled={!(course.lessions && course.lessions.length > 0 && course.lessions.every(l => l.isCompleted))}
                  style={{
                    padding: '12px 32px',
                    background: course.lessions && course.lessions.length > 0 && course.lessions.every(l => l.isCompleted) ? '#1890ff' : '#ccc',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: course.lessions && course.lessions.length > 0 && course.lessions.every(l => l.isCompleted) ? 'pointer' : 'not-allowed',
                    opacity: course.lessions && course.lessions.length > 0 && course.lessions.every(l => l.isCompleted) ? 1 : 0.7
                  }}
                  onClick={() => {
                    if (course.lessions && course.lessions.length > 0 && course.lessions.every(l => l.isCompleted)) {
                      window.location.href = `/survey/do/${course.finalExamSurvey.surveyId}`;
                    }
                  }}
                >
                  Take Final Exam
                </ActionButton>
                {!(course.lessions && course.lessions.length > 0 && course.lessions.every(l => l.isCompleted)) && (
                  <div style={{ color: '#f5222d', marginTop: 8, fontWeight: 500 }}>
                    You must complete all lessons before taking the final exam.
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
