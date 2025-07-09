import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, Row, Col, Tag, Spin, Divider, List, Tooltip } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
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

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 0' }}><Spin size="large" /></div>;
  if (!course) return <div>Completed course not found</div>;

  return (
    <div style={{ background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)', minHeight: '100vh', padding: '40px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <Card style={{ borderRadius: 16, marginBottom: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <Title level={2} style={{ marginBottom: 8 }}>{course.title}</Title>
          <Tag color="green" style={{ fontSize: 16, padding: '4px 16px', marginBottom: 12 }}>Completed</Tag>
          <Paragraph style={{ fontSize: 16, color: '#555' }}>{course.description}</Paragraph>
          <div style={{ margin: '16px 0' }}>
            <Tag color="blue" style={{ fontWeight: 600 }}>{course.topic}</Tag>
            <Tag color="purple" style={{ fontWeight: 600 }}>Final Score: {course.finalScore}</Tag>
            <Tag color="default" style={{ fontWeight: 600 }}>
              Completed Date: {course.completedDate ? new Date(course.completedDate).toLocaleString() : 'N/A'}
            </Tag>
          </div>
        </Card>

        <Card style={{ borderRadius: 16, marginBottom: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <Title level={4} style={{ marginBottom: 16 }}>Lessons</Title>
          <Row gutter={[24, 24]}>
            {(course.lessons || []).map(lesson => (
              <Col xs={24} sm={12} md={8} key={lesson.id}>
                <Card
                  title={lesson.title}
                  bordered={false}
                  style={{ borderRadius: 12, minHeight: 180, marginBottom: 12 }}
                  extra={lesson.isCompleted ? <Tag color="green">Completed</Tag> : <Tag color="default">Not Completed</Tag>}
                >
                  <Paragraph style={{ fontSize: 15, color: '#555' }}>{lesson.content || 'No content'}</Paragraph>
                  {lesson.videoUrl && (
                    <div style={{ borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                      <video width="100%" height="180" controls src={lesson.videoUrl} />
                    </div>
                  )}
                  <div style={{ marginTop: 8 }}>
                    <Tag color={lesson.isActive ? 'blue' : 'default'}>{lesson.isActive ? 'Active' : 'Inactive'}</Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {course.finalSurveyResult && (
          <Card style={{ borderRadius: 16, marginBottom: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
            <Title level={4} style={{ marginBottom: 8 }}>Final Survey Result</Title>
            <div style={{ marginBottom: 12 }}>
              <Tag color="blue">Survey: {course.finalSurveyResult.surveyName}</Tag>
              <Tag color="purple">Score: {course.finalSurveyResult.totalScore}</Tag>
              <Tag color={course.finalSurveyResult.recommendation === 'Pass' ? 'green' : 'red'}>
                {course.finalSurveyResult.recommendation}
              </Tag>
              <Tag color="default">Submitted: {course.finalSurveyResult.submittedAt ? new Date(course.finalSurveyResult.submittedAt).toLocaleString() : 'N/A'}</Tag>
            </div>
            <Divider />
            <List
              itemLayout="vertical"
              dataSource={course.finalSurveyResult.questions || []}
              renderItem={q => (
                <List.Item key={q.questionId}>
                  <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 16 }}>{q.questionText}</div>
                  <div style={{ marginLeft: 12 }}>
                    {q.answers.map(ans => (
                      <div key={ans.answerId} style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        <Tooltip title={ans.isCorrect ? 'Correct answer' : ''}>
                          {ans.isCorrect ? <CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: 6 }} /> : <CloseCircleTwoTone twoToneColor="#f5222d" style={{ marginRight: 6 }} />}
                        </Tooltip>
                        <span style={{ fontWeight: q.userAnswer === ans.answerText ? 700 : 400, color: q.userAnswer === ans.answerText ? '#1890ff' : undefined }}>
                          {ans.answerText}
                          {q.userAnswer === ans.answerText && <Tag color="geekblue" style={{ marginLeft: 8 }}>Your Answer</Tag>}
                        </span>
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
