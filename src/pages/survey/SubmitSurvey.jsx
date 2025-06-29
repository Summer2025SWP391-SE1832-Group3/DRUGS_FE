import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SurveyAPI } from '../../apis/survey';
import { Card, Typography, Radio, Button, Spin, message } from 'antd';

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
      navigate('/surveyList');
    } catch (e) {
      message.error('Failed to submit survey.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />;
  if (!survey) return null;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 24 }}>
      <Card bordered>
        <Typography.Title level={3}>{survey.surveyName}</Typography.Title>
        <Typography.Paragraph>{survey.description}</Typography.Paragraph>
        {survey.surveyQuestions && survey.surveyQuestions.length > 0 ? (
          <>
            {survey.surveyQuestions.map((q, idx) => (
              <div key={q.questionId} style={{ marginBottom: 32 }}>
                <Typography.Text strong>{idx + 1}. {q.questionText}</Typography.Text>
                <Radio.Group
                  onChange={e => handleChange(q.questionId, e.target.value)}
                  value={answers[q.questionId]}
                  style={{ display: 'block', marginTop: 8 }}
                >
                  {q.answersDto?.map(a => (
                    <Radio key={a.answerId} value={a.answerId} style={{ display: 'block', margin: '6px 0' }}>
                      {a.answerText}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            ))}
            <Button type="primary" onClick={handleSubmit} loading={submitting} style={{ marginTop: 16 }}>
              Submit
            </Button>
          </>
        ) : (
          <Typography.Text type="secondary">No questions found for this survey.</Typography.Text>
        )}
      </Card>
    </div>
  );
}
