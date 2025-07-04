import React, { useEffect, useState } from 'react';
import { SurveyAPI } from '../../apis/survey';
import { Card, List, Typography, Spin, Space, Divider, Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import StatusTag from '../../components/ui/StatusTag';
import { CreateButton, ActionButton } from '../../components/ui/Buttons';

const { Title, Paragraph, Text } = Typography;

export default function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultModal, setResultModal] = useState({ visible: false, result: null });
  const [currentSurveyId, setCurrentSurveyId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      try {
        const data = await SurveyAPI.getAllSurvey();
        setSurveys(data.filter(s => s.isActive));
      } catch (e) {
        setSurveys([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const cardStyles = {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f0f0f0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const cardHoverStyles = {
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
  };

  const handleViewResult = async (surveyId) => {
    try {
      setCurrentSurveyId(surveyId);
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.id && !user?.userId) {
        Modal.info({ title: 'Not logged in', content: 'Please log in to view your survey result.' });
        return;
      }
      const userId = user.id || user.userId;
      const resultArr = await SurveyAPI.getSurveyResult(surveyId, userId);
      const result = Array.isArray(resultArr) ? resultArr[0] : resultArr;
      setResultModal({ visible: true, result });
    } catch (error) {
      Modal.error({ title: 'Error', content: 'Could not fetch survey result.' });
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      margin: '0 auto', 
      padding: '32px 24px',
      minHeight: '100vh',
      backgroundColor: '#fafafa'
    }}>
      {/* Header Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '48px',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
      }}>
        <Title 
          level={1} 
          style={{ 
            marginBottom: '8px',
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Available Surveys
        </Title>
        <Paragraph 
          style={{ 
            fontSize: '16px', 
            color: '#666',
            marginBottom: '0',
            lineHeight: '1.6'
          }}
        >
          Participate in our active surveys and share your valuable feedback
        </Paragraph>
      </div>

      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 20px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
        }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: '#666' }}>
            Loading surveys...
          </div>
        </div>
      ) : (
        <List
          grid={{ gutter: [16, 24], column: 1 }}
          dataSource={surveys}
          locale={{ 
            emptyText: (
              <div style={{ 
                padding: '60px 20px', 
                textAlign: 'center',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
              }}>
                <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Title level={4} style={{ color: '#999', marginBottom: '8px' }}>
                  No Active Surveys
                </Title>
                <Text style={{ color: '#666' }}>
                  There are currently no active surveys available. Please check back later.
                </Text>
              </div>
            )
          }}
          renderItem={(survey, index) => (
            <List.Item style={{ marginBottom: '0' }}>
              <Card 
                style={{
                  ...cardStyles,
                  background: 'white',
                  overflow: 'hidden'
                }}
                bodyStyle={{ padding: '28px' }}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, cardHoverStyles);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = cardStyles.boxShadow;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Survey Header */}
                <div style={{ marginBottom: '20px' }}>
                  <Title 
                    level={3} 
                    style={{ 
                      marginBottom: '12px',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: '#262626',
                      lineHeight: '1.3'
                    }}
                  >
                    {survey.surveyName}
                  </Title>
                  
                  <Paragraph 
                    ellipsis={{ rows: 2, tooltip: survey.description }}
                    style={{ 
                      fontSize: '15px',
                      color: '#595959',
                      lineHeight: '1.6',
                      marginBottom: '0'
                    }}
                  >
                    {survey.description}
                  </Paragraph>
                </div>

                <Divider style={{ margin: '20px 0' }} />

                {/* Survey Stats & Actions */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <Space size="large" wrap>
                    <StatusTag 
                      color={survey.isActive ? 'green' : 'red'}
                      style={{ 
                        fontSize: '13px',
                        fontWeight: '500',
                        padding: '4px 12px',
                        borderRadius: '20px'
                      }}
                    >
                      <CheckCircleOutlined style={{ marginRight: '4px' }} />
                      {survey.isActive ? 'Active' : 'Inactive'}
                    </StatusTag>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      <FileTextOutlined style={{ marginRight: '6px', color: '#1890ff' }} />
                      <Text strong style={{ color: '#262626' }}>
                        {survey.surveyQuestions?.length || 0}
                      </Text>
                      <Text style={{ marginLeft: '4px', color: '#666' }}>
                        {survey.surveyQuestions?.length === 1 ? 'Question' : 'Questions'}
                      </Text>
                    </div>
                  </Space>
                  
                  <div style={{ display: 'flex', gap: 12 }}>
                    <CreateButton 
                      onClick={() => navigate(`/survey/do/${survey.surveyId}`)}
                      style={{ 
                        color: 'white',
                        height: '44px', 
                        padding: '0 32px',
                        fontSize: '15px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#0284c7';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(24, 144, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.2)';
                      }}
                    >
                      Take Survey
                    </CreateButton>
                    <CreateButton 
                      onClick={() => handleViewResult(survey.surveyId)}
                      style={{
                        color: 'white',
                        height: '44px',
                        padding: '0 32px',
                        fontSize: '15px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        background: 'linear-gradient(135deg, rgb(102, 234, 227) 0%, rgb(55, 168, 93) 100%)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#0284c7';
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(24, 144, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgb(102, 234, 227) 0%, rgb(55, 168, 93) 100%)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.2)';
                      }}
                    >
                      View Result
                    </CreateButton>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
      {/* Modal hiển thị kết quả khảo sát */}
      <Modal
        open={resultModal.visible}
        title="Survey Result"
        onCancel={() => { setResultModal({ visible: false, result: null }); setCurrentSurveyId(null); }}
        footer={null}
        width={700}
      >
        {resultModal.result && resultModal.result.surveyId === currentSurveyId ? (
          <div>
            <Title level={4}>{resultModal.result.surveyName}</Title>
            <Paragraph><b>Executed By:</b> {resultModal.result.excutedBy}</Paragraph>
            <Paragraph><b>Submitted At:</b> {resultModal.result.submittedAt ? new Date(resultModal.result.submittedAt).toLocaleString() : ''}</Paragraph>
            <Paragraph><b>Total Score:</b> {resultModal.result.totalScore}</Paragraph>
            <Paragraph><b>Recommendation:</b> {resultModal.result.recommendation}</Paragraph>
            <Divider />
            <Title level={5}>Questions & Answers</Title>
            <List
              dataSource={resultModal.result.questions || []}
              renderItem={q => (
                <List.Item style={{ display: 'block' }}>
                  <div style={{ marginBottom: 4 }}><b>{q.questionText}</b></div>
                  {/* Hiển thị đáp án user đã chọn */}
                  {q.userAnswer && (
                    <div style={{ marginLeft: 16, marginBottom: 8 }}>
                      <Text type="success" style={{ fontWeight: 600 }}>
                        Your answer: {q.userAnswer}
                      </Text>
                    </div>
                  )}
                  <ul style={{ marginLeft: 16, marginBottom: 0 }}>
                    {q.answers?.map((a, cidx) => (
                      <li
                        key={a.answerId}
                        style={{
                          background: q.userAnswer === a.answerText ? '#e6f7ff' : '#fff',
                          border: q.userAnswer === a.answerText ? '2px solid #1890ff' : '1px solid #e2e8e0',
                          borderRadius: 6,
                          margin: '8px 0',
                          padding: '10px 16px',
                          fontWeight: q.userAnswer === a.answerText ? 600 : 400,
                          color: '#4a5568',
                          listStyle: 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span>{String.fromCharCode(65 + cidx)}. {a.answerText}</span>
                        {typeof a.score === 'number' && (
                          <span style={{ color: '#888', marginLeft: 8 }}>(Score: {a.score})</span>
                        )}
                        {a.isCorrect && (
                          <StatusTag color="green" style={{ marginLeft: 8 }}>Correct</StatusTag>
                        )}
                      </li>
                    ))}
                  </ul>
                </List.Item>
              )}
              locale={{ emptyText: 'No questions' }}
            />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 0',
              background: 'linear-gradient(90deg, #f8fafc 0%, #e0e7ef 100%)',
              borderRadius: '12px',
              margin: '24px 0'
            }}
          >
            <span style={{ fontSize: 40, marginBottom: 12, color: '#bfbfbf' }}>😶</span>
            <Typography.Paragraph
              style={{
                fontSize: 18,
                color: '#888',
                fontWeight: 500,
                textAlign: 'center',
                margin: 0
              }}
            >
              You haven't taken this survey yet.
            </Typography.Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
}