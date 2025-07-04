import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, Row, Col, Tag, Collapse, Modal, Form, Input, Select, message, Upload, Button, List, Switch, Divider } from 'antd';
import { CourseAPI } from '../../apis/course';
import { LessonAPI } from '../../apis/lesson';
import { PlayCircleOutlined, BookOutlined, ClockCircleOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { ActionButton, CreateButton } from '../../components/ui/Buttons';
import { SurveyAPI } from '../../apis/survey';

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

  // Determine user role for permission
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
      await CourseAPI.updateCourse(courseDetail.id, values);
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
    createExamForm.resetFields();
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
      examType: courseDetail.finalExamSurvey.surveyType,
      isActive: courseDetail.finalExamSurvey.isActive,
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
        isActive: values.isActive,
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
      const data = await CourseAPI.getCourseDetail(id);
      setCourseDetail(data);
    } catch (error) {
      message.error('Failed to update exam');
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

  const handleDeleteExam = async () => {
    try {
      await SurveyAPI.deleteSurvey(courseDetail.finalExamSurvey.surveyId);
      message.success('Exam deleted successfully!');
      setIsDeleteExamModalVisible(false);
      // Refresh course detail
      const data = await CourseAPI.getCourseDetail(id);
      setCourseDetail(data);
    } catch (error) {
      message.error('Failed to delete exam');
    }
  };

  const handleDeleteExamCancel = () => {
    setIsDeleteExamModalVisible(false);
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
                  {/* If you have duration, show it here */}
                  {/* <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <ClockCircleOutlined style={{ fontSize: 20, color: 'white', marginRight: 8 }} />
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>
                      30 minutes to complete
                    </Text>
                  </div> */}
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
                        <ActionButton className="delete-btn" danger onClick={e => { e.stopPropagation(); showDeleteExamModal(); }}>
                          Delete
                        </ActionButton>
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
          initialValues={{ isActive: true, examType: 'AddictionSurvey', questions: [{ answers: [{}] }] }}
        >
          <Form.Item
            label="Exam Type"
            name="examType"
            initialValue="AddictionSurvey"
            rules={[{ required: true, message: "Exam type is required" }]}
          >
            <Input placeholder="Enter exam type" />
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
            initialValue={true}
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
                                style={{ margin: 0 }}
                              >
                                <Switch />
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
          initialValues={{ isActive: true, examType: 'AddictionSurvey', questions: [{ answers: [{}] }] }}
        >
          <Form.Item
            label="Exam Type"
            name="examType"
            initialValue="AddictionSurvey"
            rules={[{ required: true, message: "Exam type is required" }]}
          >
            <Input placeholder="Enter exam type" />
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
            initialValue={true}
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
                                style={{ margin: 0 }}
                              >
                                <Switch />
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
        title="Delete Exam"
        onCancel={handleDeleteExamCancel}
        onOk={handleDeleteExam}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
        centered
      >
        <div>
          <p>Are you sure you want to delete this exam?</p>
          <Typography.Text strong>{courseDetail?.finalExamSurvey?.surveyName}</Typography.Text>
          <p style={{ marginTop: 8, color: '#ef4444' }}>This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
} 