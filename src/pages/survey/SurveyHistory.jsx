import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Collapse, Spin, Empty, Tag, Space, Divider, Pagination } from 'antd';
import { SurveyAPI } from '../../apis/survey';

const { Title, Paragraph, Text } = Typography;

export default function SurveyHistory() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id || user?.userId;
        const data = await SurveyAPI.userAddictionSurvey(userId);
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Calculate pagination
  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = results.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (!results.length) {
    return (
      <Card 
        style={{ 
          maxWidth: 800, 
          margin: '40px auto', 
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Empty 
          description={
            <Text style={{ fontSize: 16, color: '#8c8c8c' }}>
              No survey history found
            </Text>
          } 
          style={{ padding: '60px 0' }} 
        />
      </Card>
    );
  }

  return (
    <div style={{ 
      width: "100%",
      margin: '0 auto', 
      padding: '32px 24px',
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
      <Card 
        style={{ 
          marginBottom: 32,
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          border: 'none'
        }}
      >
        <Title 
          level={2} 
          style={{ 
            textAlign: 'center', 
            marginBottom: 8,
            color: '#1890ff',
            fontWeight: 600
          }}
        >
          Survey History
        </Title>
        <Text 
          style={{ 
            display: 'block', 
            textAlign: 'center', 
            color: '#666',
            fontSize: 16,
            marginBottom: 0
          }}
        >
          Your completed surveys and results
        </Text>
        <div style={{ 
          textAlign: 'center', 
          marginTop: 16,
          color: '#8c8c8c',
          fontSize: 14
        }}>
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} surveys
        </div>
      </Card>

      <Card 
        style={{ 
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: 'none',
          overflow: 'hidden'
        }}
      >
        <Collapse 
          accordion
          style={{ 
            backgroundColor: 'transparent',
            border: 'none'
          }}
        >
          {currentPageData.map((result, index) => (
            <Collapse.Panel
              header={
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingRight: 24
                }}>
                  <div style={{ flex: 1 }}>
                    <Text 
                      strong 
                      style={{ 
                        fontSize: 16, 
                        color: '#262626',
                        display: 'block',
                        marginBottom: 4
                      }}
                    >
                      {result.surveyName}
                    </Text>
                    <Space size={16}>
                      <Text style={{ color: '#8c8c8c', fontSize: 14 }}>
                        {result.submittedAt ? new Date(result.submittedAt).toLocaleString() : ''}
                      </Text>
                      <Tag 
                        color={result.totalScore > 50 ? 'volcano' : result.totalScore > 30 ? 'orange' : 'green'}
                        style={{ 
                          fontSize: 13,
                          fontWeight: 500,
                          borderRadius: 6,
                          padding: '2px 8px'
                        }}
                      >
                        Score: {result.totalScore}
                      </Tag>
                    </Space>
                  </div>
                </div>
              }
              key={result.surveyResultId}
              style={{
                marginBottom: index < currentPageData.length - 1 ? 16 : 0,
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                backgroundColor: '#fff'
              }}
            >
              <div style={{ padding: '12px 0' }}>
                <Card 
                  size="small"
                  style={{ 
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: 8,
                    marginBottom: 24
                  }}
                >
                  <Paragraph style={{ 
                    margin: 0,
                    fontSize: 15,
                    lineHeight: 1.6
                  }}>
                    <Text strong style={{ color: '#52c41a' }}>Recommendation:</Text>
                    <br />
                    <Text style={{ color: '#262626' }}>{result.recommendation}</Text>
                  </Paragraph>
                </Card>

                <Divider style={{ margin: '20px 0' }}>
                  <Text style={{ color: '#8c8c8c', fontSize: 14 }}>Questions & Answers</Text>
                </Divider>

                <List
                  dataSource={result.questions || []}
                  renderItem={(q, qIndex) => (
                    <List.Item 
                      style={{ 
                        display: 'block',
                        padding: '16px 0',
                        borderBottom: qIndex < (result.questions?.length || 0) - 1 ? '1px solid #f0f0f0' : 'none'
                      }}
                    >
                      <div style={{ marginBottom: 16 }}>
                        <Text 
                          strong 
                          style={{ 
                            fontSize: 15,
                            color: '#262626',
                            display: 'block',
                            lineHeight: 1.5
                          }}
                        >
                          Q{qIndex + 1}: {q.questionText}
                        </Text>
                      </div>
                      
                      {q.userAnswer && (
                        <div style={{ 
                          marginBottom: 16,
                          padding: '8px 16px',
                          backgroundColor: '#e6f7ff',
                          borderRadius: 6,
                          border: '1px solid #91d5ff'
                        }}>
                          <Text 
                            style={{ 
                              fontWeight: 500,
                              color: '#1890ff',
                              fontSize: 14
                            }}
                          >
                            Your answer: {q.userAnswer}
                          </Text>
                        </div>
                      )}
                      
                      <div style={{ marginLeft: 0 }}>
                        {q.answers?.map((a, cidx) => (
                          <div
                            key={a.answerId}
                            style={{
                              background: q.userAnswer === a.answerText ? '#e6f7ff' : '#fafafa',
                              border: q.userAnswer === a.answerText ? '2px solid #1890ff' : '1px solid #e8e8e8',
                              borderRadius: 8,
                              margin: '8px 0',
                              padding: '12px 16px',
                              fontWeight: q.userAnswer === a.answerText ? 500 : 400,
                              color: '#4a5568',
                              transition: 'all 0.3s ease',
                              cursor: 'default'
                            }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between' 
                            }}>
                              <span style={{ fontSize: 14 }}>
                                {String.fromCharCode(65 + cidx)}. {a.answerText}
                              </span>
                              <Space>
                                {typeof a.score === 'number' && (
                                  <Tag 
                                    color="blue" 
                                    size="small"
                                    style={{ fontSize: 12 }}
                                  >
                                    Score: {a.score}
                                  </Tag>
                                )}
                                {a.isCorrect && (
                                  <Tag 
                                    color="success" 
                                    size="small"
                                    style={{ fontSize: 12 }}
                                  >
                                    Correct
                                  </Tag>
                                )}
                              </Space>
                            </div>
                          </div>
                        ))}
                      </div>
                    </List.Item>
                  )}
                  locale={{ emptyText: 'No questions available' }}
                />
              </div>
            </Collapse.Panel>
          ))}
        </Collapse>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card 
          style={{ 
            marginTop: 24,
            borderRadius: 12,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            border: 'none'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '16px 0'
          }}>
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => 
                `${range[0]}-${range[1]} of ${total} surveys`
              }
              style={{
                fontSize: 14
              }}
            />
          </div>
        </Card>
      )}
    </div>
  );
}