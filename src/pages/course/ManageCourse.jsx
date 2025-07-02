import React, { useState, useEffect } from 'react'
import { CreateButton, ActionButton } from '../../components/ui/Buttons'
import { Table, Modal, Form, Input, message, Space, Typography, Select, Tag, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAllCourses, postCourse, updateCourse, deleteCourse } from '../../apis/course';

const { Title, Paragraph } = Typography;

export default function ManageCourse() {
    const [courses, setCourses] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    let isManager = false;
    const userdata = localStorage.getItem('user');
    if (userdata) {
        try {
            const user = JSON.parse(userdata);
            isManager = user && user.role === "Manager";
        } catch { }
    }

    const fetchCourses = async () => {
        try {
            const res = await getAllCourses();
            setCourses(
              res.data.map((item, idx) => ({
                id: item.id,
                title: item.title || '',
                description: item.description || '',
                topic: item.topic || '',
                createdBy: item.createdBy || '',
                createdAt: item.createdAt || '',
                isActive: item.isActive ?? true,
              }))
            );
        } catch (error) {
            message.error('Failed to fetch courses: ' + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const showCreateModal = () => {
        setIsEditMode(false);
        setSelectedCourse(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const showEditModal = (course) => {
        setIsEditMode(true);
        setSelectedCourse(course);
        form.setFieldsValue(course);
        setIsModalVisible(true);
    };

    const handleDelete = (course) => {
        Modal.confirm({
            title: 'Delete Course',
            content: `Are you sure you want to delete "${course.title}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await deleteCourse(course.id);
                    message.success('Course deleted successfully');
                    fetchCourses();
                } catch (error) {
                    message.error('Failed to delete course: ' + (error.response?.data?.message || error.message));
                }
            }
        });
    };

    const handleViewCourse = (course) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'Manager') {
            navigate(`/courseDetails/${course.id}`);
        } else {
            navigate(`/courseDetailsStaff/${course.id}`);
        }
    };

    const handleToggleStatus = async (course) => {
        try {
            await updateCourse(course.id, { ...course, isActive: !course.isActive });
            message.success('Course status updated');
            fetchCourses();
        } catch (error) {
            message.error('Failed to update status: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleModalOk = () => {
        form.validateFields().then(async values => {
            if (isEditMode && selectedCourse) {
                try {
                    await updateCourse(selectedCourse.id, values);
                    message.success('Course updated successfully');
                    fetchCourses();
                } catch (error) {
                    message.error('Failed to update course: ' + (error.response?.data?.message || error.message));
                    return;
                }
            } else {
                try {
                    await postCourse(values);
                    message.success('Course created successfully');
                    fetchCourses();
                } catch (error) {
                    message.error('Failed to create course: ' + (error.response?.data?.message || error.message));
                    return;
                }
            }
            setIsModalVisible(false);
            form.resetFields();
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => <b>{text}</b>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (
                <Paragraph
                    style={{
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        maxWidth: 400,
                        marginBottom: 0
                    }}
                    ellipsis={false}
                >
                    {text}
                </Paragraph>
            ),
        },
        {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
            render: (text) => text || '',
        },
        {
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
            render: (text) => text || '',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => date ? new Date(date).toLocaleDateString() : '',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'status',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <ActionButton className="view-btn" onClick={() => handleViewCourse(record)}>
                        View
                    </ActionButton>
                    <ActionButton className="edit-btn" onClick={() => showEditModal(record)}>
                        Edit
                    </ActionButton>
                    <ActionButton className="delete-btn" onClick={() => handleDelete(record)}>
                        Delete
                    </ActionButton>
                    {isManager && (
                        <Button size="small" onClick={() => handleToggleStatus(record)}>
                            {record.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ width: "100%", margin: '0 auto', padding: 20, fontFamily: 'Inter, Roboto, Arial, sans-serif', background: '#f8f9fb', minHeight: '100vh' }}>
            {/* Google Fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
            <Title level={2} style={{ marginBottom: 0, fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 700, color: '#2c3e50', letterSpacing: '-1px' }}>Manage Course</Title>
            {isManager && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 0 }}>
                    <CreateButton onClick={showCreateModal} style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 16 }}>Create New Course</CreateButton>
                </div>
            )}
            <Table
                columns={columns}
                dataSource={courses}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                style={{ marginTop: 0, fontFamily: 'Inter, Roboto, Arial, sans-serif', background: 'white', borderRadius: 12, boxShadow: '0 4px 24px rgba(34,76,139,0.08)' }}
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
      `}</style>
            <Modal
                title={isEditMode ? 'Edit Course' : 'Create New Course'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText={isEditMode ? 'Update' : 'Create'}
                destroyOnHidden
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ title: '', description: '' }}
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
                        initialValue="Awareness"
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
        </div>
    )
}
