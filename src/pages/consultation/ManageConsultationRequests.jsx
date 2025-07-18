import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Tag, message, Modal, Descriptions, Form, Input, DatePicker } from 'antd';
import StatusTag from '../../components/ui/StatusTag';
import { ConsultantAPI } from '../../apis/consultant';
import moment from 'moment';

const { Title } = Typography;

const statusColor = {
  'Completed': 'blue',
  'Pending': 'orange',
  'Approved': 'green',
  'Rejected': 'red',
};

export default function ManageConsultationRequests() {
  const [requests, setRequests] = useState([]);
  const [sessionModal, setSessionModal] = useState({ visible: false, session: null, isCompleted: false });
  const [loadingSession, setLoadingSession] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm] = Form.useForm();
  const [createSessionModal, setCreateSessionModal] = useState({ visible: false, requestId: null });
  const [createSessionForm] = Form.useForm();
  const [sessionMap, setSessionMap] = useState({});

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await ConsultantAPI.getConsultationRequests();
        setRequests(data);
        // Lấy session cho từng request (nếu cần)
        const sessionPromises = data.map(async (r) => {
          try {
            const session = await ConsultantAPI.getSessionByRequestId(r.id);
            return [r.id, session];
          } catch {
            return [r.id, null];
          }
        });
        const sessionResults = await Promise.all(sessionPromises);
        const map = {};
        sessionResults.forEach(([id, session]) => {
          map[id] = session;
        });
        setSessionMap(map);
      } catch {
        setRequests([]);
        setSessionMap({});
      }
    };
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await ConsultantAPI.approveConsultationRequest(id);
      message.success('Request approved! Now create a session.');
      // Reload requests to update status
      const data = await ConsultantAPI.getConsultationRequests();
      setRequests(data);
      setCreateSessionModal({ visible: true, requestId: id });
    } catch {
      message.error('Failed to approve request');
    }
  };

  const handleReject = (id) => {
    Modal.confirm({
      title: 'Reject Consultation Request',
      content: 'Are you sure you want to reject this request?',
      okText: 'Reject',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await ConsultantAPI.rejectConsultationRequest(id);
          message.success('Request rejected!');
          await fetchRequests();
        } catch {
          message.error('Failed to reject request');
        }
      },
    });
  };

  const handleViewSession = async (request) => {
    setLoadingSession(true);
    try {
      const session = await ConsultantAPI.getSessionByRequestId(request.id);
      setSessionModal({ visible: true, session, isCompleted: !!session.isCompleted });
      setEditMode(false);
    } catch {
      message.error('Failed to fetch session');
    } finally {
      setLoadingSession(false);
    }
  };

  const handleEditSession = () => {
    setEditMode(true);
    // Set initial values for form
    editForm.setFieldsValue({
      startTime: sessionModal.session ? moment(sessionModal.session.startTime).local() : null,
      sessionNotes: sessionModal.session?.sessionNotes,
      recommendations: sessionModal.session?.recommendations,
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleSubmitEdit = async () => {
    try {
      const values = await editForm.validateFields();
      await ConsultantAPI.updateSession(sessionModal.session.id, {
        startTime: values.startTime.toISOString(),
        sessionNotes: values.sessionNotes,
        recommendations: values.recommendations,
      });
      message.success('Session updated successfully!');
      // Reload session
      const updatedSession = await ConsultantAPI.getSessionByRequestId(sessionModal.session.id);
      setSessionModal({ ...sessionModal, session: updatedSession, isCompleted: !!updatedSession.isCompleted });
      setEditMode(false);
      await fetchRequests();
    } catch (error) {
      message.error('Failed to update session');
    }
  };

  const handleCloseSessionModal = () => {
    setSessionModal({ visible: false, session: null, isCompleted: false });
  };

  const handleCreateSession = async () => {
    try {
      const values = await createSessionForm.validateFields();
      await ConsultantAPI.createSession(createSessionModal.requestId, {
        startTime: values.startTime.toISOString(),
        sessionNotes: values.sessionNotes,
        recommendations: values.recommendations,
      });
      await ConsultantAPI.approveConsultationRequest(createSessionModal.requestId);
      message.success('Session created and request approved!');
      setCreateSessionModal({ visible: false, requestId: null });
      createSessionForm.resetFields();
      await fetchRequests();
    } catch {
      message.error('Failed to create session or approve request');
    }
  };

  const handleCancelCreateSession = () => {
    setCreateSessionModal({ visible: false, requestId: null });
    createSessionForm.resetFields();
  };

  const handleCompleteSession = async (requestId) => {
    const session = sessionMap[requestId];
    if (!session) {
      message.error('No session found for this request');
      return;
    }
    try {
      await ConsultantAPI.completeSession(session.id);
      message.success('Session marked as completed!');
      // Reload requests and session map
      const data = await ConsultantAPI.getConsultationRequests();
      setRequests(data);
      const sessionPromises = data.map(async (r) => {
        try {
          const session = await ConsultantAPI.getSessionByRequestId(r.id);
          return [r.id, session];
        } catch {
          return [r.id, null];
        }
      });
      const sessionResults = await Promise.all(sessionPromises);
      const map = {};
      sessionResults.forEach(([id, session]) => {
        map[id] = session;
      });
      setSessionMap(map);
      await fetchRequests();
    } catch {
      message.error('Failed to complete session');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Member ID',
      dataIndex: 'memberId',
      key: 'memberId',
      width: 140,
    },
    {
      title: 'Schedule',
      key: 'schedule',
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
      width: 260,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        return <StatusTag color={statusColor[status] || 'default'}>{status}</StatusTag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 260,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleApprove(record.id)}
            disabled={record.status !== 'Pending'}
          >
            Approve
          </Button>
          <Button
            danger
            onClick={() => handleReject(record.id)}
            disabled={record.status !== 'Pending'}
          >
            Reject
          </Button>
          {(record.status === 'Completed' || record.status === 'Approved') && (
            <Button
              onClick={() => handleViewSession(record)}
              loading={loadingSession}
            >
              View Session
            </Button>
          )}
          {record.status === 'Approved' && !sessionMap[record.id]?.isCompleted && (
            <Button
              type="dashed"
              onClick={() => setCreateSessionModal({ visible: true, requestId: record.id })}
            >
              Create Session
            </Button>
          )}
          {sessionMap[record.id] && !sessionMap[record.id]?.isCompleted && (
            <Button
              type="dashed"
              onClick={() => handleCompleteSession(record.id)}
            >
              Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', margin: '0 auto', padding: 20, fontFamily: 'Inter, Roboto, Arial, sans-serif', background: '#f8f9fb', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      <Title level={2} style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', fontWeight: 700, color: '#2c3e50', letterSpacing: '-1px' }}>
        Manage Consultation Requests
      </Title>
      <Table
        columns={columns}
        dataSource={requests}
        rowKey="id"
        pagination={{ pageSize: 6 }}
        style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif', background: 'white', borderRadius: 12, boxShadow: '0 4px 24px rgba(34,76,139,0.08)' }}
        size="middle"
        bordered
      />
      <Modal
        open={sessionModal.visible}
        onCancel={handleCloseSessionModal}
        footer={null}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Session Details</span>
            {!sessionModal.isCompleted && !editMode && (
              <Button type="primary" onClick={handleEditSession}>Edit Session</Button>
            )}
          </div>
        }
        width={600}
      >
        {sessionModal.session && !editMode && (
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Schedule">
              {sessionModal.session.startTime} - {sessionModal.session.endTime}
            </Descriptions.Item>
            <Descriptions.Item label="Link and Notes">
              {sessionModal.session.sessionNotes}
            </Descriptions.Item>
            <Descriptions.Item label="Recommendations">
              {sessionModal.session.recommendations}
            </Descriptions.Item>
            {sessionModal.session.isCompleted && (
              <Descriptions.Item label="Status">
                <Tag color="blue">Completed</Tag>
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
        {sessionModal.session && editMode && (
          <Form form={editForm} layout="vertical" onFinish={handleSubmitEdit} initialValues={{
            startTime: sessionModal.session.startTime ? moment(sessionModal.session.startTime).local() : null,
            sessionNotes: sessionModal.session.sessionNotes,
            recommendations: sessionModal.session.recommendations,
          }}>
            <Form.Item label="Start Time" name="startTime" rules={[{ required: true, message: 'Please select start time' }]}> 
              <DatePicker showTime format="YYYY-MM-DDTHH:mm:ss" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Link and Notes" name="sessionNotes" rules={[{ required: true, message: 'Please enter notes' }]}> 
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Recommendations" name="recommendations" rules={[{ required: true, message: 'Please enter recommendations' }]}> 
              <Input.TextArea rows={2} />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={handleCancelEdit}>Cancel</Button>
              <Button type="primary" htmlType="submit">Save</Button>
            </div>
          </Form>
        )}
      </Modal>
      <Modal
        open={createSessionModal.visible}
        onCancel={handleCancelCreateSession}
        footer={null}
        title="Create Session"
        width={600}
      >
        <Form form={createSessionForm} layout="vertical" onFinish={handleCreateSession}>
          <Form.Item label="Start Time" name="startTime" rules={[{ required: true, message: 'Please select start time' }]}> 
            <DatePicker showTime format="YYYY-MM-DDTHH:mm:ss" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Link and Notes" name="sessionNotes" rules={[{ required: true, message: 'Please enter notes' }]}> 
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="Recommendations" name="recommendations" rules={[{ required: true, message: 'Please enter recommendations' }]}> 
            <Input.TextArea rows={2} />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={handleCancelCreateSession}>Cancel</Button>
            <Button type="primary" htmlType="submit">Create</Button>
          </div>
        </Form>
      </Modal>
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
    </div>
  );
}
