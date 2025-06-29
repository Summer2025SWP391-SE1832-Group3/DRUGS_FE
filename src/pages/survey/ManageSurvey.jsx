import { useEffect, useState } from "react";
import { SurveyAPI } from "../../apis/survey";
import { Table, Space, Typography, message, Tag, Modal, List, Form, Input, Switch, Button, Select, Divider } from "antd";
import { ActionButton, CreateButton } from "../../components/ui/Buttons";

export default function ManageSurvey() {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ visible: false, survey: null });
    const [createModal, setCreateModal] = useState(false);
    const [form] = Form.useForm();

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

    const handleCreate = async () => {
        try {
            const values = await form.validateFields();
            console.log(values);
            const surveyData = {
                SurveyName: values.surveyName,
                Description: values.description,
                SurveyType: values.surveyType,
                IsActive: values.isActive,
                QuestionsDto: values.questions.map(q => ({
                    QuestionText: q.questionText,
                    AnswersDto: q.answers.map(a => ({
                        AnswerText: a.answerText,
                        Score: a.score,
                        IsCorrect: !!a.isCorrect
                    }))
                }))
            };
            console.log('Survey body:', surveyData);
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
            questions: [
                { questionText: '', answers: [{ answerText: '', score: 0, isCorrect: false }] }
            ]
        });
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
            render: (active) => active ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
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
                    <ActionButton
                        className="delete-btn"
                        danger
                        disabled={!record.isActive}
                        style={!record.isActive ? { opacity: 0.9, pointerEvents: 'none' } : {}}
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
                Manage Surveys
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
                        <List.Item>
                            <span>{q.questionText}</span>
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
                        label="Survey Type"
                        name="surveyType"
                        rules={[{ required: true, message: "Survey type is required" }]}
                        initialValue="AddictionSurvey"
                    >
                        <Select>
                            <Select.Option value="AddictionSurvey">Addiction Survey</Select.Option>
                        </Select>
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
                                                                rules={[{ required: true, message: "Score required" }]}
                                                                style={{ width: 100, marginBottom: 0 }}
                                                            >
                                                                <Input type="number" placeholder="Score" style={{ width: 80 }} />
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
                                                    <Button type="dashed" onClick={() => addAns({ answerText: "", score: 0 })} block style={{ marginBottom: 8 }}>
                                                        Add Answer
                                                    </Button>
                                                </>
                                            )}
                                        </Form.List>
                                        <Button danger onClick={() => remove(field.name)} style={{ marginTop: 8 }} disabled={fields.length <= 1}>Delete Question</Button>
                                    </div>
                                ))}
                                <Button type="dashed" onClick={() => add({ questionText: "", answers: [{ answerText: "", score: 0, isCorrect: false }] })} block>
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