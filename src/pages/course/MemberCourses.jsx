import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Empty, Tag, Spin, Button } from 'antd';
import { CourseAPI } from '../../apis/course';
import { useNavigate } from 'react-router-dom';

export default function MemberCourses() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState({ inProgress: [], completed: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await CourseAPI.memberCourses();
        setCourses(data || { inProgress: [], completed: [] });
      } catch {
        setCourses({ inProgress: [], completed: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div style={{ padding: '40px 20px', minHeight: '100vh', background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)' }}>
      <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        My Enrolled Courses
      </Typography.Title>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 80 }}><Spin size="large" /></div>
      ) : (
        <>
          <section style={{ marginBottom: 48 }}>
            <Typography.Title level={4} style={{ marginBottom: 24 }}>In Progress</Typography.Title>
            {courses.inProgress.length === 0 ? (
              <Empty description="No courses in progress" />
            ) : (
              <Row gutter={[24, 24]}>
                {courses.inProgress.map(course => (
                  <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                    <Card
                      title={course.title}
                      bordered={false}
                      style={{ borderRadius: 16, minHeight: 220 }}
                      extra={<Tag color="blue">In Progress</Tag>}
                    >
                      <Typography.Paragraph ellipsis={{ rows: 4 }}>
                        {course.description}
                      </Typography.Paragraph>
                      <div style={{ marginTop: 12 }}>
                        <Tag color="green">{course.topic}</Tag>
                        {course.isActive ? <Tag color="success">Active</Tag> : <Tag color="default">Inactive</Tag>}
                      </div>
                      <Button
                        type="primary"
                        style={{ marginTop: 16 }}
                        onClick={() => navigate(`/CourseDetailsMember/${course.id}`)}
                      >
                        View Course Details
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </section>
          <section>
            <Typography.Title level={4} style={{ marginBottom: 24 }}>Completed</Typography.Title>
            {courses.completed.length === 0 ? (
              <Empty description="No completed courses" />
            ) : (
              <Row gutter={[24, 24]}>
                {courses.completed.map(course => (
                  <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                    <Card
                      title={course.title}
                      bordered={false}
                      style={{ borderRadius: 16, minHeight: 220 }}
                      extra={<Tag color="purple">Completed</Tag>}
                    >
                      <Typography.Paragraph ellipsis={{ rows: 4 }}>
                        {course.description}
                      </Typography.Paragraph>
                      <div style={{ marginTop: 12 }}>
                        <Tag color="green">{course.topic}</Tag>
                        {course.isActive ? <Tag color="success">Active</Tag> : <Tag color="default">Inactive</Tag>}
                      </div>
                      <Button
                        type="primary"
                        style={{ marginTop: 16 }}
                        onClick={() => navigate(`/CourseDetailsMember/${course.id}`)}
                      >
                        View Course Details
                      </Button>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </section>
        </>
      )}
    </div>
  );
}
