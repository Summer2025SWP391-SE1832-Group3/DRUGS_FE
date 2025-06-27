import React from 'react'
import { useParams } from 'react-router-dom'
import courses from '../../data/course'
import { Typography, Card, List, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function CourseDetails() {
  const { id } = useParams();
  const course = courses.find(c => c.id === Number(id));

  if (!course) return <div>Course not found</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(34,76,139,0.08)' }}>
      <Title level={2} style={{ color: '#2c3e50', fontWeight: 700 }}>{course.title}</Title>
      <Paragraph style={{ fontSize: 16 }}>{course.description}</Paragraph>
      <Divider />
      <Title level={4}>What you'll learn</Title>
      <ul style={{ fontSize: 15, marginBottom: 16 }}>
        <li>Add interactivity to web pages with Javascript</li>
        <li>Use the Document Object Model (DOM) to modify pages</li>
        <li>Describe the basics of Cascading Style Sheets (CSS3)</li>
        <li>Apply responsive design to enable page to be viewed by various devices</li>
        <li><b>Phòng chống ma túy:</b> Nhận biết tác hại, kỹ năng phòng tránh, hỗ trợ cộng đồng</li>
      </ul>
      <Divider />
      <Title level={4}>Lessons</Title>
      <List
        itemLayout="vertical"
        dataSource={course.lessons}
        renderItem={(lesson, idx) => (
          <Card key={idx} style={{ marginBottom: 24 }}>
            <Title level={5}>{lesson.title}</Title>
            <div style={{ marginBottom: 12 }}>
              <iframe
                width="100%"
                height="315"
                src={lesson.videoUrl}
                title={lesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <Divider orientation="left">Questions</Divider>
            <List
              dataSource={lesson.questions}
              renderItem={(q, qidx) => (
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Q{qidx + 1}: {q.question}</Text>
                  <ul style={{ marginTop: 4 }}>
                    {q.choices.map((choice, cidx) => (
                      <li key={cidx} style={{ color: cidx === q.answer ? '#1890ff' : undefined }}>{choice}</li>
                    ))}
                  </ul>
                </div>
              )}
            />
          </Card>
        )}
      />
    </div>
  )
}
