import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Tag, message, Modal, Descriptions } from 'antd';
import StatusTag from '../../components/ui/StatusTag';
import { ConsultantAPI } from '../../apis/consultant';

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

  const handleDelete = (record) => {
    message.info(`Delete booking #${record.id}`);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Consultant ID', dataIndex: 'consultantId', key: 'consultantId', width: 220 },
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
      render: (status) => <StatusTag color={statusColor[status] || 'default'}>{status}</StatusTag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleView(record)} loading={loadingSession}>View</Button>
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
            <Descriptions.Item label="Schedule">
              {sessionModal.session.startTime} - {sessionModal.session.endTime}
            </Descriptions.Item>
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
