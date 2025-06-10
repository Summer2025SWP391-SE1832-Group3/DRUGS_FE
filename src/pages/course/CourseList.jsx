import React from 'react'
import { Card, Row, Col, Button } from 'antd'
import courses from '../../data/course'

export default function CourseList() {
  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Row gutter={[24, 24]}>
        {courses.map((course) => (
          <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
            <Card
              hoverable
              style={{ 
                height: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column'
              }}
              bodyStyle={{ 
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1
              }}
              cover={
                <div style={{ position: 'relative' }}>
                  <img 
                    alt={course.title} 
                    src={course.image} 
                    style={{ 
                      height: 200, 
                      objectFit: 'cover',
                      width: '100%'
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    padding: '4px 12px',
                    borderBottomLeftRadius: '8px',
                    fontSize: '14px'
                  }}>
                    Ages: {course.targetAgeGroup}
                  </div>
                </div>
              }
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between'
              }}>
                <div>
                  <h5 style={{ 
                    fontSize: '18px', 
                    marginBottom: '12px',
                    color: '#1a1a1a',
                    fontWeight: '600'
                  }}>
                    {course.title}
                  </h5>
                  <p style={{ 
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    marginBottom: '16px'
                  }}>
                    {course.description}
                  </p>
                </div>
                <Button 
                  type="primary" 
                  block
                  style={{ 
                    height: '40px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    background: '#1890ff',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#40a9ff';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#1890ff';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  View Details
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
