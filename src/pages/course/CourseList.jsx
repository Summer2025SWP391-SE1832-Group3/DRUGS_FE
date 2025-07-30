import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Empty, Typography, Input, Button, message, Select, Spin, Modal } from 'antd'
import { CourseAPI } from '../../apis/course';
import { ActionButton } from '../../components/ui/Buttons';
import { useNavigate, useParams } from 'react-router-dom';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null); // Không set default value
  const [topics, setTopics] = useState(['All', 'Awareness', 'Prevention', 'Refusal']); // Có thể lấy động từ API nếu cần
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const navigate = useNavigate();
  const { topic } = useParams();

  // Khởi tạo selectedTopic từ URL params
  useEffect(() => {
    if (topic) {
      const decodedTopic = decodeURIComponent(topic);
      if (topics.includes(decodedTopic)) {
        setSelectedTopic(decodedTopic);
      } else {
        // Nếu topic không hợp lệ, reset về All và navigate về /courseList
        setSelectedTopic('All');
        navigate('/courseList');
      }
    } else {
      // Nếu không có topic trong URL, set về All
      setSelectedTopic('All');
    }
  }, [topic, topics, navigate]);

  useEffect(() => {
    // Chỉ fetch courses khi selectedTopic đã được khởi tạo đúng
    if (selectedTopic !== null) {
      const fetchCourses = async () => {
        try {
          if (selectedTopic === 'All') {
            const data = await CourseAPI.getAllCourses();
            setCourses(data);
          } else {
            const data = await CourseAPI.filterByTopic(selectedTopic);
            setCourses(data);
          }
        } catch {
          setCourses([]);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    }
  }, [selectedTopic]);

  let isMember = false;
  let isStaffOrManager = false;
  const userdata = localStorage.getItem('user');
  if (userdata) {
    try {
      const user = JSON.parse(userdata);
      isMember = user && user.role === "Member";
      isStaffOrManager = user && (user.role === "Staff" || user.role === "Manager");
    } catch { }
  }

  const handleSearch = async () => {
    setSearching(true);
    try {
      if (searchTerm.trim() === "") {
        // Reset về topic hiện tại khi search rỗng
        if (selectedTopic === 'All' || selectedTopic === null) {
          const data = await CourseAPI.getAllCourses();
          setCourses(data);
        } else {
          const data = await CourseAPI.filterByTopic(selectedTopic);
          setCourses(data);
        }
      } else {
        const data = await CourseAPI.searchCourseByTitle(searchTerm);
        setCourses(data);
      }
    } catch {
      setCourses([]);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    // Reset về topic hiện tại khi clear search
    if (selectedTopic === 'All' || selectedTopic === null) {
      CourseAPI.getAllCourses().then(data => setCourses(data)).catch(() => setCourses([]));
    } else {
      CourseAPI.filterByTopic(selectedTopic).then(data => setCourses(data)).catch(() => setCourses([]));
    }
  };

  const handleFilter = async (topic) => {
    setSelectedTopic(topic);
    setLoading(true);

    // Cập nhật URL theo topic được chọn
    if (topic === 'All') {
      navigate('/courseList');
    } else {
      navigate(`/courseList/${encodeURIComponent(topic)}`);
    }

    try {
      if (topic === 'All') {
        const data = await CourseAPI.getAllCourses();
        setCourses(data);
      } else {
        const data = await CourseAPI.filterByTopic(topic);
        setCourses(data);
      }
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };


  const handleEnroll = async (courseId) => {
    const isLoggedIn = Boolean(localStorage.getItem('accessToken'));
    if (!isLoggedIn) {
      message.warning('Please login to be able to enroll course!');
      return;
    }
    try {
      await CourseAPI.enrollCourse(courseId);
      message.success('Enroll course successfully!');
      setCourses(prev => prev.map(item =>
        item.course.id === courseId
          ? { ...item, isEnrolled: true, enrolled: true }
          : item
      ));
    } catch {
      message.error('Enroll course failed!');
    }
  };

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedCourse(null);
  };

  return (
    <div style={{
      padding: '0',
      minHeight: '100vh',
      fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica Neue", Arial, sans-serif',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%)'
    }}>
      {/* Header Section với improved spacing */}
      <div style={{
        textAlign: 'center',
        padding: '30px 20px 20px 20px',
        color: '#222',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <Typography.Title level={1} style={{
          fontSize: '3.2rem',
          fontWeight: 800,
          margin: '0 0 10px 0',
          letterSpacing: '-0.02em',
          textShadow: '0 4px 12px rgba(0,0,0,0.08)',
          fontFamily: 'inherit',
          color: '#222'
        }}>
          Explore Our Courses
        </Typography.Title>

        <Typography.Text style={{
          fontSize: '1.2rem',
          color: '#666',
          fontWeight: 500,
          display: 'block',
          fontFamily: 'inherit',
          maxWidth: '600px',
          margin: '0 auto 20px auto',
          lineHeight: '1.6'
        }}>
          Discover knowledge, skills, and support for a better future
        </Typography.Text>

        {/* Improved Search Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          <Input
            placeholder="Search course by title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            style={{
              height: '52px',
              fontSize: '16px',
              borderRadius: '16px',
              border: '2px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              flex: 1
            }}
            allowClear={{ clearIcon: <span onClick={handleClearSearch}>✕</span> }}
            disabled={searching}
            onFocus={(e) => {
              e.target.style.borderColor = '#1890ff';
              e.target.style.boxShadow = '0 8px 32px rgba(24,144,255,0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.3)';
              e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
            }}
          />
          <Button
            type="primary"
            onClick={handleSearch}
            loading={searching}
            style={{
              height: '52px',
              padding: '0 28px',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #1890ff, #722ed1)',
              border: 'none',
              boxShadow: '0 8px 24px rgba(24,144,255,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(24,144,255,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(24,144,255,0.3)';
            }}
          >
            Search
          </Button>
        </div>

        {/* Topic Filter Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px',
          flexWrap: 'wrap'
        }}>
          {topics.map((topic) => (
            <Button
              key={topic}
              type={selectedTopic === topic ? "primary" : "default"}
              onClick={() => handleFilter(topic)}
              style={{
                height: '44px',
                padding: '0 20px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '12px',
                border: selectedTopic === topic ? 'none' : '2px solid rgba(255,255,255,0.3)',
                background: selectedTopic === topic
                  ? 'linear-gradient(135deg, #1890ff, #722ed1)'
                  : 'rgba(255,255,255,0.9)',
                color: selectedTopic === topic ? 'white' : '#333',
                backdropFilter: 'blur(10px)',
                boxShadow: selectedTopic === topic
                  ? '0 8px 24px rgba(24,144,255,0.3)'
                  : '0 4px 16px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => {
                if (selectedTopic !== topic) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(24,144,255,0.2)';
                  e.currentTarget.style.borderColor = '#1890ff';
                }
              }}
              onMouseOut={(e) => {
                if (selectedTopic !== topic) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }
              }}
            >
              {topic}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content với improved spacing */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ padding: '20px 20px 60px 20px' }}>
          <Row gutter={[24, 32]} justify="center">
            {courses.length === 0 && !loading && (
              <Col span={24} style={{ textAlign: 'center', marginTop: '60px' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '24px',
                  padding: '60px 40px',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  <Empty
                    description={
                      <span style={{
                        fontSize: '18px',
                        color: '#666',
                        fontWeight: '500'
                      }}>
                        No courses available at the moment
                      </span>
                    }
                  />
                </div>
              </Col>
            )}

            {courses.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.course.id}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.97)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer'
                  }}
                  styles={{
                    body: {
                      padding: '32px 28px 24px 28px',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      fontFamily: 'inherit'
                    }
                  }}
                  onClick={() => handleCardClick(item)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    justifyContent: 'space-between',
                    fontFamily: 'inherit'
                  }}>
                    <div>
                      <Typography.Title level={4} style={{
                        fontSize: '1.3rem',
                        color: '#1a1a1a',
                        fontWeight: 700,
                        lineHeight: '1.3',
                        letterSpacing: '-0.01em',
                        fontFamily: 'inherit',
                        height: 60
                      }}
                        ellipsis={{ rows: 2 }}
                      >
                        {item.course.title}
                      </Typography.Title>

                      <Typography.Paragraph style={{
                        color: '#555',
                        fontSize: '1rem',
                        lineHeight: '1.7',
                        marginBottom: '24px',
                        fontWeight: 400,
                        fontFamily: 'inherit',
                        height: 140
                      }}
                        ellipsis={{ rows: 5 }}
                      >
                        {item.course.description}
                      </Typography.Paragraph>

                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        marginBottom: '24px',
                        fontFamily: 'inherit'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <Typography.Text style={{
                            background: 'linear-gradient(135deg, #52c41a, #389e0d)',
                            color: 'white',
                            padding: '6px 14px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontFamily: 'inherit'
                          }}>
                            Topic
                          </Typography.Text>
                          <Typography.Text style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#333',
                            fontFamily: 'inherit'
                          }}>
                            {item.course.topic || 'General'}
                          </Typography.Text>
                        </div>
                        {isMember && (

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            <Typography.Text style={{
                              background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                              color: 'white',
                              padding: '6px 14px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              fontFamily: 'inherit'
                            }}>
                              Status
                            </Typography.Text>
                            <Typography.Text style={{
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#333',
                              fontFamily: 'inherit'
                            }}>
                              {item.status}
                            </Typography.Text>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Nút action */}
                    {isStaffOrManager ? (
                      <ActionButton
                        className="edit-btn"
                        block
                        style={{
                          height: '50px',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          borderRadius: '16px',
                          letterSpacing: '0.02em',
                          fontFamily: 'inherit'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/CourseDetailsManage/${item.course.id}`);
                        }}
                      >
                        View Course Details
                      </ActionButton>
                    ) : item.status === "NotEnrolled" ? (
                      <ActionButton
                        className="edit-btn"
                        block
                        style={{
                          height: '50px',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          borderRadius: '16px',
                          letterSpacing: '0.02em',
                          fontFamily: 'inherit'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnroll(item.course.id);
                        }}
                      >
                        Enroll
                      </ActionButton>
                    ) : item.status === "Completed" ? (
                      <ActionButton
                        className="edit-btn"
                        block
                        style={{
                          height: '50px',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          borderRadius: '16px',
                          letterSpacing: '0.02em',
                          fontFamily: 'inherit'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/CompletedCourse/${item.course.id}`);
                        }}
                      >
                        View Course Details
                      </ActionButton>
                    ) : (
                      <ActionButton
                        className="edit-btn"
                        block
                        style={{
                          height: '50px',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          borderRadius: '16px',
                          letterSpacing: '0.02em',
                          fontFamily: 'inherit'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/CourseDetailsMember/${item.course.id}`);
                        }}
                      >
                        Continue studying
                      </ActionButton>
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Course Details Modal */}
      <Modal
        title={
          <div style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1a1a1a'
          }}>
            Course Details
          </div>
        }
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        centered
        styles={{
          body: {
            padding: '32px',
            fontSize: '16px',
            lineHeight: '1.6'
          },
          mask: {
            backdropFilter: 'blur(8px)'
          }
        }}
      >
        {selectedCourse && (
          <div style={{ fontFamily: 'inherit' }}>
            {/* Title */}
            <div style={{ marginBottom: '24px' }}>
              <Typography.Title level={3} style={{
                color: '#1a1a1a',
                fontWeight: 700,
                margin: '0 0 8px 0',
                fontSize: '1.4rem'
              }}>
                {selectedCourse.course.title}
              </Typography.Title>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <Typography.Title level={5} style={{
                color: '#666',
                fontWeight: 600,
                margin: '0 0 12px 0',
                fontSize: '1rem'
              }}>
                Description
              </Typography.Title>
              <Typography.Paragraph style={{
                color: '#555',
                fontSize: '1rem',
                lineHeight: '1.7',
                margin: 0,
                textAlign: 'justify'
              }}>
                {selectedCourse.course.description}
              </Typography.Paragraph>
            </div>

            {/* Topic */}
            <div style={{ marginBottom: '24px' }}>
              <Typography.Title level={5} style={{
                color: '#666',
                fontWeight: 600,
                margin: '0 0 12px 0',
                fontSize: '1rem'
              }}>
                Topic
              </Typography.Title>
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #52c41a, #389e0d)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {selectedCourse.course.topic || 'General'}
              </div>
            </div>

            {/* Status (only for members) */}
            {isMember && (
              <div style={{ marginBottom: '24px' }}>
                <Typography.Title level={5} style={{
                  color: '#666',
                  fontWeight: 600,
                  margin: '0 0 12px 0',
                  fontSize: '1rem'
                }}>
                  Status
                </Typography.Title>
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {selectedCourse.status}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '32px',
              justifyContent: 'center'
            }}>
              {isStaffOrManager ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModalClose();
                    navigate(`/CourseDetailsManage/${selectedCourse.course.id}`);
                  }}
                  style={{
                    height: '48px',
                    padding: '0 32px',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(24,144,255,0.3)'
                  }}
                >
                  View Course Details
                </Button>
              ) : selectedCourse.status === "NotEnrolled" ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModalClose();
                    handleEnroll(selectedCourse.course.id);
                  }}
                  style={{
                    height: '48px',
                    padding: '0 32px',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(24,144,255,0.3)'
                  }}
                >
                  Enroll Now
                </Button>
              ) : selectedCourse.status === "Completed" ? (
                <Button
                  type="primary"
                  size="large"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModalClose();
                    navigate(`/CompletedCourse/${selectedCourse.course.id}`);
                  }}
                  style={{
                    height: '48px',
                    padding: '0 32px',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(24,144,255,0.3)'
                  }}
                >
                  View Course Details
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModalClose();
                    navigate(`/CourseDetailsMember/${selectedCourse.course.id}`);
                  }}
                  style={{
                    height: '48px',
                    padding: '0 32px',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                    border: 'none',
                    boxShadow: '0 4px 16px rgba(24,144,255,0.3)'
                  }}
                >
                  Continue Studying
                </Button>
              )}
              
              <Button
                size="large"
                onClick={handleModalClose}
                style={{
                  height: '48px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '12px',
                  border: '2px solid #1890ff',
                  color: '#1890ff',
                  background: 'transparent'
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}