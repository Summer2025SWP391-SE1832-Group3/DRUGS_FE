import { useEffect, useState } from "react";
import { SurveyAPI } from "../../apis/survey";
import { Table, Space, Typography, message, Modal, Tag, List, Form, Input, Switch, Button, Select, Divider, InputNumber } from "antd";
import { ActionButton, CreateButton } from "../../components/ui/Buttons";
import StatusTag from "../../components/ui/StatusTag";

export default function ManageSurvey() {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [updateStatusModal, setUpdateStatusModal] = useState({ visible: false, survey: null });
    const [createModal, setCreateModal] = useState(false);
    const [updateModal, setUpdateModal] = useState({ visible: false, survey: null });
    const [form] = Form.useForm();
    const [surveyType] = useState("AddictionSurvey");
    const [courses, setCourses] = useState([]);

    let isManager = false;
    const userdata = localStorage.getItem('user');
    if (userdata) {
        try {
            const user = JSON.parse(userdata);
            isManager = user && user.role === "Manager";
        } catch { }
    }
    const fetchSurveys = async () => {
        setLoading(true);
        try {
            const data = await SurveyAPI.surveyType('AddictionSurvey');
            setSurveys((data || []));
        } catch (error) {
            message.error("Failed to fetch surveys");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSurveys();
    }, []);

    const handleUpdateStatus = async (isActive) => {
        if (!updateStatusModal.survey) return;
        try {
            await SurveyAPI.updateStatus(updateStatusModal.survey.surveyId, isActive);
            message.success("Survey status updated successfully");
            setUpdateStatusModal({ visible: false, survey: null });
            fetchSurveys();
        } catch (error) {
            message.error("Failed to update survey status");
        }
    };

    const handleView = (survey) => {
        setSelectedSurvey(survey);
        setModalVisible(true);
    };

    useEffect(() => {
        if (createModal) {
            // Không cần fetchCourses vì chỉ có AddictionSurvey
        }
    }, [createModal]);

    // const fetchCourses = async () => {
    //     try {
    //         const data = await CourseAPI.coursesWithoutSurvey();
    //         setCourses(data);
    //     } catch (error) {
    //         setCourses([]);
    //     }
    // };

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            const surveyData = {
                surveyName: values.surveyName,
                description: values.description,
                surveyType: "AddictionSurvey",
                isActive: values.isActive,
                questionsDto: values.questions.map(q => ({
                    questionText: q.questionText,
                    answersDto: q.answers.map(a => ({
                        answerText: a.answerText,
                        score: a.score,
                        isCorrect: false // luôn là false với AddictionSurvey
                    }))
                }))
            };
            await SurveyAPI.createSurvey(surveyData);
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
            surveyType: "AddictionSurvey",
            questions: [
                { questionText: '', answers: [{ answerText: '', score: 0 }] }
            ]
        });
    };

    const handleOpenUpdateModal = (survey) => {
        setUpdateModal({ visible: true, survey });
        form.setFieldsValue({
            surveyType: "AddictionSurvey",
            courseId: survey.courseId,
            surveyName: survey.surveyName,
            description: survey.description,
            questions: (survey.surveyQuestions || []).map(q => ({
                questionText: q.questionText,
                answers: (q.surveyAnswers || []).map(a => ({
                    answerText: a.answerText,
                    score: a.score,
                    isCorrect: false // luôn là false với AddictionSurvey
                }))
            }))
        });
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const surveyData = {
                surveyName: values.surveyName,
                description: values.description,
                surveyType: "AddictionSurvey",
                questions: values.questions.map((q, qIdx) => ({
                    questionId: updateModal.survey?.surveyQuestions?.[qIdx]?.questionId ?? 0,
                    questionText: q.questionText,
                    answersDTO: q.answers.map((a, aIdx) => ({
                        answerId: updateModal.survey?.surveyQuestions?.[qIdx]?.surveyAnswers?.[aIdx]?.answerId ?? 0,
                        answerText: a.answerText,
                        score: a.score,
                        isCorrect: false // luôn là false với AddictionSurvey
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
                    <ActionButton
                        className="view-btn"
                        onClick={() => handleView(record)}
                    >
                        View
                    </ActionButton>
                    <ActionButton
                        className="edit-btn"
                        onClick={() => handleOpenUpdateModal(record)}
                        disabled={record.hasRespondents}
                        style={record.hasRespondents ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                    >
                        Edit
                    </ActionButton>
                    <ActionButton
                        className="status-btn"
                        style={{ background: record.isActive ? '#f59e42' : '#22c55e', color: 'white' }}
                        onClick={() => setUpdateStatusModal({ visible: true, survey: record })}
                    >
                        {record.isActive ? 'Deactivate' : 'Activate'}
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
                open={updateStatusModal.visible}
                title="Update Survey Status"
                onCancel={() => setUpdateStatusModal({ visible: false, survey: null })}
                footer={null}
                centered
            >
                <div>
                    <p>Change status for survey:</p>
                    <Typography.Text strong>{updateStatusModal.survey?.surveyName}</Typography.Text>
                    <div style={{ marginTop: 16 }}>
                        <Switch
                            checked={updateStatusModal.survey?.isActive}
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                            onChange={checked => handleUpdateStatus(checked)}
                        />
                    </div>
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
                        <Input value="AddictionSurvey" disabled />
                    </Form.Item>
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
                    <Divider />
                    <Form.List name="questions">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, idx) => (
                                    <div key={field.key} style={{ marginBottom: 24, border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
                                        <Form.Item
                                            label={`Question ${idx + 1}`}
                                            name={[field.name, "questionText"]}
                                            rules={[
                                                { required: true, message: "Please input question" },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        const allQuestions = getFieldValue("questions") || [];
                                                        const duplicateCount = allQuestions.filter(
                                                            (q, qIdx) => q && q.questionText === value && qIdx !== field.name
                                                        ).length;
                                                        if (duplicateCount > 0) {
                                                            return Promise.reject("Questions must be unique.");
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]}
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
                                                                rules={[
                                                                    { required: true, message: "Answer required" },
                                                                    ({ getFieldValue }) => ({
                                                                        validator(_, value) {
                                                                            const allAnswers = getFieldValue(["questions", field.name, "answers"]) || [];
                                                                            const duplicateCount = allAnswers.filter(
                                                                                (a, idx) => a && a.answerText === value && idx !== ans.name
                                                                            ).length;
                                                                            if (duplicateCount > 0) {
                                                                                return Promise.reject("Answers in the same question must be unique.");
                                                                            }
                                                                            return Promise.resolve();
                                                                        }
                                                                    })
                                                                ]}
                                                                style={{ flex: 1, marginBottom: 0 }}
                                                            >
                                                                <Input placeholder={`Answer ${aidx + 1}`} />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name={[ans.name, "score"]}
                                                                rules={[
                                                                    { required: true, message: "Score required" }, 
                                                                    { type: "number", min: 0, max: 10, message: "Score must be between 0 and 10." },
                                                                    ({ getFieldValue }) => ({
                                                                        validator(_, value) {
                                                                            const allAnswers = getFieldValue(["questions", field.name, "answers"]) || [];
                                                                            const duplicateCount = allAnswers.filter(
                                                                                (a, aIdx) => a && a.score === value && aIdx !== ans.name
                                                                            ).length;
                                                                            if (duplicateCount > 0) {
                                                                                return Promise.reject("Scores in the same question must be different.");
                                                                            }
                                                                            return Promise.resolve();
                                                                        }
                                                                    })
                                                                ]}
                                                                style={{ width: 100, marginBottom: 0 }}
                                                            >
                                                                <InputNumber
                                                                    min={0}
                                                                    max={10}
                                                                    style={{ width: 80 }}
                                                                    onInput={e => {
                                                                        const value = Number(e.target.value);
                                                                        if (e.target.value !== "" && (value < 0 || value > 10)) {
                                                                            message.error("Score must be between 0 and 10.");
                                                                        }
                                                                    }}
                                                                    onChange={value => {
                                                                        if (value === undefined || value === null || value === "") return;
                                                                        if (value >= 0 && value <= 10) {
                                                                            form.setFields([
                                                                                {
                                                                                    name: ["questions", field.name, "answers", ans.name, "score"],
                                                                                    errors: []
                                                                                }
                                                                            ]);
                                                                        }
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                            {isManager && (
                                                                <Button danger onClick={() => removeAns(ans.name)} disabled={ansFields.length <= 1} style={{ marginBottom: 0 }}>
                                                                    Delete
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <Button type="dashed" onClick={() => addAns({ answerText: "", score: 0 })} block style={{ marginBottom: 8 }}>
                                                        Add Answer
                                                    </Button>
                                                </>
                                            )}
                                        </Form.List>
                                        <Button danger onClick={() => remove(field.name)} style={{ marginTop: 8 }} disabled={fields.length <= 1}>Delete Question</Button>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add({ questionText: "", answers: [{ answerText: "", score: 0 }] })} block>
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
                        <Input value="AddictionSurvey" disabled />
                    </Form.Item>
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
                    <Divider />
                    <Form.List name="questions">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, idx) => (
                                    <div key={field.key} style={{ marginBottom: 24, border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
                                        <Form.Item
                                            label={`Question ${idx + 1}`}
                                            name={[field.name, "questionText"]}
                                            rules={[
                                                { required: true, message: "Please input question" },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        const allQuestions = getFieldValue("questions") || [];
                                                        const duplicateCount = allQuestions.filter(
                                                            (q, qIdx) => q && q.questionText === value && qIdx !== field.name
                                                        ).length;
                                                        if (duplicateCount > 0) {
                                                            return Promise.reject("Questions must be unique.");
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]}
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
                                                                rules={[
                                                                    { required: true, message: "Answer required" },
                                                                    ({ getFieldValue }) => ({
                                                                        validator(_, value) {
                                                                            const allAnswers = getFieldValue(["questions", field.name, "answers"]) || [];
                                                                            const duplicateCount = allAnswers.filter(
                                                                                (a, idx) => a && a.answerText === value && idx !== ans.name
                                                                            ).length;
                                                                            if (duplicateCount > 0) {
                                                                                return Promise.reject("Answers in the same question must be unique.");
                                                                            }
                                                                            return Promise.resolve();
                                                                        }
                                                                    })
                                                                ]}
                                                                style={{ flex: 1, marginBottom: 0 }}
                                                            >
                                                                <Input placeholder={`Answer ${aidx + 1}`} />
                                                            </Form.Item>
                                                            <Form.Item
                                                                name={[ans.name, "score"]}
                                                                rules={[
                                                                    { required: true, message: "Score required" }, 
                                                                    { type: "number", min: 0, max: 10, message: "Score must be between 0 and 10." },
                                                                    ({ getFieldValue }) => ({
                                                                        validator(_, value) {
                                                                            const allAnswers = getFieldValue(["questions", field.name, "answers"]) || [];
                                                                            const duplicateCount = allAnswers.filter(
                                                                                (a, aIdx) => a && a.score === value && aIdx !== ans.name
                                                                            ).length;
                                                                            if (duplicateCount > 0) {
                                                                                return Promise.reject("Scores in the same question must be different.");
                                                                            }
                                                                            return Promise.resolve();
                                                                        }
                                                                    })
                                                                ]}
                                                                style={{ width: 100, marginBottom: 0 }}
                                                            >
                                                                <InputNumber
                                                                    min={0}
                                                                    max={10}
                                                                    style={{ width: 80 }}
                                                                    onInput={e => {
                                                                        const value = Number(e.target.value);
                                                                        if (e.target.value !== "" && (value < 0 || value > 10)) {
                                                                            message.error("Score must be between 0 and 10.");
                                                                        }
                                                                    }}
                                                                    onChange={value => {
                                                                        if (value === undefined || value === null || value === "") return;
                                                                        if (value >= 0 && value <= 10) {
                                                                            form.setFields([
                                                                                {
                                                                                    name: ["questions", field.name, "answers", ans.name, "score"],
                                                                                    errors: []
                                                                                }
                                                                            ]);
                                                                        }
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                            <Button danger onClick={() => removeAns(ans.name)} disabled={ansFields.length <= 1} style={{ marginBottom: 0 }}>
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    ))}
                                                    <Button type="dashed" onClick={() => addAns({ answerText: "", score: 0 })} block style={{ marginBottom: 8 }}>
                                                        Add Answer
                                                    </Button>
                                                </>
                                            )}
                                        </Form.List>
                                        <Button danger onClick={() => remove(field.name)} style={{ marginTop: 8 }} disabled={fields.length <= 1}>Delete Question</Button>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add({ questionText: "", answers: [{ answerText: "", score: 0 }] })} block>
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