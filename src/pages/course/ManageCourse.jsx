import React, { useState, useEffect } from 'react'
import { CreateButton, ActionButton } from '../../components/ui/Buttons'
import { Table, Modal, Form, Input, message, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CourseAPI } from '../../apis/course';
import StatusTag from '../../components/ui/StatusTag';

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

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await CourseAPI.getAllCourses();
            setCourses(data);
        } catch (error) {
            setCourses([]);
        }
    };

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
                    await CourseAPI.deleteCourse(course.id);
                    message.success('Course deleted successfully');
                    fetchCourses();
                } catch {
                    message.error('Failed to delete course');
                }
            }
        });
    };

    const handleViewCourse = (course) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role === 'Manager') {
            navigate(`/courseDetailsManager/${course.id}`);
        } else {
            navigate(`/courseDetailsStaff/${course.id}`);
        }
    };

    const handleModalOk = () => {
        form.validateFields().then(async values => {
            if (isEditMode && selectedCourse) {
                try {
                    await CourseAPI.updateCourse(selectedCourse.id, values);
                    message.success('Course updated successfully');
                    fetchCourses();
                } catch {
                    message.error('Failed to update course');
                }
            } else {
                try {
                    await CourseAPI.createCourse(values);
                    message.success('Course created successfully');
                    fetchCourses();
                } catch {
                    message.error('Failed to create course');
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
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
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
            render: (text) => {
                if (!text) return '';
                const words = text.split(' ');
                return words.length > 20
                    ? words.slice(0, 20).join(' ') + '...'
                    : text;
            },
        },
        {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <StatusTag color={isActive ? 'green' : 'red'}>
                  {isActive ? 'Active' : 'Inactive'}
                </StatusTag>
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
                    <ActionButton
                        className="delete-btn"
                        onClick={() => handleDelete(record)}
                        disabled={!record.isActive}
                        style={!record.isActive ? { opacity: 0.4 } : {}}
                    >
                        Delete
                    </ActionButton>
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
                        rules={[{ required: true, message: 'Please input the course topic!' }]}
                    >
                        <Input />
                    </Form.Item>
                    
                </Form>
            </Modal>
        </div>
    )
}
