import React, { useState, useEffect } from 'react'
import { CreateButton, ActionButton } from '../../components/ui/Buttons'
import { Table, Modal, Form, Input, message, Space, Typography, Button, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CourseManagementAPI } from '../../apis/courseManagement';
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

    // Add event listeners to handle scroll issues
    useEffect(() => {
        const handleSelectOpen = () => {
            document.body.style.overflow = 'hidden';
        };
        
        const handleSelectClose = () => {
            document.body.style.overflow = '';
        };

        // Listen for select dropdown events
        document.addEventListener('ant-select-dropdown-open', handleSelectOpen);
        document.addEventListener('ant-select-dropdown-close', handleSelectClose);

        return () => {
            document.removeEventListener('ant-select-dropdown-open', handleSelectOpen);
            document.removeEventListener('ant-select-dropdown-close', handleSelectClose);
            document.body.style.overflow = '';
        };
    }, []);

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
        console.log('Topic filter changed to:', topic); // Debug log
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
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            dropdownStyle={{ zIndex: 9999 }}
                            onDropdownVisibleChange={(open) => {
                                if (open) {
                                    document.body.style.overflow = 'hidden';
                                } else {
                                    document.body.style.overflow = '';
                                }
                            }}
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
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        dropdownStyle={{ zIndex: 9999 }}
                        onDropdownVisibleChange={(open) => {
                            if (open) {
                                document.body.style.overflow = 'hidden';
                            } else {
                                document.body.style.overflow = '';
                            }
                        }}
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
        
        /* Fix dropdown issues */
        .ant-select-dropdown {
          z-index: 9999 !important;
          position: absolute !important;
          overflow: visible !important;
        }
        .ant-select-selector {
          z-index: 1 !important;
        }
        .ant-select-focused .ant-select-selector {
          z-index: 2 !important;
        }
        /* Ensure dropdown options are visible */
        .ant-select-item {
          position: relative !important;
          z-index: 1 !important;
        }
        /* Override any conflicting CSS */
        .ant-select-dropdown .ant-select-item-option {
          background: white !important;
          color: #333 !important;
        }
        .ant-select-dropdown .ant-select-item-option:hover {
          background: #f5f5f5 !important;
        }
        /* Ensure container doesn't clip dropdown */
        .ant-select {
          position: relative !important;
          z-index: 1 !important;
        }
        /* Fix modal dropdown issues */
        .ant-modal .ant-select-dropdown {
          z-index: 10000 !important;
        }
        .ant-modal .ant-select {
          z-index: 1 !important;
        }
        /* Ensure all dropdowns are visible */
        .ant-select-dropdown:not(.ant-select-dropdown-hidden) {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        /* Fix scroll issues */
        .ant-select-dropdown {
          overflow: visible !important;
          overflow-x: visible !important;
          overflow-y: visible !important;
        }
        /* Prevent unwanted scroll on body when dropdown opens */
        body.ant-select-dropdown-open {
          overflow: hidden !important;
        }
        /* Ensure dropdown container doesn't cause scroll */
        .ant-select-dropdown .ant-select-dropdown-menu {
          overflow: visible !important;
          max-height: none !important;
        }
        /* Fix any container overflow issues */
        .ant-select {
          overflow: visible !important;
        }
        /* Ensure parent containers don't clip dropdown */
        .ant-select-dropdown {
          position: fixed !important;
          z-index: 9999 !important;
        }
        /* Fix container overflow issues */
        .ant-select-dropdown .ant-select-dropdown-menu-container {
          overflow: visible !important;
        }
        /* Ensure the main container doesn't cause scroll */
        .ant-select-dropdown {
          transform: none !important;
          transition: none !important;
        }
        /* Prevent any unwanted scrollbars */
        .ant-select-dropdown .ant-select-dropdown-menu {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .ant-select-dropdown .ant-select-dropdown-menu::-webkit-scrollbar {
          display: none !important;
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
                        <Select 
                            placeholder="Select topic"
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            dropdownStyle={{ zIndex: 9999 }}
                            onDropdownVisibleChange={(open) => {
                                if (open) {
                                    document.body.style.overflow = 'hidden';
                                } else {
                                    document.body.style.overflow = '';
                                }
                            }}
                        >
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