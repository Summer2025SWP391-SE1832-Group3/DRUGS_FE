import React, { useEffect, useState } from 'react';
import { SurveyAPI } from '../../apis/survey';
import { Card, List, Tag, Typography, Spin, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
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

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <Typography.Title level={2}>Available Surveys</Typography.Title>
      {loading ? (
        <Spin size="large" />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={surveys}
          locale={{ emptyText: 'No active surveys found.' }}
          renderItem={survey => (
            <List.Item>
              <Card bordered>
                <Typography.Title level={4} style={{ marginBottom: 4 }}>{survey.surveyName}</Typography.Title>
                <Typography.Paragraph ellipsis={{ rows: 2 }}>{survey.description}</Typography.Paragraph>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <Tag color={survey.isActive ? 'green' : 'red'}>
                      {survey.isActive ? 'Active' : 'Inactive'}
                    </Tag>
                    <span style={{ marginLeft: 16 }}>
                      <b>Questions:</b> {survey.surveyQuestions?.length || 0}
                    </span>
                  </div>
                  <Button type="primary" onClick={() => navigate(`/survey/do/${survey.surveyId}`)}>
                    Take Survey
                  </Button>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}

