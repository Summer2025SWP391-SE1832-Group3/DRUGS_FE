import React, { useState, useEffect } from 'react'
import { CreateButton, ActionButton } from '../../components/ui/Buttons'
import { Table, Modal, Form, Input, message, Space, Typography, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CourseManagementAPI } from '../../apis/courseManagement';
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
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState("");
    const [searching, setSearching] = useState(false);
    const [topicFilter, setTopicFilter] = useState('All');

    let isManager = false;
    const userdata = localStorage.getItem('user');
    if (userdata) {
        try {
            const user = JSON.parse(userdata);
            isManager = user && user.role === "Manager";
        } catch { }
    }

    useEffect(() => {
        fetchCourses(statusFilter);
        
    }, [statusFilter]);

    useEffect(() => {
        
        fetchCourses('');
        
    }, []);

    const fetchCourses = async (status) => {
        try {
            let data = [];
            if (isManager) {
                data = await CourseManagementAPI.getAllCoursesManager(status);
            } else {
                // Staff: chỉ lấy draft
                data = await CourseManagementAPI.getDraftCourses();
            }
            const sortedData = Array.isArray(data)
                ? [...data].sort((a, b) => b.id - a.id)
                : [];
            setCourses(sortedData);
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

    const handleViewCourse = (course) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && (user.role === 'Manager' || user.role === 'Staff')) {
            navigate(`/courseDetailsManage/${course.id}`, { state: { status: course.status } });
        } else {
            navigate(`/`);
        }
    };

    const handleToggleStatus = async (course) => {
        try {
            if (course.status === 'Draft' || course.status === 'Inactive') {
                await CourseManagementAPI.approveCourse(course.id);
                message.success('Course has been activated.');
            } else if (course.status === 'Active') {
                message.info('This course is already active.');
            } else {
                message.info('You can only approve a course to Active status.');
            }
            fetchCourses(statusFilter);
        } catch (error) {
            const apiMsg = error?.response?.data;
            if (typeof apiMsg === 'string') {
                message.error(apiMsg);
            } else if (apiMsg?.message) {
                message.error(apiMsg.message);
            } else {
                message.error('Failed to activate course.');
            }
        }
    };

    const handleModalOk = () => {
        form.validateFields().then(async values => {
            if (isEditMode && selectedCourse) {
                try {
                    await CourseManagementAPI.updateCourse(selectedCourse.id, values);
                    message.success('Course updated successfully');
                    fetchCourses(statusFilter);
                } catch {
                    message.error('Failed to update course');
                }
            } else {
                try {
                    const response = await CourseManagementAPI.createCourse(values);
                    message.success('Course created successfully');
                    setIsModalVisible(false);
                    form.resetFields();
                    if (response && response.courseId) {
                        navigate(`/courseDetailsManage/${response.courseId}`, { state: { status: 'Draft' } });
                    } else {
                        fetchCourses(statusFilter);
                    }
                } catch {
                    message.error('Failed to create course');
                }
            }
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleDeactivate = (course) => {
        if (course.status === 'Inactive') {
            message.info('Course has been already deactivated.');
            return;
        }
        Modal.confirm({
            title: 'Deactivate Course',
            content: `Are you sure you want to deactivate "${course.title}"?`,
            okText: 'Deactivate',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await CourseManagementAPI.deactivateCourse(course.id);
                    message.success('Course deactivated successfully');
                    fetchCourses(statusFilter);
                } catch (error) {
                    const apiMsg = error?.response?.data;
                    if (typeof apiMsg === 'string') {
                        message.error(apiMsg);
                    } else if (apiMsg?.message) {
                        message.error(apiMsg.message);
                    } else {
                        message.error('Failed to deactivate course.');
                    }
                }
            }
        });
    };

    const handleSearch = async () => {
        setSearching(true);
        try {
            if (searchTerm.trim() === "") {
                fetchCourses(statusFilter);
            } else if (isManager) {
                const data = await CourseManagementAPI.searchCourseByTitle(searchTerm, statusFilter);
                setCourses(Array.isArray(data) ? data : []);
            } else {
                
                const data = await CourseManagementAPI.searchCourseByTitle(searchTerm, 'Draft');
                setCourses(Array.isArray(data) ? data : []);
            }
        } catch {
            setCourses([]);
        } finally {
            setSearching(false);
        }
    };

    const handleTopicFilter = async (topic) => {
        setTopicFilter(topic);
        if (topic === 'All') {
            fetchCourses(statusFilter);
        } else {
            try {
                if (isManager) {
                    const data = await CourseManagementAPI.filterCourseByTopic(topic, statusFilter);
                    setCourses(Array.isArray(data) ? data : []);
                } else {
                    
                    const data = await CourseManagementAPI.filterCourseByTopic(topic, 'Draft');
                    setCourses(Array.isArray(data) ? data : []);
                }
            } catch {
                setCourses([]);
            }
        }
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
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'red';
                let text = 'INACTIVE';
                if (status === 'Active') {
                    color = 'green';
                    text = 'ACTIVE';
                } else if (status === 'Draft') {
                    color = 'gold';
                    text = 'DRAFT';
                }
                return (
                    <StatusTag color={color}>
                        {text}
                    </StatusTag>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <ActionButton className="view-btn" onClick={() => handleViewCourse(record)}>
                        View
                    </ActionButton>
                    {isManager && (
                        <ActionButton className="edit-btn" onClick={() => showEditModal(record)}>
                            Edit
                        </ActionButton>
                    )}
                    {isManager && (
                        <ActionButton
                            className="deactivate-btn"
                            onClick={() => handleDeactivate(record)}
                            disabled={record.status === 'Active'}
                            style={{ background: '#ff4d4f', color: 'white', border: 'none', opacity: record.status === 'Active' ? 0.4 : 1, cursor: record.status === 'Active' ? 'not-allowed' : 'pointer' }}
                        >
                            Deactivate
                        </ActionButton>
                    )}
                    {isManager && (
                        <Button size="small" onClick={() => handleToggleStatus(record)}>
                            Activate
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {isManager && (
                        <Select
                            value={statusFilter}
                            onChange={value => setStatusFilter(value)}
                            style={{ width: 120 }}
                        >
                            <Select.Option value="">All</Select.Option>
                            <Select.Option value="Active">Active</Select.Option>
                            <Select.Option value="Inactive">Inactive</Select.Option>
                            <Select.Option value="Draft">Draft</Select.Option>
                        </Select>
                    )}
                    <Select
                        value={topicFilter}
                        onChange={handleTopicFilter}
                        style={{ width: 150 }}
                    >
                        <Select.Option value="All">All Topics</Select.Option>
                        <Select.Option value="Awareness">Awareness</Select.Option>
                        <Select.Option value="Prevention">Prevention</Select.Option>
                        <Select.Option value="Refusal">Refusal</Select.Option>
                    </Select>
                    <Input
                        placeholder="Search course by title..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        onPressEnter={handleSearch}
                        style={{ width: 300 }}
                        allowClear
                        disabled={searching}
                    />
                    <Button type="primary" onClick={handleSearch} loading={searching}>Search</Button>
                </div>
                {isManager && (
                    <CreateButton onClick={showCreateModal} style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 600, fontSize: 16 }}>Create New Course</CreateButton>
                )}
            </div>
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
                        rules={[{ required: true, message: 'Please select the course topic!' }]}
                    >
                        <Select placeholder="Select topic">
                            <Select.Option value="Awareness">Awareness</Select.Option>
                            <Select.Option value="Prevention">Prevention</Select.Option>
                            <Select.Option value="Refusal">Refusal</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
