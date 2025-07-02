import { useEffect, useState } from "react";
import { SurveyAPI } from "../../apis/survey";
import { CourseAPI } from '../../apis/course';
import { Table, Space, Typography, message, Modal, Tag, List, Form, Input, Switch, Button, Select, Divider } from "antd";
import { ActionButton, CreateButton } from "../../components/ui/Buttons";
import StatusTag from "../../components/ui/StatusTag";

export default function ManageSurvey() {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ visible: false, survey: null });
    const [createModal, setCreateModal] = useState(false);
    const [updateModal, setUpdateModal] = useState({ visible: false, survey: null });
    const [form] = Form.useForm();
    const [surveyType, setSurveyType] = useState("AddictionSurvey");
    const [courses, setCourses] = useState([]);

    const fetchSurveys = async () => {
        setLoading(true);
        try {
            const data = await SurveyAPI.getAllSurvey();
            setSurveys(data);
        } catch (error) {
            message.error("Failed to fetch surveys");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSurveys();
    }, []);

    const handleDelete = async () => {
        if (!deleteModal.survey) return;
        try {
            await SurveyAPI.deleteSurvey(deleteModal.survey.surveyId);
            message.success("Survey deleted successfully");
            setDeleteModal({ visible: false, survey: null });
            fetchSurveys();
        } catch (error) {
            message.error("Failed to delete survey");
        }
    };

    const handleView = (survey) => {
        setSelectedSurvey(survey);
        setModalVisible(true);
    };

    useEffect(() => {
        if (createModal && surveyType === "CourseTest") {
            fetchCourses();
        }
    }, [createModal, surveyType]);

    const fetchCourses = async () => {
        try {
            const data = await CourseAPI.getAllCourses();
            setCourses(data);
        } catch (error) {
            setCourses([]);
        }
    };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            const surveyTypeValue = values.surveyType;
            const courseIdValue = surveyTypeValue === "CourseTest" ? values.courseId : undefined;
            const surveyData = {
                surveyName: values.surveyName,
                description: values.description,
                surveyType: surveyTypeValue,
                isActive: values.isActive,
                questionsDto: values.questions.map(q => ({
                    questionText: q.questionText,
                    answersDto: q.answers.map(a => ({
                        answerText: a.answerText,
                        score: surveyTypeValue === "CourseTest" ? null : a.score,
                        isCorrect: !!a.isCorrect
                    }))
                }))
            };
            
            await SurveyAPI.createSurvey(surveyData, courseIdValue);
            message.success("Survey created successfully!");
            setCreateModal(false);
            form.resetFields();
            fetchSurveys();
        } catch (error) {
            message.error("Failed to create survey");
            console.error(error);
        }
    };

    const handleOpenCreateModal = () => {
        setCreateModal(true);
        form.setFieldsValue({
            questions: [
                { questionText: '', answers: [{ answerText: '', score: surveyType === 'CourseTest' ? null : 0, isCorrect: false }] }
            ]
        });
    };

    const handleOpenUpdateModal = (survey) => {
        setUpdateModal({ visible: true, survey });
        form.setFieldsValue({
            surveyType: survey.surveyType || 'AddictionSurvey',
            courseId: survey.courseId,
            surveyName: survey.surveyName,
            description: survey.description,
            isActive: survey.isActive,
            questions: (survey.surveyQuestions || []).map(q => ({
                questionText: q.questionText,
                answers: (q.surveyAnswers || []).map(a => ({
                    answerText: a.answerText,
                    score: a.score,
                    isCorrect: !!a.isCorrect
                }))
            }))
        });
        setSurveyType(survey.surveyType || 'AddictionSurvey');
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const surveyTypeValue = values.surveyType;
            const courseIdValue = surveyTypeValue === "CourseTest" ? values.courseId : undefined;
            const surveyData = {
                surveyName: values.surveyName,
                description: values.description,
                surveyType: surveyTypeValue,
                isActive: values.isActive,
                questions: values.questions.map((q, qIdx) => ({
                    questionId: updateModal.survey?.surveyQuestions?.[qIdx]?.questionId ?? 0,
                    questionText: q.questionText,
                    answersDTO: q.answers.map((a, aIdx) => ({
                        answerId: updateModal.survey?.surveyQuestions?.[qIdx]?.surveyAnswers?.[aIdx]?.answerId ?? 0,
                        answerText: a.answerText,
                        score: surveyTypeValue === "CourseTest" ? null : a.score,
                        isCorrect: !!a.isCorrect
                    }))
                }))
            };
            await SurveyAPI.updateSurvey(updateModal.survey.surveyId, surveyData);
            message.success("Survey updated successfully!");
            setUpdateModal({ visible: false, survey: null });
            form.resetFields();
            fetchSurveys();
        } catch (error) {
            message.error("Failed to update survey");
            console.error(error);
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "surveyId",
            key: "surveyId",
            width: 80,
        },
        {
            title: "Name",
            dataIndex: "surveyName",
            key: "surveyName",
            render: (text) => <b>{text}</b>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (text) => <Typography.Paragraph ellipsis={{ rows: 2 }}>{text}</Typography.Paragraph>,
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (active) => active ? <StatusTag color="green">Active</StatusTag> : <StatusTag color="red">Inactive</StatusTag>,
            width: 100,
        },
        {
            title: "Questions",
            dataIndex: "surveyQuestions",
            key: "questionsCount",
            render: (questions) => questions?.length || 0,
            width: 100,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <ActionButton className="view-btn" onClick={() => handleView(record)}>
                        View
                    </ActionButton>
                    <ActionButton className="edit-btn" onClick={() => handleOpenUpdateModal(record)}>
                        Edit
                    </ActionButton>
                    <ActionButton
                        className="delete-btn"
                        danger
                        disabled={!record.isActive}
                        style={!record.isActive ? { opacity: 0.4} : {}}
                        onClick={() => record.isActive && setDeleteModal({ visible: true, survey: record })}
                    >
                        Delete
                    </ActionButton>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ width: "100%", margin: "0 auto", padding: 20, fontFamily: 'Inter, Roboto, Arial, sans-serif', background: '#f8f9fb', minHeight: '100vh' }}>
            {/* Google Fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
            <Typography.Title level={2} style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 700, color: '#2c3e50', letterSpacing: '-1px' }}>
                Manage Survey
            </Typography.Title>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <CreateButton onClick={handleOpenCreateModal}>Create Survey</CreateButton>
            </div>
            <Table
                columns={columns}
                dataSource={surveys}
                rowKey="surveyId"
                loading={loading}
                pagination={{ pageSize: 5 }}
                style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', background: 'white', borderRadius: 12, boxShadow: '0 4px 24px rgba(34,76,139,0.08)' }}
                size="middle"
                bordered
            />
            <style>{`
        .ant-table-thead > tr > th {
          background: #f0f4fa !important;
          font-family: 'Inter', 'Roboto', Arial, sans-serif !important;
          font-weight: 600 !important;
          color: #34495e !important;
          font-size: 16px !important;
        }
        .ant-table-tbody > tr > td {
          font-family: 'Inter', 'Roboto', Arial, sans-serif !important;
          font-size: 15px !important;
          color: #2c3e50 !important;
        }
        .ant-table {
          border-radius: 12px !important;
        }
        .ant-btn {
          font-family: 'Inter', 'Roboto', Arial, sans-serif !important;
        }
        .ant-modal-title {
          font-family: 'Inter', 'Roboto', Arial, sans-serif !important;
          font-weight: 700 !important;
          color: #2c3e50 !important;
        }
        .ant-modal-content {
          font-family: 'Inter', 'Roboto', Arial, sans-serif !important;
        }
      `}</style>
            <Modal
                open={modalVisible}
                title={selectedSurvey?.surveyName}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={600}
            >
                <Typography.Paragraph><b>Description:</b> {selectedSurvey?.description}</Typography.Paragraph>
                <Typography.Paragraph><b>Status:</b> {selectedSurvey?.isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}</Typography.Paragraph>
                <Typography.Paragraph><b>Questions:</b></Typography.Paragraph>
                <List
                    dataSource={selectedSurvey?.surveyQuestions || []}
                    renderItem={q => (
                        <List.Item style={{ display: 'block' }}>
                            <div style={{ marginBottom: 4 }}><b>{q.questionText}</b></div>
                            <ul style={{ marginLeft: 16, marginBottom: 0 }}>
                                {q.surveyAnswers?.map(a => (
                                    <li key={a.answerId}>
                                        <span>{a.answerText}</span>
                                        {typeof a.score === 'number' && (
                                            <span style={{ color: '#888', marginLeft: 8 }}>(Score: {a.score})</span>
                                        )}
                                        {a.isCorrect && (
                                            <Tag color="green" style={{ marginLeft: 8 }}>Correct</Tag>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </List.Item>
                    )}
                    locale={{ emptyText: 'No questions' }}
                />
            </Modal>
            {/* Delete confirmation modal */}
            <Modal
                open={deleteModal.visible}
                title="Delete Confirmation"
                onCancel={() => setDeleteModal({ visible: false, survey: null })}
                onOk={handleDelete}
                okText="Delete"
                okType="danger"
                cancelText="Cancel"
                centered
            >
                <div>
                    <p>Are you sure you want to delete this survey?</p>
                    <Typography.Text strong>{deleteModal.survey?.surveyName}</Typography.Text>
                    <p style={{ marginTop: 8, color: '#ef4444' }}>This action cannot be undone.</p>
                </div>
            </Modal>
            <Modal
                open={createModal}
                title="Create New Survey"
                onCancel={() => {
                    setCreateModal(false);
                    form.resetFields();
                }}
                onOk={handleCreate}
                width={800}
                okText="Create"
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Survey Type"
                        name="surveyType"
                        initialValue="AddictionSurvey"
                        rules={[{ required: true, message: "Survey type is required" }]}
                    >
                        <Select onChange={value => setSurveyType(value)}>
                            <Select.Option value="AddictionSurvey">Addiction Survey</Select.Option>
                            <Select.Option value="CourseTest">Course Test</Select.Option>
                        </Select>
                    </Form.Item>
                    {surveyType === "CourseTest" && (
                        <Form.Item
                            label="Course"
                            name="courseId"
                            rules={[{ required: true, message: "Please select a course" }]}
                        >
                            <Select placeholder="Select a course">
                                {courses.map(course => (
                                    <Select.Option key={course.id} value={course.id}>{course.title}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Survey Name"
                        name="surveyName"
                        rules={[{ required: true, message: "Survey name is required" }]}
                    >
                        <Input placeholder="Enter survey name" />
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
                                                                rules={surveyType === "CourseTest" ? [] : [{ required: true, message: "Score required" }]}
                                                                style={{ width: 100, marginBottom: 0 }}
                                                            >
                                                                <Input type="number" placeholder="Score" style={{ width: 80 }} disabled={surveyType === "CourseTest"} />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name={[ans.name, "isCorrect"]}
                                                                valuePropName="checked"
                                                                style={{ marginBottom: 0 }}
                                                            >
                                                                <Switch checkedChildren="Correct" unCheckedChildren="Wrong" />
                                                            </Form.Item>
                                                            <Button danger onClick={() => removeAns(ans.name)} disabled={ansFields.length <= 1} style={{ marginBottom: 0 }}>
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button type="dashed" onClick={() => addAns({ answerText: "", score: surveyType === 'CourseTest' ? null : 0, isCorrect: false })} block style={{ marginBottom: 8 }}>
                                                        Add Answer
                                                    </Button>
                                                </>
                                            )}
                                        </Form.List>
                                        <Button danger onClick={() => remove(field.name)} style={{ marginTop: 8 }} disabled={fields.length <= 1}>Delete Question</Button>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add({ questionText: "", answers: [{ answerText: "", score: surveyType === 'CourseTest' ? null : 0, isCorrect: false }] })} block>
                                    Add Question
                                </Button>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
            <Modal
                open={updateModal.visible}
                title="Update Survey"
                onCancel={() => {
                    setUpdateModal({ visible: false, survey: null });
                    form.resetFields();
                }}
                onOk={handleUpdate}
                width={800}
                okText="Update"
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Survey Type"
                        name="surveyType"
                        initialValue="AddictionSurvey"
                        rules={[{ required: true, message: "Survey type is required" }]}
                    >
                        <Select onChange={value => setSurveyType(value)}>
                            <Select.Option value="AddictionSurvey">Addiction Survey</Select.Option>
                            <Select.Option value="CourseTest">Course Test</Select.Option>
                        </Select>
                    </Form.Item>
                    {surveyType === "CourseTest" && (
                        <Form.Item
                            label="Course"
                            name="courseId"
                            rules={[{ required: true, message: "Please select a course" }]}
                        >
                            <Select placeholder="Select a course">
                                {courses.map(course => (
                                    <Select.Option key={course.id} value={course.id}>{course.title}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Survey Name"
                        name="surveyName"
                        rules={[{ required: true, message: "Survey name is required" }]}
                    >
                        <Input placeholder="Enter survey name" />
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
                                                                rules={surveyType === "CourseTest" ? [] : [{ required: true, message: "Score required" }]}
                                                                style={{ width: 100, marginBottom: 0 }}
                                                            >
                                                                <Input type="number" placeholder="Score" style={{ width: 80 }} disabled={surveyType === "CourseTest"} />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name={[ans.name, "isCorrect"]}
                                                                valuePropName="checked"
                                                                style={{ marginBottom: 0 }}
                                                            >
                                                                <Switch checkedChildren="Correct" unCheckedChildren="Wrong" />
                                                            </Form.Item>
                                                            <Button danger onClick={() => removeAns(ans.name)} disabled={ansFields.length <= 1} style={{ marginBottom: 0 }}>
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button type="dashed" onClick={() => addAns({ answerText: "", score: surveyType === 'CourseTest' ? null : 0, isCorrect: false })} block style={{ marginBottom: 8 }}>
                                                        Add Answer
                                                    </Button>
                                                </>
                                            )}
                                        </Form.List>
                                        <Button danger onClick={() => remove(field.name)} style={{ marginTop: 8 }} disabled={fields.length <= 1}>Delete Question</Button>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add({ questionText: "", answers: [{ answerText: "", score: surveyType === 'CourseTest' ? null : 0, isCorrect: false }] })} block>
                                    Add Question
                                </Button>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
}