import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SurveyAPI } from '../../apis/survey';
import { Card, Typography, Radio, Button, Spin, message, Divider } from 'antd';

const { Title, Paragraph, Text } = Typography;

export default function SubmitSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // { [questionId]: answerId }
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      setLoading(true);
      try {
        const data = await SurveyAPI.getSurveyById(id);
        setSurvey(data);
      } catch (e) {
        message.error('Failed to load survey');
        navigate('/surveyList');
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id, navigate]);

  const handleChange = (questionId, answerId) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    if (!survey?.surveyQuestions) return;
    // Check all questions answered
    const unanswered = survey.surveyQuestions.filter(q => !answers[q.questionId]);
    if (unanswered.length > 0) {
      message.warning('Please answer all questions before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      const submitAnswers = survey.surveyQuestions.map(q => ({
        questionId: q.questionId,
        answerId: answers[q.questionId]
      }));
      await SurveyAPI.submitSurvey(id, submitAnswers);
      message.success('Survey submitted successfully!');
      navigate(`/survey/result/${id}`);
    } catch (e) {
      message.error('Failed to submit survey.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!survey) return null;

  return (
    <div style={{ 
      width: "100%", 
      margin: '0 auto', 
      padding: '40px 24px',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <Card 
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: 'none'
        }}
        bodyStyle={{ padding: '48px' }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Title 
            level={2} 
            style={{ 
              marginBottom: 16,
              color: '#1f2937',
              fontSize: '30px',
              fontWeight: 600,
              lineHeight: 1.3
            }}
          >
            {survey.surveyName}
          </Title>
          {survey.description && (
            <Paragraph 
              style={{ 
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: 1.6,
                maxWidth: 600,
                margin: '0 auto'
              }}
            >
              {survey.description}
            </Paragraph>
          )}
        </div>

        <Divider style={{ margin: '40px 0' }} />

        {/* Questions Section */}
        {survey.surveyQuestions && survey.surveyQuestions.length > 0 ? (
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            {survey.surveyQuestions.map((q, idx) => (
              <Card
                key={q.questionId}
                size="small"
                style={{
                  marginBottom: 24,
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#fafafa'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Text 
                  strong 
                  style={{ 
                    fontSize: '18px',
                    color: '#374151',
                    display: 'block',
                    marginBottom: 16,
                    lineHeight: 1.4
                  }}
                >
                  {idx + 1}. {q.questionText}
                </Text>
                
                <Radio.Group
                  onChange={e => handleChange(q.questionId, e.target.value)}
                  value={answers[q.questionId]}
                  style={{ width: '100%' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {q.surveyAnswers?.map(a => (
                      <Radio 
                        key={a.answerId} 
                        value={a.answerId}
                        style={{
                          fontSize: '16px',
                          color: '#4b5563',
                          padding: '8px 12px',
                          margin: 0,
                          borderRadius: 6,
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          transition: 'all 0.2s ease',
                          lineHeight: 1.5
                        }}
                        className="survey-radio-option"
                      >
                        {a.answerText}
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>
              </Card>
            ))}
            
            {/* Submit Button */}
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Button 
                type="primary" 
                size="large"
                onClick={handleSubmit} 
                loading={submitting}
                style={{
                  height: 48,
                  minWidth: 160,
                  borderRadius: 8,
                  fontSize: '16px',
                  fontWeight: 500,
                  boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
                }}
              >
                Submit Survey
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Text 
              type="secondary" 
              style={{ 
                fontSize: '16px',
                color: '#9ca3af'
              }}
            >
              No questions found for this survey.
            </Text>
          </div>
        )}
      </Card>

      {/* Custom CSS for radio hover effects */}
      <style jsx>{`
        .survey-radio-option:hover {
          border-color: #3b82f6 !important;
          background-color: #f8faff !important;
        }
        .survey-radio-option .ant-radio-checked {
          border-color: #3b82f6;
        }
        .survey-radio-option .ant-radio-checked .ant-radio-inner {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}