import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SurveyAPI } from '../../apis/survey';
import { Card, Typography, List, Divider, Spin, Button, Row, Col, Space } from 'antd';
import { ClockCircleOutlined, UserOutlined, TrophyOutlined, BulbOutlined, LeftOutlined, BookOutlined } from '@ant-design/icons';
import StatusTag from '../../components/ui/StatusTag';

const { Title, Paragraph, Text } = Typography;

export default function SurveyResult() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hàm để extract topic từ recommendation
    const extractTopicFromRecommendation = (recommendation) => {
        if (!recommendation) return null;
        
        // Các topic có thể có
        const topics = ['Awareness', 'Prevention', 'Refusal'];
        
        // Chuyển recommendation về lowercase để so sánh
        const lowerRecommendation = recommendation.toLowerCase();
        
        for (const topic of topics) {
            // Kiểm tra nhiều pattern khác nhau
            if (lowerRecommendation.includes(topic.toLowerCase()) ||
                lowerRecommendation.includes(topic.toLowerCase() + ' course') ||
                lowerRecommendation.includes(topic.toLowerCase() + ' courses') ||
                lowerRecommendation.includes('recommend: ' + topic.toLowerCase()) ||
                lowerRecommendation.includes('recommendation: ' + topic.toLowerCase())) {
                return topic;
            }
        }
        
        return null;
    };

    // Hàm để navigate đến course với topic
    const navigateToCourseWithTopic = (recommendation) => {
        const topic = extractTopicFromRecommendation(recommendation);
        console.log('Recommendation:', recommendation);
        console.log('Extracted topic:', topic);
        
        if (topic) {
            if (topic && topic.toLowerCase().includes('refusal')) {
                // Nếu topic là Refusal, navigate đến consultants
                navigate('/consultants');
            } else {
                // Các topic khác navigate đến courseList với topic
                navigate(`/courseList/${encodeURIComponent(topic)}`);
            }
        } else {
            // Nếu không tìm thấy topic cụ thể, navigate đến courseList chung
            navigate('/courseList');
        }
    };

    useEffect(() => {
        const fetchResult = async () => {
            setLoading(true);
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const userId = user?.id || user?.userId;
                const resultArr = await SurveyAPI.getSurveyResult(id, userId);
                setResult(Array.isArray(resultArr) ? resultArr[0] : resultArr);
            } catch (e) {
                setResult(null);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [id]);

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

    if (!result) {
  return (
            <div style={{
                textAlign: 'center',
                marginTop: '10vh',
                padding: '2rem'
            }}>
                <Title level={3} type="secondary">No result found</Title>
                <Button
                    type="primary"
                    icon={<LeftOutlined />}
                    onClick={() => navigate('/surveyList')}
                    style={{ marginTop: '1rem' }}
                >
                    Back to Survey List
                </Button>
            </div>
        );
    }

    return (
        <div style={{
            width: "100%",
            margin: '0 auto',
            padding: '2rem 1rem',
            minHeight: '100vh',
            background: '#f5f5f5'
        }}>
            {/* Header Card */}
            <Card
                style={{
                    marginBottom: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    {/* Back Button */}
                    <div style={{
                        textAlign: 'left',
                    }}>
                        <Button
                            type="default"
                            size="large"
                            icon={<LeftOutlined />}
                            onClick={() => {
                              if (result.surveyType === 'CourseTest') {
                                const user = JSON.parse(localStorage.getItem('user'));
                                const userId = user?.id || user?.userId;
                                navigate(`/memberCourses/${userId}`);
                              } else {
                                navigate('/surveyList');
                              }
                            }}
                            style={{
                                height: '40px',
                                paddingLeft: '2rem',
                                paddingRight: '2rem',
                                fontSize: '1rem',
                                borderRadius: '8px',
                                fontWeight: 500
                            }}
                        >
                            {result.surveyType === 'CourseTest' ? 'Back to My Courses' : 'Back to Survey List'}
                        </Button>
                    </div>
                    <Title
                        level={2}
                        style={{
                            margin: 0,
                            color: '#1890ff',
                            fontSize: '1.75rem',
                            fontWeight: 600
                        }}
                    >
                        {result.surveyName}
                    </Title>
                </div>

                <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12}>
                        <Space align="start" style={{ width: '100%' }}>
                            <UserOutlined style={{ color: '#52c41a', fontSize: '1.1rem' }} />
                            <div>
                                <Text strong style={{ color: '#595959' }}>Executed By</Text>
                                <br />
                                <Text style={{ fontSize: '1rem' }}>{result.excutedBy}</Text>
                            </div>
                        </Space>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Space align="start" style={{ width: '100%' }}>
                            <ClockCircleOutlined style={{ color: '#1890ff', fontSize: '1.1rem' }} />
                            <div>
                                <Text strong style={{ color: '#595959' }}>Submitted At</Text>
                                <br />
                                <Text style={{ fontSize: '1rem' }}>
                                    {result.submittedAt ? new Date(result.submittedAt).toLocaleString() : 'N/A'}
                                </Text>
                            </div>
                        </Space>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Space align="start" style={{ width: '100%' }}>
                            <TrophyOutlined style={{ color: '#faad14', fontSize: '1.1rem' }} />
                            <div>
                                <Text strong style={{ color: '#595959' }}>Total Score</Text>
                                <br />
                                <Text
                                    style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 600,
                                        color: '#fa541c'
                                    }}
                                >
                                    {result.totalScore}
                                </Text>
                            </div>
                        </Space>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Space align="start" style={{ width: '100%' }}>
                            <BulbOutlined style={{ color: '#722ed1', fontSize: '1.1rem' }} />
                            <div style={{ width: '100%' }}>
                                <Text strong style={{ color: '#595959' }}>{result.surveyType === 'CourseTest' ? 'Result' : 'Recommendation'}</Text>
                                <br />
                                <Text style={{ fontSize: '1rem' }}>{result.surveyType === "CourseTest" ? result.resultStatus : result.recommendation}</Text>
                                
                                {/* Thêm button navigate đến course nếu có recommendation và không phải CourseTest */}
                                {result.surveyType !== 'CourseTest' && 
                                 result.recommendation && 
                                 extractTopicFromRecommendation(result.recommendation) && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <Space size="small" style={{ width: '100%' }}>
                                            {/* Button cho courses */}
                                            <Button
                                                type="primary"
                                                size="small"
                                                icon={<BookOutlined />}
                                                onClick={() => {
                                                    const topic = extractTopicFromRecommendation(result.recommendation);
                                                    if (topic) {
                                                        navigate(`/courseList/${encodeURIComponent(topic)}`);
                                                    } else {
                                                        navigate('/courseList');
                                                    }
                                                }}
                                                title={`View courses related to ${extractTopicFromRecommendation(result.recommendation)} topic`}
                                                style={{
                                                    borderRadius: '6px',
                                                    fontSize: '0.9rem',
                                                    height: '32px',
                                                    background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                                                    border: 'none',
                                                    boxShadow: '0 2px 8px rgba(24,144,255,0.3)',
                                                    transition: 'all 0.3s ease',
                                                    flex: 1
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(24,144,255,0.4)';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(24,144,255,0.3)';
                                                }}
                                            >
                                                View Recommended Courses
                                            </Button>
                                            
                                            {/* Button cho consultants nếu có refusal */}
                                            {result.recommendation.toLowerCase().includes('refusal') && (
                                                <Button
                                                    type="default"
                                                    size="small"
                                                    icon={<UserOutlined />}
                                                    onClick={() => navigate('/consultants')}
                                                    title="Get consultation from experts"
                                                    style={{
                                                        borderRadius: '6px',
                                                        fontSize: '0.9rem',
                                                        height: '32px',
                                                        background: 'rgba(255,255,255,0.9)',
                                                        border: '2px solid #1890ff',
                                                        color: '#1890ff',
                                                        boxShadow: '0 2px 8px rgba(24,144,255,0.2)',
                                                        transition: 'all 0.3s ease',
                                                        flex: 1
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(24,144,255,0.3)';
                                                        e.currentTarget.style.background = '#1890ff';
                                                        e.currentTarget.style.color = 'white';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(24,144,255,0.2)';
                                                        e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                                                        e.currentTarget.style.color = '#1890ff';
                                                    }}
                                                >
                                                    Get Expert Consultation
                                                </Button>
                                            )}
                                        </Space>
                                    </div>
                                )}
                            </div>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Questions & Answers Card */}
            <Card
                title={
                    <Title
                        level={4}
                        style={{
                            margin: 0,
                            color: '#262626',
                            fontSize: '1.25rem'
                        }}
                    >
                        Questions & Answers
                    </Title>
                }
                style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
            >
                <List
                    dataSource={result.questions || []}
                    renderItem={(q, index) => (
                        <List.Item
                            style={{
                                display: 'block',
                                padding: '1.5rem 0',
                                borderBottom: index === (result.questions?.length - 1) ? 'none' : '1px solid #f0f0f0'
                            }}
                        >
                            <div style={{
                                marginBottom: '1rem',
                                padding: '0.75rem',
                                background: '#fafafa',
                                borderRadius: '8px',
                                borderLeft: '4px solid #1890ff'
                            }}>
                                <Text
                                    strong
                                    style={{
                                        fontSize: '1.1rem',
                                        color: '#262626',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    Q{index + 1}: {q.questionText}
                                </Text>
                            </div>

                            {/* Hiển thị đáp án user đã chọn */}
                            {q.userAnswer && (
                              <div style={{ marginLeft: '1rem', marginBottom: 8 }}>
                                <Text type="success" style={{ fontWeight: 600 }}>
                                  Your answer: {q.userAnswer}
                                </Text>
                              </div>
                            )}

                            <div style={{ marginLeft: '1rem' }}>
                                {q.answers?.map((a, answerIndex) => (
                                    <div
                                        key={a.answerId}
                                        style={{
                                            marginBottom: '0.75rem',
                                            padding: '0.75rem',
                                            background: q.userAnswer === a.answerText ? '#e6f7ff' : '#fff',
                                            border: q.userAnswer === a.answerText ? '2px solid #1890ff' : '1px solid #e8e8e8',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            flexWrap: 'wrap',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <Text style={{ fontSize: '1rem', lineHeight: '1.5', fontWeight: q.userAnswer === a.answerText ? 600 : 400 }}>
                                                {String.fromCharCode(65 + answerIndex)}. {a.answerText}
                                            </Text>
                                        </div>

                                        <Space>
                                            {typeof a.score === 'number' && (
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        fontSize: '0.9rem',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    Score: {a.score}
                                                </Text>
                                            )}
                                            {a.isCorrect && (
                                                <StatusTag color="green">Correct</StatusTag>
                                            )}
                                        </Space>
                                    </div>
                                ))}
                            </div>
                        </List.Item>
                    )}
                    locale={{ emptyText: 'No questions available' }}
                />
            </Card>


        </div>
    );
}