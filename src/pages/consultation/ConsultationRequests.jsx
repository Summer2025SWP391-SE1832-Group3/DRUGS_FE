import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Tag, message, Modal, Descriptions } from 'antd';
import StatusTag from '../../components/ui/StatusTag';
import { ConsultantAPI } from '../../apis/consultant';
import { StarFilled, StarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const statusColor = {
  'Completed': 'blue',
  'Pending': 'orange',
  'Approved': 'green',
  'Rejected': 'red',
};

export default function ConsultationRequests() {
  const [requests, setRequests] = useState([]);
  const [sessionModal, setSessionModal] = useState({ visible: false, session: null });
  const [loadingSession, setLoadingSession] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({ visible: false, record: null });
  const [feedback, setFeedback] = useState({ rating: 0, comment: '' });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await ConsultantAPI.getMyBookings();
        setRequests(data);
      } catch {
        setRequests([]);
      }
    };
    fetchBookings();
  }, []);

  const handleView = async (record) => {
    if (record.status === 'Rejected') {
      message.error('This consultation request has been rejected.');
      return;
    }
    if (record.status === 'Pending') {
      message.error('This consultation request is still pending approval.');
      return;
    }
    setLoadingSession(true);
    try {
      const session = await ConsultantAPI.getSessionByRequestId(record.id);
      setSessionModal({ visible: true, session });
    } catch {
      message.error('Failed to fetch session');
    } finally {
      setLoadingSession(false);
    }
  };

  const handleCloseSessionModal = () => {
    setSessionModal({ visible: false, session: null });
  };

 
  const handleOpenFeedback = (record) => {
    setFeedbackModal({ visible: true, record });
    setFeedback({ rating: 0, comment: '' });
  };

  const handleCloseFeedback = () => {
    setFeedbackModal({ visible: false, record: null });
    setFeedback({ rating: 0, comment: '' });
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.rating) {
      message.warning('Please select a rating.');
      return;
    }
    setSubmittingFeedback(true);
    try {
      await ConsultantAPI.addConsultationFeedback(feedbackModal.record.id, feedback);
      message.success('Feedback submitted!');
      handleCloseFeedback();
    } catch {
      message.error('Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Consultant Name', dataIndex: 'consultantName', key: 'consultantName', width: 220 },
    {
      title: 'Schedule',
      key: 'schedule',
      render: (_, record) => {
        if (!record.startTime || !record.endTime) return '';
        // Chuyển đổi ISO string sang ngày/tháng/năm và giờ
        const start = new Date(record.startTime);
        const end = new Date(record.endTime);
        const pad = (n) => n.toString().padStart(2, '0');
        const dateStr = `${pad(start.getDate())}/${pad(start.getMonth() + 1)}/${start.getFullYear()}`;
        const startTimeStr = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
        const endTimeStr = `${pad(end.getHours())}:${pad(end.getMinutes())}`;
        return `${dateStr} ${startTimeStr} - ${endTimeStr}`;
      },
      width: 260,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => <StatusTag color={statusColor[status] || 'default'}>{status}</StatusTag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleView(record)} loading={loadingSession}>View</Button>
          {record.status === 'Completed' && (
            <Button type="primary" ghost onClick={() => handleOpenFeedback(record)}>
              Feedback
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
        My Consultation Bookings
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
        title="Session Details"
        width={600}
      >
        {sessionModal.session && (
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Notes and Link">
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
      </Modal>
      <Modal
        open={feedbackModal.visible}
        onCancel={handleCloseFeedback}
        title="Feedback"
        footer={null}
        width={400}
      >
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setFeedback((f) => ({ ...f, rating: star }))}
              style={{
                fontSize: 36,
                color: star <= feedback.rating ? '#faad14' : '#e4e4e4',
                cursor: 'pointer',
                transition: 'color 0.2s',
                marginRight: 4,
              }}
              data-testid={`star-${star}`}
            >
              {star <= feedback.rating ? <StarFilled /> : <StarOutlined />}
            </span>
          ))}
        </div>
        <textarea
          rows={4}
          placeholder="Leave your comment..."
          value={feedback.comment}
          onChange={e => setFeedback(f => ({ ...f, comment: e.target.value }))}
          style={{
            width: '100%',
            borderRadius: 8,
            border: '1px solid #d9d9d9',
            padding: 10,
            fontFamily: 'Inter, Roboto, Arial, sans-serif',
            marginBottom: 16,
            resize: 'none',
          }}
        />
        <Button
          type="primary"
          block
          loading={submittingFeedback}
          onClick={handleSubmitFeedback}
          style={{ borderRadius: 8, fontWeight: 600, fontSize: 16 }}
        >
          Submit Feedback
        </Button>
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
        .ant-modal-title {
          font-family: 'Inter', 'Roboto', Arial, sans-serif !important;
          font-weight: 700 !important;
          font-size: 22px !important;
        }
      `}</style>
    </div>
  );
}
