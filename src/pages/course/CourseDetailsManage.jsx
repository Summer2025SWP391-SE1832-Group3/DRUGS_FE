import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, Row, Col, Tag, Collapse, Modal, Form, Input, Select, message, Upload, Button, List, Switch, Divider } from 'antd';
import { CourseAPI } from '../../apis/course';
import { LessonAPI } from '../../apis/lesson';
import { PlayCircleOutlined, BookOutlined, ClockCircleOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionButton, CreateButton } from '../../components/ui/Buttons';
import { SurveyAPI } from '../../apis/survey';
import { CourseManagementAPI } from '../../apis/courseManagement';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export default function CourseDetailsManage() {
  const { id } = useParams();
  const [courseDetail, setCourseDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState([]);
  const [openLessonId, setOpenLessonId] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editForm] = Form.useForm();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [isLessonEditModalVisible, setIsLessonEditModalVisible] = useState(false);
  const [lessonEditForm] = Form.useForm();
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonUploading, setLessonUploading] = useState(false);
  const [isCreateExamModalVisible, setIsCreateExamModalVisible] = useState(false);
  const [createExamForm] = Form.useForm();
  const [isEditExamModalVisible, setIsEditExamModalVisible] = useState(false);
  const [editExamForm] = Form.useForm();
  const [isDeleteExamModalVisible, setIsDeleteExamModalVisible] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [openExam, setOpenExam] = useState(false);
  const [courseStats, setCourseStats] = useState({
    totalEnrollments: 0,
    completedCount: 0,
    pendingCount: 0,
    totalFeedbacks: 0,
    averageRating: 0,
    feedbackDistribution: {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    }
  });
  const [enrollmentDetails, setEnrollmentDetails] = useState([]);
  const [feedbackDetails, setFeedbackDetails] = useState([]);
  const [isEnrollmentModalVisible, setIsEnrollmentModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'activate' | 'deactivate'

  let isManager = false;
  let isStaff = false;
  const userdata = localStorage.getItem('user');
  if (userdata) {
    try {
      const user = JSON.parse(userdata);
      isManager = user && user.role === 'Manager';
      isStaff = user && user.role === 'Staff';
    } catch {}
  }

  useEffect(() => {
    async function fetchCourseDetail() {
      try {
        const data = await CourseAPI.getCourseById(id);
        setCourseDetail(data);
      } catch (error) {
        setCourseDetail(null);
      }
    }
    fetchCourseDetail();
    async function fetchCourse() {
      setLoading(true);
      try {
        const res = await CourseAPI.getCourseById(id);
        setCourseDetail(res);
        // Fetch lessons
        const lessonRes = await LessonAPI.getLessonsByCourseId(id);
        setLessons(Array.isArray(lessonRes) ? lessonRes : []);
      } catch (error) {
        setCourseDetail(null);
        setLessons([]);
      }
      setLoading(false);
    }
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (!isManager) return;
    async function fetchCourseStats() {
      try {
        const statsRes = await CourseManagementAPI.getCourseReport(id);
        setCourseStats(statsRes);
      } catch (error) {
        console.error('Failed to fetch course stats:', error);
      }
    }
    fetchCourseStats();
  }, [id, isManager]);

  // Open Edit Modal and prefill
  const showEditModal = () => {
    editForm.setFieldsValue({
      title: courseDetail.title,
      description: courseDetail.description,
      topic: courseDetail.topic,
    });
    setIsEditModalVisible(true);
  };

  // Handle Edit Modal OK
  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      await CourseManagementAPI.updateCourse(courseDetail.id, values);
      message.success('Course updated successfully');
      setIsEditModalVisible(false);
      // Reload course data
      const res = await CourseAPI.getCourseById(courseDetail.id);
      setCourseDetail(res);
    } catch (err) {
      message.error('Failed to update course');
    }
  };

  // Handle Edit Modal Cancel
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
  };

  // Open Create Modal
  const showCreateModal = () => {
    createForm.resetFields();
    setIsCreateModalVisible(true);
  };

  // Handle Create Modal OK
  const handleCreateOk = async () => {
    try {
      setUploading(true);
      const values = await createForm.validateFields();
      let videoFile = null;
      if (values.video && values.video.length > 0 && values.video[0].originFileObj) {
        videoFile = values.video[0].originFileObj;
      }
      await LessonAPI.createLesson({
        title: values.title,
        content: values.content,
        video: videoFile,
        courseId: courseDetail.id,
      });
      message.success('Lesson created successfully');
      setIsCreateModalVisible(false);
      setUploading(false);
      const lessonRes = await LessonAPI.getLessonsByCourseId(courseDetail.id);
      setLessons(Array.isArray(lessonRes) ? lessonRes : []);
    } catch (err) {
      setUploading(false);
      message.error('Failed to create lesson');
    }
  };

  // Handle Create Modal Cancel
  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
    createForm.resetFields();
  };

  // Open Edit Lesson Modal
  const showLessonEditModal = (lesson) => {
    setEditingLesson(lesson);
    lessonEditForm.setFieldsValue({
      title: lesson.title,
      content: lesson.content,
      video: undefined
    });
    setIsLessonEditModalVisible(true);
  };

  // Handle Edit Lesson OK
  const handleLessonEditOk = async () => {
    try {
      setLessonUploading(true);
      const values = await lessonEditForm.validateFields();
      let videoFile = null;
      if (values.video && values.video.length > 0 && values.video[0].originFileObj) {
        videoFile = values.video[0].originFileObj;
      }
      await LessonAPI.updateLesson(editingLesson.id, {
        title: values.title,
        content: values.content,
        video: videoFile,
      });
      message.success('Lesson updated successfully');
      setIsLessonEditModalVisible(false);
      setLessonUploading(false);
      const lessonRes = await LessonAPI.getLessonsByCourseId(courseDetail.id);
      setLessons(Array.isArray(lessonRes) ? lessonRes : []);
    } catch (err) {
      setLessonUploading(false);
      message.error('Failed to update lesson');
    }
  };

  // Handle Edit Lesson Cancel
  const handleLessonEditCancel = () => {
    setIsLessonEditModalVisible(false);
    lessonEditForm.resetFields();
    setEditingLesson(null);
  };

  // Handle Delete Lesson
  const handleDeleteLesson = (lesson) => {
    Modal.confirm({
      title: 'Delete Lesson',
      content: `Are you sure you want to delete "${lesson.title}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await LessonAPI.deleteLesson(lesson.id);
          message.success('Lesson deleted successfully');
          // Reload lessons
          const lessonRes = await LessonAPI.getLessonsByCourseId(courseDetail.id);
          setLessons(Array.isArray(lessonRes) ? lessonRes : []);
        } catch {
          message.error('Failed to delete lesson');
        }
      }
    });
  };

  const showCreateExamModal = () => {
    createExamForm.setFieldsValue({
      examType: 'CourseTest',
      isActive: true,
      questions: [{ answers: [{}] }],
      examName: '',
      description: ''
    });
    setIsCreateExamModalVisible(true);
  };

  const handleCreateExamCancel = () => {
    setIsCreateExamModalVisible(false);
    createExamForm.resetFields();
  };

  const handleCreateExamOk = async () => {
    try {
      const values = await createExamForm.validateFields();
      const examData = {
        surveyName: values.examName,
        description: values.description,
        surveyType: values.examType,
        isActive: values.isActive,
        questionsDto: (values.questions || []).map(q => ({
          questionText: q.questionText,
          answersDto: (q.answers || []).map(a => ({
            answerText: a.answerText,
            score: a.score,
            isCorrect: !!a.isCorrect
          }))
        }))
      };
      await SurveyAPI.createSurvey(examData, courseDetail.id);
      message.success('Exam created successfully!');
      setIsCreateExamModalVisible(false);
      createExamForm.resetFields();
    } catch (err) {
      message.error('Failed to create exam');
    }
  };

  const showEditExamModal = () => {
    if (!courseDetail?.finalExamSurvey) return;
    setEditingExam(courseDetail.finalExamSurvey);
    editExamForm.setFieldsValue({
      examName: courseDetail.finalExamSurvey.surveyName,
      description: courseDetail.finalExamSurvey.description,
      examType: 'CourseTest',
      questions: (courseDetail.finalExamSurvey.surveyQuestions || []).map(q => ({
        questionText: q.questionText,
        answers: (q.surveyAnswers || []).map(a => ({
          answerText: a.answerText,
          score: a.score,
          isCorrect: !!a.isCorrect
        }))
      }))
    });
    setIsEditExamModalVisible(true);
  };

  const handleEditExamOk = async () => {
    try {
      const values = await editExamForm.validateFields();
      const surveyData = {
        surveyName: values.examName,
        description: values.description,
        surveyType: values.examType,
        questions: (values.questions || []).map((q, qIdx) => ({
          questionId: editingExam?.surveyQuestions?.[qIdx]?.questionId ?? 0,
          questionText: q.questionText,
          answersDTO: (q.answers || []).map((a, aIdx) => ({
            answerId: editingExam?.surveyQuestions?.[qIdx]?.surveyAnswers?.[aIdx]?.answerId ?? 0,
            answerText: a.answerText,
            score: a.score,
            isCorrect: !!a.isCorrect
          }))
        }))
      };
      await SurveyAPI.updateSurvey(editingExam.surveyId, surveyData);
      message.success('Exam updated successfully!');
      setIsEditExamModalVisible(false);
      setEditingExam(null);
      // Refresh course detail
      const data = await CourseAPI.getCourseById(id);
      setCourseDetail(data);
    } catch (error) {
      const apiMsg = error?.response?.data;
      if (typeof apiMsg === 'string') {
        message.error(apiMsg);
      } else if (apiMsg?.message) {
        message.error(apiMsg.message);
      } else {
        message.error('Failed to update exam.');
      }
    }
  };

  const handleEditExamCancel = () => {
    setIsEditExamModalVisible(false);
    setEditingExam(null);
    editExamForm.resetFields();
  };

  const showDeleteExamModal = () => {
    setIsDeleteExamModalVisible(true);
  };

  const handleDeactivateExam = async () => {
    try {
      await CourseManagementAPI.deactivateSurvey(courseDetail.finalExamSurvey.surveyId);
      message.success('Exam deactivated successfully!');
      setIsDeleteExamModalVisible(false);
      // Refresh course detail
      const data = await CourseAPI.getCourseDetail(id);
      setCourseDetail(data);
    } catch (error) {
      const apiMsg = error?.response?.data;
      if (typeof apiMsg === 'string') {
        message.error(apiMsg);
      } else if (apiMsg?.message) {
        message.error(apiMsg.message);
      } else {
        message.error('Failed to deactivate exam.');
      }
    }
  };

  const handleDeleteExamCancel = () => {
    setIsDeleteExamModalVisible(false);
  };

  const showEnrollmentModal = async () => {
    try {
      const res = await CourseManagementAPI.getLessonProgressReport(id);
      setEnrollmentDetails(res.reports || []);
      setIsEnrollmentModalVisible(true);
    } catch (error) {
      setEnrollmentDetails([]);
      setIsEnrollmentModalVisible(true);
    }
  };

  const handleEnrollmentModalCancel = () => {
    setIsEnrollmentModalVisible(false);
  };

  const showFeedbackModal = async () => {
    try {
      const res = await CourseManagementAPI.getAllFeedback(id);
      setFeedbackDetails(Array.isArray(res) ? res : []);
      setIsFeedbackModalVisible(true);
    } catch (error) {
      setFeedbackDetails([]);
      setIsFeedbackModalVisible(true);
    }
  };

  const handleFeedbackModalCancel = () => {
    setIsFeedbackModalVisible(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!courseDetail) return <div>Course not found</div>;

  return (
    <div>
      {/* Hero Section - only title */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
        padding: '60px 0 0 0',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 120
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px',
          position: 'relative',
          zIndex: 1,
        }}>
          <Title
            level={1}
            style={{
              fontSize: '48px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '20px',
              lineHeight: '1.2',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {courseDetail.title}
          </Title>
        </div>
      </div>
      {/* Main Content */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '40px 0',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px'
        }}>
          {/* Edit Course button for Manager in its own white card, above overview, in white area */}
          {isManager && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
              <CreateButton size="large" style={{ borderRadius: 28, fontSize: 16, fontWeight: 700, height: 48, padding: '0 32px', boxShadow: 'none', marginBottom: 0 }} onClick={showEditModal}>Edit Course</CreateButton>
            </div>
          )}
          {/* Course Overview Card with Type box on the right */}
          <Card style={{
            marginBottom: '32px',
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
          }}>
            <Row gutter={32} align="middle">
              <Col xs={24} md={16}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Title level={3} style={{
                      color: '#1a202c',
                      marginBottom: 0,
                      fontSize: '24px',
                      fontWeight: '700'
                    }}>
                      Course Overview
                    </Title>
                  </div>
                  <Paragraph style={{
                    fontSize: '16px',
                    color: '#4a5568',
                    lineHeight: '1.6',
                    marginBottom: 0
                  }}>
                    {courseDetail.description}
                  </Paragraph>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div style={{
                  background: 'linear-gradient(135deg, #7b61ff 0%, #5a4be7 100%)',
                  borderRadius: 18,
                  padding: '24px 28px',
                  marginTop: 10,
                  boxShadow: '0 4px 24px rgba(34,76,139,0.10)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 16
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <BookOutlined style={{ fontSize: 20, color: 'white', marginRight: 8 }} />
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>
                      {lessons.length} Lessons
                    </Text>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 600, marginRight: 8 }}>
                      Type:
                    </Text>
                    <Tag style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      borderRadius: 20,
                      padding: '4px 16px',
                      fontSize: 15
                    }}>
                      {courseDetail.topic}
                    </Tag>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
          {/* Course Statistics Card */}
          {isManager && (
            <Card style={{
              marginBottom: '32px',
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
            }}>
              <Title level={3} style={{
                color: '#1a202c',
                marginBottom: '24px',
                fontSize: '24px',
                fontWeight: '700'
              }}>
                Course Statistics
              </Title>
              <Row gutter={[24, 24]}>
                {/* Enrollment Stats */}
                <Col xs={24} sm={12} md={8}>
                  <div style={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
                      {courseStats.totalEnrollments}
                    </div>
                    <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: '12px' }}>
                      Total Enrollments
                    </div>
                    <ActionButton 
                      style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        color: 'white', 
                        border: 'none',
                        fontSize: '12px',
                        padding: '4px 12px'
                      }}
                      onClick={showEnrollmentModal}
                    >
                      View Details
                    </ActionButton>
                  </div>
                </Col>
                {/* Completion Stats */}
                <Col xs={24} sm={12} md={8}>
                  <div style={{
                    background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
                      {courseStats.completedCount}
                    </div>
                    <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: '4px' }}>
                      Completed
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>
                      {courseStats.pendingCount} Pending
                    </div>
                  </div>
                </Col>
                {/* Rating Stats */}
                <Col xs={24} sm={12} md={8}>
                  <div style={{
                    background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
                      {courseStats.averageRating.toFixed(1)}
                    </div>
                    <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: '4px' }}>
                      Average Rating
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '12px' }}>
                      {courseStats.totalFeedbacks} Feedbacks
                    </div>
                    <ActionButton 
                      style={{ 
                        background: 'rgba(255,255,255,0.2)', 
                        color: 'white', 
                        border: 'none', 
                        fontSize: '12px', 
                        padding: '4px 12px' 
                      }} 
                      onClick={showFeedbackModal}
                    >
                      View Feedbacks
                    </ActionButton>
                  </div>
                </Col>
              </Row>
              {/* Feedback Distribution */}
              <div style={{ marginTop: '24px' }}>
                <Title level={4} style={{ marginBottom: '16px', color: '#1a202c' }}>
                  Rating Distribution
                </Title>
                <Row gutter={[12, 12]}>
                  {Object.entries(courseStats.feedbackDistribution).map(([rating, count]) => (
                    <Col key={rating} xs={24} sm={12} md={4}>
                      <div style={{
                        background: '#f8fafc',
                        borderRadius: '8px',
                        padding: '12px',
                        textAlign: 'center',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c' }}>
                          {count}
                        </div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>
                          {rating} ⭐
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          )}
          {/* Create Lesson Button */}
          {(isManager || isStaff) && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
              <CreateButton onClick={showCreateModal}>
                + Create Lesson
              </CreateButton>
            </div>
          )}
          {/* Course Curriculum Section - styled as in screenshot */}
          <div style={{
            width: '100%',
            background: 'white',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(34,76,139,0.10)',
            padding: '0 0 32px 0',
            marginBottom: 40
          }}>
            <div style={{
              background: 'linear-gradient(90deg, #7b61ff 0%, #5a4be7 100%)',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: '28px 40px 18px 40px',
              marginBottom: 0
            }}>
              <Title level={2} style={{
                color: 'white',
                marginBottom: 0,
                fontSize: '28px',
                fontWeight: '700',
                letterSpacing: '-1px'
              }}>
                Course Curriculum
              </Title>
            </div>
            <div style={{ padding: '24px 32px 0 32px' }}>
              {lessons.map((lesson, idx) => {
                const isOpen = openLessonId === lesson.id;
                return (
                  <div key={lesson.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f8fafd',
                    borderRadius: 16,
                    boxShadow: '0 2px 8px rgba(34,76,139,0.04)',
                    padding: '20px 32px',
                    marginBottom: 20,
                    border: '1px solid #f0f4fa',
                    position: 'relative',
                    flexDirection: 'column',
                    transition: 'box-shadow 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 24
                      }}>
                        <PlayCircleOutlined style={{ color: 'white', fontSize: 28 }} />
                      </div>
                      <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setOpenLessonId(isOpen ? null : lesson.id)}>
                        <Text style={{ fontSize: 20, fontWeight: 700, color: '#2c3e50', display: 'block', marginBottom: 2 }}>
                          Lesson {idx + 1}: {lesson.title}
                        </Text>
                        <Text style={{ fontSize: 15, color: '#718096' }}>
                          Video lesson
                        </Text>
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {(isManager || isStaff) && <>
                          <ActionButton className="edit-btn" onClick={() => showLessonEditModal(lesson)}>
                            Edit
                          </ActionButton>
                          <ActionButton className="delete-btn" onClick={() => handleDeleteLesson(lesson)}>
                            Delete
                          </ActionButton>
                        </>}
                        <ActionButton className="arrow-btn" style={{ background: '#f0f4fa', color: '#7b61ff', border: 'none', fontWeight: 600, fontSize: 18, padding: '8px 16px', borderRadius: 12 }} onClick={() => setOpenLessonId(isOpen ? null : lesson.id)}>
                          {isOpen ? '˄' : '>'}
                        </ActionButton>
                      </div>
                    </div>
                    {isOpen && (
                      <div style={{ width: '100%', marginTop: 24 }}>
                        <Paragraph style={{
                          marginBottom: '24px',
                          fontSize: '16px',
                          color: '#4a5568',
                          lineHeight: '1.6',
                          padding: '20px',
                          backgroundColor: '#f7fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          {lesson.content}
                        </Paragraph>
                        {lesson.videoUrl && (
                          <div style={{ marginBottom: '32px' }}>
                            <div style={{
                              borderRadius: '12px',
                              overflow: 'hidden',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                            }}>
                              <video width="100%" height="400" controls>
                                <source src={lesson.videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {(isManager || isStaff) && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
              <CreateButton icon={<PlusOutlined />} onClick={showCreateExamModal}>
                Create Exam
              </CreateButton>
            </div>
          )}
          {courseDetail && courseDetail.finalExamSurvey && (
            <Card
              style={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                marginTop: 32,
                marginBottom: 32
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '24px',
                margin: '-24px -24px 24px -24px'
              }}>
                <Typography.Title level={2} style={{
                  color: 'white',
                  marginBottom: 0,
                  fontSize: '28px',
                  fontWeight: '700'
                }}>
                  Take Final Exams
                </Typography.Title>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 24,
                marginTop: 24
              }}>
                <div style={{
                  background: '#f8fafd',
                  borderRadius: 16,
                  boxShadow: '0 2px 8px rgba(34,76,139,0.04)',
                  padding: '20px 32px',
                  marginBottom: 20,
                  border: '1px solid #f0f4fa',
                  position: 'relative',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <BookOutlined style={{ color: '#764ba2', fontSize: 24, marginRight: 18 }} />
                    <Typography.Text style={{ fontSize: 18, fontWeight: 600, flex: 1 }}>
                      {courseDetail.finalExamSurvey.surveyName}
                    </Typography.Text>
                    {(isManager || isStaff) && (
                      <div style={{ display: 'flex', gap: 12 }}>
                        <ActionButton className="edit-btn" onClick={e => { e.stopPropagation(); showEditExamModal(); }}>
                          Edit
                        </ActionButton>
                        {courseDetail.finalExamSurvey.isActive ? (
                          <ActionButton
                            className="deactivate-btn"
                            onClick={e => {
                              e.stopPropagation();
                              setConfirmAction('deactivate');
                              setIsConfirmModalVisible(true);
                            }}
                            style={{
                              background: '#ff4d4f',
                              color: 'white',
                              border: 'none',
                            }}
                          >
                            Deactivate
                          </ActionButton>
                        ) : (
                          <ActionButton
                            className="activate-btn"
                            onClick={e => {
                              e.stopPropagation();
                              if (courseDetail.status === 'Active') {
                                message.error('The course already has an active survey. Please deactivate the existing survey before activating a new one.');
                                return;
                              }
                              setConfirmAction('activate');
                              setIsConfirmModalVisible(true);
                            }}
                            style={{
                              background: '#52c41a',
                              color: 'white',
                              border: 'none',
                            }}
                          >
                            Activate
                          </ActionButton>
                        )}
                      </div>
                    )}
                    <ActionButton className="arrow-btn" style={{ background: '#f0f4fa', color: '#7b61ff', border: 'none', fontWeight: 600, fontSize: 18, padding: '8px 16px', borderRadius: 12, marginLeft: 12 }} onClick={() => setOpenExam(open => !open)}>
                      {openExam ? '˄' : '>'}
                    </ActionButton>
                  </div>
                  {openExam && (
                    <div style={{ width: '100%', marginTop: 24 }}>
                      <Typography.Paragraph style={{ marginBottom: 24, color: '#4a5568' }}>
                        {courseDetail.finalExamSurvey.description}
                      </Typography.Paragraph>
                      <List
                        dataSource={courseDetail.finalExamSurvey.surveyQuestions}
                        renderItem={(q, qidx) => (
                          <div style={{
                            marginBottom: '20px',
                            backgroundColor: '#fff',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                          }}>
                            <Typography.Text style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c',
                              display: 'block',
                              marginBottom: '16px'
                            }}>
                              Q{qidx + 1}: {q.questionText}
                            </Typography.Text>
                            <div>
                              {q.surveyAnswers.map((choice, cidx) => (
                                <div
                                  key={choice.answerId}
                                  style={{
                                    padding: '12px 16px',
                                    margin: '8px 0',
                                    borderRadius: '8px',
                                    backgroundColor: choice.isCorrect ? '#e6fffa' : '#f7fafc',
                                    border: choice.isCorrect ? '2px solid #38b2ac' : '1px solid #e2e8f0',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Typography.Text style={{
                                    color: choice.isCorrect ? '#2d3748' : '#4a5568',
                                    fontWeight: choice.isCorrect ? '600' : '400'
                                  }}>
                                    {String.fromCharCode(65 + cidx)}. {choice.answerText}
                                  </Typography.Text>
                                  {choice.isCorrect && (
                                    <Typography.Text style={{
                                      color: '#38b2ac',
                                      marginLeft: '12px',
                                      fontWeight: '600'
                                    }}>
                                      ✓ Correct
                                    </Typography.Text>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
      {/* Edit Course Modal */}
      <Modal
        title="Edit Course"
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Save"
        cancelText="Cancel"
        destroyOnHidden
      >
        <Form
          form={editForm}
          layout="vertical"
          initialValues={{ title: '', description: '', topic: '' }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input the course title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input the course description!' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Topic"
            name="topic"
            rules={[{ required: true, message: 'Please select the course topic!' }]}
          >
            <Select>
              <Select.Option value="Awareness">Awareness</Select.Option>
              <Select.Option value="Prevention">Prevention</Select.Option>
              <Select.Option value="Refusal">Refusal</Select.Option>
              <Select.Option value="CommunityEducation">CommunityEducation</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {/* Create Lesson Modal */}
      <Modal
        title="Create Lesson"
        open={isCreateModalVisible}
        onOk={handleCreateOk}
        onCancel={handleCreateCancel}
        okText="Create"
        cancelText="Cancel"
        confirmLoading={uploading}
        destroyOnHidden
      >
        <Form
          form={createForm}
          layout="vertical"
          initialValues={{ title: '', content: '', video: undefined }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input the lesson title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: 'Please input the lesson content!' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Video"
            name="video"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept="video/*">
              <Button icon={<UploadOutlined />}>Select Video</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      {/* Edit Lesson Modal */}
      <Modal
        title="Edit Lesson"
        open={isLessonEditModalVisible}
        onOk={handleLessonEditOk}
        onCancel={handleLessonEditCancel}
        okText="Save"
        cancelText="Cancel"
        confirmLoading={lessonUploading}
        destroyOnHidden
      >
        <Form
          form={lessonEditForm}
          layout="vertical"
          initialValues={{ title: '', content: '', video: undefined }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input the lesson title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: 'Please input the lesson content!' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            label="Video"
            name="video"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept="video/*">
              <Button icon={<UploadOutlined />}>Select Video</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal tạo exam */}
      <Modal
        title="Create Exam"
        open={isCreateExamModalVisible}
        onOk={handleCreateExamOk}
        onCancel={handleCreateExamCancel}
        okText="Create"
        cancelText="Cancel"
        destroyOnHidden
        width={800}
      >
        <Form
          form={createExamForm}
          layout="vertical"
          initialValues={{ isActive: true, examType: 'CourseTest', questions: [{ answers: [{}] }] }}
        >
          <Form.Item
            label="Exam Type"
            name="examType"
            rules={[{ required: true, message: "Exam type is required" }]}
          >
            <Select disabled>
              <Select.Option value="CourseTest">CourseTest</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Exam Name"
            name="examName"
            rules={[{ required: true, message: "Exam name is required" }]}
          >
            <Input placeholder="Enter exam name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            label="Active"
            name="isActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Divider />
          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, idx) => (
                  <div key={field.key} style={{ marginBottom: 24, border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
                    <Form.Item
                      label={`Question ${idx + 1}`}
                      name={[field.name, "questionText"]}
                      rules={[{ required: true, message: "Please input question" }]}
                    >
                      <Input placeholder="Enter question..." />
                    </Form.Item>
                    <Form.List name={[field.name, "answers"]}>
                      {(ansFields, { add: addAns, remove: removeAns }) => (
                        <>
                          {ansFields.map((ans, aidx) => (
                            <div key={ans.key} style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                              <Form.Item
                                name={[ans.name, "answerText"]}
                                rules={[{ required: true, message: "Answer required" }]}
                                style={{ flex: 1, marginBottom: 0 }}
                              >
                                <Input placeholder={`Answer ${aidx + 1}`} />
                              </Form.Item>
                              <Form.Item
                                name={[ans.name, "score"]}
                                style={{ width: 80, marginBottom: 0 }}
                              >
                                <Input placeholder="Score" type="number" />
                              </Form.Item>
                              <Form.Item
                                name={[ans.name, "isCorrect"]}
                                valuePropName="checked"
                                style={{ marginBottom: 0 }}
                              >
                                <Switch checkedChildren="True" unCheckedChildren="Wrong" />
                              </Form.Item>
                              <Button danger onClick={() => removeAns(ans.name)} size="small">Delete</Button>
                            </div>
                          ))}
                          <Button type="dashed" onClick={() => addAns()} block icon={<PlusOutlined />}>Add Answer</Button>
                        </>
                      )}
                    </Form.List>
                    <Button danger onClick={() => remove(field.name)} size="small" style={{ marginTop: 8 }}>Delete Question</Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Question</Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
      {/* Edit Exam Modal */}
      <Modal
        title="Edit Exam"
        open={isEditExamModalVisible}
        onOk={handleEditExamOk}
        onCancel={handleEditExamCancel}
        okText="Save"
        cancelText="Cancel"
        destroyOnHidden
        width={800}
      >
        <Form
          form={editExamForm}
          layout="vertical"
          initialValues={{ isActive: true, examType: 'CourseTest', questions: [{ answers: [{}] }] }}
        >
          <Form.Item
            label="Exam Type"
            name="examType"
            rules={[{ required: true, message: "Exam type is required" }]}
          >
            <Select disabled>
              <Select.Option value="CourseTest">CourseTest</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Exam Name"
            name="examName"
            rules={[{ required: true, message: "Exam name is required" }]}
          >
            <Input placeholder="Enter exam name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <Divider />
          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, idx) => (
                  <div key={field.key} style={{ marginBottom: 24, border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
                    <Form.Item
                      label={`Question ${idx + 1}`}
                      name={[field.name, "questionText"]}
                      rules={[{ required: true, message: "Please input question" }]}
                    >
                      <Input placeholder="Enter question..." />
                    </Form.Item>
                    <Form.List name={[field.name, "answers"]}>
                      {(ansFields, { add: addAns, remove: removeAns }) => (
                        <>
                          {ansFields.map((ans, aidx) => (
                            <div key={ans.key} style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                              <Form.Item
                                name={[ans.name, "answerText"]}
                                rules={[{ required: true, message: "Answer required" }]}
                                style={{ flex: 1, marginBottom: 0 }}
                              >
                                <Input placeholder={`Answer ${aidx + 1}`} />
                              </Form.Item>
                              <Form.Item
                                name={[ans.name, "score"]}
                                style={{ width: 80, marginBottom: 0 }}
                              >
                                <Input placeholder="Score" type="number" />
                              </Form.Item>
                              <Form.Item
                                name={[ans.name, "isCorrect"]}
                                valuePropName="checked"
                                style={{ marginBottom: 0 }}
                              >
                                <Switch checkedChildren="True" unCheckedChildren="Wrong" />
                              </Form.Item>
                              <Button danger onClick={() => removeAns(ans.name)} size="small">Delete</Button>
                            </div>
                          ))}
                          <Button type="dashed" onClick={() => addAns()} block icon={<PlusOutlined />}>Add Answer</Button>
                        </>
                      )}
                    </Form.List>
                    <Button danger onClick={() => remove(field.name)} size="small" style={{ marginTop: 8 }}>Delete Question</Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Question</Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
      {/* Delete Exam Modal */}
      <Modal
        open={isDeleteExamModalVisible}
        title="Deactivate Exam"
        onCancel={handleDeleteExamCancel}
        onOk={handleDeactivateExam}
        okText="Deactivate"
        okType="danger"
        cancelText="Cancel"
        centered
      >
        <div>
          <p>Are you sure you want to deactivate this exam?</p>
          <Typography.Text strong>{courseDetail?.finalExamSurvey?.surveyName}</Typography.Text>
          <p style={{ marginTop: 8, color: '#ef4444' }}>This action cannot be undone.</p>
        </div>
      </Modal>
      {/* Enrollment Details Modal */}
      <Modal
        title="Enrollment Details"
        open={isEnrollmentModalVisible}
        onCancel={handleEnrollmentModalCancel}
        footer={null}
        width={800}
      >
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <List
            dataSource={enrollmentDetails}
            renderItem={(item, index) => (
              <List.Item style={{
                background: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '12px',
                padding: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ width: '100%' }}>
                  <Row gutter={[16, 8]} align="middle">
                    <Col xs={24} sm={4}>
                      <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '16px'
                      }}>
                        {index + 1}
                      </div>
                    </Col>
                    <Col xs={24} sm={10}>
                      <div style={{ fontSize: '14px', color: '#4a5568' }}>
                        <strong>User ID:</strong>
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#718096',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                      }}>
                        {item.userId}
                      </div>
                    </Col>
                    <Col xs={24} sm={5}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#2d3748' }}>
                          {item.completedLessons}
                        </div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>
                          Completed
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={5}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#4a5568' }}>
                          {lessons.length}
                        </div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>
                          Total Lessons
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div style={{ marginTop: '12px' }}>
                    <div style={{
                      background: '#e2e8f0',
                      borderRadius: '10px',
                      height: '6px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        background: 'linear-gradient(90deg, #4CAF50 0%, #45a049 100%)',
                        height: '100%',
                        width: `${(item.completedLessons / lessons.length) * 100}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#718096', 
                      textAlign: 'center',
                      marginTop: '4px'
                    }}>
                      {Math.round((item.completedLessons / lessons.length) * 100)}% Complete
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Modal>
      {/* Feedback Details Modal */}
      <Modal 
        title="Course Feedbacks" 
        open={isFeedbackModalVisible} 
        onCancel={handleFeedbackModalCancel} 
        footer={null} 
        width={800}
      >
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <List 
            dataSource={feedbackDetails} 
            renderItem={(item, index) => (
              <List.Item style={{ 
                background: '#f8fafc', 
                borderRadius: '8px', 
                marginBottom: '12px', 
                padding: '16px', 
                border: '1px solid #e2e8f0' 
              }}>
                <div style={{ width: '100%' }}>
                  <Row gutter={[16, 8]} align="middle">
                    <Col xs={24} sm={3}>
                      <div style={{ 
                        background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)', 
                        borderRadius: '50%', 
                        width: '40px', 
                        height: '40px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'white', 
                        fontWeight: '700', 
                        fontSize: '16px' 
                      }}>
                        {index + 1}
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div style={{ fontSize: '14px', color: '#4a5568' }}>
                        <strong>User ID:</strong>
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#718096', 
                        fontFamily: 'monospace', 
                        wordBreak: 'break-all' 
                      }}>
                        {item.userId}
                      </div>
                    </Col>
                    <Col xs={24} sm={4}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '24px', 
                          fontWeight: '700', 
                          color: '#FF9800' 
                        }}>
                          {item.rating}
                        </div>
                        <div style={{ fontSize: '12px', color: '#718096' }}>
                          ⭐ Rating
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={9}>
                      <div style={{ fontSize: '14px', color: '#4a5568' }}>
                        <strong>Date:</strong>
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#718096' 
                      }}>
                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </Col>
                  </Row>
                  {item.reviewText && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#4a5568', 
                        marginBottom: '8px' 
                      }}>
                        <strong>Comment:</strong>
                      </div>
                      <div style={{ 
                        background: '#ffffff', 
                        borderRadius: '8px', 
                        padding: '12px', 
                        fontSize: '13px', 
                        color: '#2d3748', 
                        border: '1px solid #e2e8f0',
                        lineHeight: '1.5'
                      }}>
                        {item.reviewText}
                      </div>
                    </div>
                  )}
                </div>
              </List.Item>
            )} 
          />
        </div>
      </Modal>
      {/* Modal xác nhận cho Activate/Deactivate */}
      <Modal
        open={isConfirmModalVisible}
        onCancel={() => setIsConfirmModalVisible(false)}
        onOk={async () => {
          setIsConfirmModalVisible(false);
          if (confirmAction === 'deactivate') {
            try {
              await CourseManagementAPI.toggleSurveyActiveStatus(courseDetail.finalExamSurvey.surveyId, false);
              message.success('Exam deactivated successfully!');
              const data = await CourseAPI.getCourseById(id);
              setCourseDetail(data);
            } catch (error) {
              const apiMsg = error?.response?.data;
              if (typeof apiMsg === 'string') {
                message.error(apiMsg);
              } else if (apiMsg?.message) {
                message.error(apiMsg.message);
              } else {
                message.error('Failed to deactivate exam.');
              }
            }
          } else if (confirmAction === 'activate') {
            try {
              await CourseManagementAPI.toggleSurveyActiveStatus(courseDetail.finalExamSurvey.surveyId, true);
              message.success('Exam activated successfully!');
              const data = await CourseAPI.getCourseById(id);
              setCourseDetail(data);
            } catch (error) {
              const apiMsg = error?.response?.data;
              if (typeof apiMsg === 'string') {
                message.error(apiMsg);
              } else if (apiMsg?.message) {
                message.error(apiMsg.message);
              } else {
                message.error('Failed to activate exam.');
              }
            }
          }
          setConfirmAction(null);
        }}
        okText={confirmAction === 'deactivate' ? 'Deactivate' : 'Activate'}
        okType={confirmAction === 'deactivate' ? 'danger' : 'primary'}
        cancelText="Cancel"
        centered
      >
        <div>
          <p>Are you sure you want to {confirmAction === 'deactivate' ? 'deactivate' : 'activate'} this exam ?</p>
          <Typography.Text strong>{courseDetail?.finalExamSurvey?.surveyName}</Typography.Text>
          <p style={{ marginTop: 8, color: confirmAction === 'deactivate' ? '#ef4444' : '#52c41a' }}>
            {confirmAction === 'deactivate' ? 'Exam will be deactivated for this course.' : 'Exam will be activated for this course.'}
          </p>
        </div>
      </Modal>
    </div>
  );
} 