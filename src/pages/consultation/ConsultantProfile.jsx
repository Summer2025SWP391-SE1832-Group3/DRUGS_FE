import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Rate, Avatar, Tag, Button, Modal, Calendar, List, message, Spin, Row, Col, Divider, Badge, DatePicker, TimePicker } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, SafetyCertificateOutlined, TeamOutlined, StarOutlined, CommentOutlined, ClockCircleOutlined, CheckCircleOutlined, EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import moment from 'moment';
import { ConsultantAPI } from '../../apis/consultant';

const { Title, Paragraph, Text } = Typography;

// Animation keyframes
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;
const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;
const StyledContainer = styled.div`
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
`;
const StyledCard = styled(Card)`
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  margin-bottom: 24px;
  border: none;
  animation: ${fadeInUp} 0.6s ease-out;
`;
const ProfileHeader = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px 20px 0 0;
  margin: -24px -24px 24px -24px;
`;
const StyledAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  border: 4px solid white;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  margin-bottom: 16px;
`;
const InfoSection = styled.div`
  padding: 20px 0;
  animation: ${slideIn} 0.8s ease-out;
`;
const StyledTag = styled(Tag)`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
`;
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400';
const ViewSlotsButton = styled(Button)`
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
  border: none;
  border-radius: 15px;
  height: 35px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(82, 196, 26, 0.4);
  }
`;
const SlotCard = styled(Card)`
  margin-bottom: 12px;
  border-radius: 12px;
  border: 2px solid ${props => props.selected ? '#667eea' : '#f0f0f0'};
  background: ${props => props.selected ? '#f0f4ff' : '#ffffff'};
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
`;

export default function ConsultantProfile() {
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [slotsModalVisible, setSlotsModalVisible] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [addWHModalVisible, setAddWHModalVisible] = useState(false);
  const [addWHForm, setAddWHForm] = useState({ fromDate: null, toDate: null, startTime: '', endTime: '' });
  const [addingWH, setAddingWH] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.userId) {
      message.error('No consultant user found');
      setLoading(false);
      return;
    }
    const fetchConsultant = async () => {
      setLoading(true);
      try {
        const data = await ConsultantAPI.getConsultantById(user.userId);
        setConsultant(data);
      } catch (error) {
        setConsultant(null);
        message.error('Error fetching consultant profile');
      } finally {
        setLoading(false);
      }
    };
    fetchConsultant();
  }, []);

  const openEditModal = () => {
    setEditForm({
      fullName: consultant.fullName || '',
      phoneNumber: consultant.phoneNumber || '',
      email: consultant.email || '',
      bio: consultant.bio || '',
      gender: consultant.gender || '',
      certifications: (consultant.certificates || []).map(cert => ({
        id: cert.id,
        name: cert.name,
        issuer: cert.issuingOrganization || cert.issuer || '',
        description: cert.description || '',
        dateIssued: cert.dateIssued ? moment(cert.dateIssued).format('YYYY-MM-DD') : '',
      })),
    });
    setEditModalVisible(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCertChange = (idx, field, value) => {
    setEditForm(prev => ({
      ...prev,
      certifications: prev.certifications.map((c, i) => i === idx ? { ...c, [field]: value } : c)
    }));
  };

  const handleAddCert = () => {
    setEditForm(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: 0, name: '', issuer: '', description: '', dateIssued: '' }
      ]
    }));
  };

  const handleRemoveCert = (idx) => {
    setEditForm(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== idx)
    }));
  };

  const handleEditSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        certifications: editForm.certifications.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          description: cert.description,
          dateIssued: cert.dateIssued ? new Date(cert.dateIssued).toISOString() : null,
        })),
      };
      await ConsultantAPI.updateConsultantProfile(payload);
      message.success('Profile updated successfully');
      setEditModalVisible(false);
      // Refresh profile
      const user = JSON.parse(localStorage.getItem('user'));
      const data = await ConsultantAPI.getConsultantById(user.userId);
      setConsultant(data);
    } catch (err) {
      message.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Lọc chỉ lấy mỗi ngày một lần (theo ngày, giữ khung giờ đầu tiên)
  const uniqueWorkingDays = [];
  const seenDays = new Set();
  if (consultant && consultant.workingHours) {
    consultant.workingHours
      .filter(wh => moment(wh.date).isSameOrAfter(moment(), 'day'))
      .forEach(wh => {
        const dayStr = moment(wh.date).format('YYYY-MM-DD');
        if (!seenDays.has(dayStr)) {
          uniqueWorkingDays.push(wh);
          seenDays.add(dayStr);
        }
      });
  }

  const handleViewSlots = async (schedule) => {
    setCurrentSchedule(schedule);
    setSelectedSlot(null);
    if (!consultant) return;
    try {
      const dateStr = moment(schedule.date).format('YYYY-MM-DDT00:00:00');
      const slots = await ConsultantAPI.getAvailableSlotsByDate(consultant.id, dateStr);
      setAvailableSlots(slots);
    } catch {
      setAvailableSlots([]);
    }
    setSlotsModalVisible(true);
  };

  const openAddWHModal = () => {
    setAddWHForm({ fromDate: null, toDate: null, startTime: '', endTime: '' });
    setAddWHModalVisible(true);
  };

  const handleAddWHFormChange = (field, value) => {
    setAddWHForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddWHSubmit = async () => {
    // Validate
    if (!addWHForm.fromDate || !addWHForm.toDate || !addWHForm.startTime || !addWHForm.endTime) {
      message.error('Please fill in all fields');
      return;
    }
    if (addWHForm.fromDate > addWHForm.toDate) {
      message.error('From Date must be before or equal to To Date');
      return;
    }
    setAddingWH(true);
    try {
      // Ensure startTime/endTime are in HH:mm:ss
      const formatTime = t => t.length === 5 ? t + ':00' : t;
      const payload = {
        fromDate: addWHForm.fromDate ? addWHForm.fromDate.toISOString() : null,
        toDate: addWHForm.toDate ? addWHForm.toDate.toISOString() : null,
        startTime: formatTime(addWHForm.startTime),
        endTime: formatTime(addWHForm.endTime),
      };
      await ConsultantAPI.addWorkingHoursRange(payload);
      message.success('Added working hours successfully');
      setAddWHModalVisible(false);
      // Refresh profile
      const user = JSON.parse(localStorage.getItem('user'));
      const data = await ConsultantAPI.getConsultantById(user.userId);
      setConsultant(data);
    } catch (err) {
      message.error('Failed to add working hours');
    } finally {
      setAddingWH(false);
    }
  };

  if (loading) {
    return (
      <StyledContainer>
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <Spin size="large" />
        </div>
      </StyledContainer>
    );
  }

  if (!consultant) {
    return (
      <StyledContainer>
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <Text>Consultant profile not found</Text>
        </div>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <StyledCard>
            <ProfileHeader>
              <StyledAvatar
                size={120}
                src={consultant.avatarUrl || DEFAULT_AVATAR}
                icon={<UserOutlined />}
              />
              <Title level={2} style={{ color: 'white', margin: '16px 0 8px 0' }}>
                {consultant.fullName}
              </Title>
              <Rate disabled defaultValue={consultant.averageRating} style={{ color: '#ffd700' }} />
              <div style={{ marginTop: '8px' }}>
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                  {consultant.averageRating}/5 ({consultant.feedbackCount} reviews)
                </Text>
              </div>
            </ProfileHeader>
            <InfoSection>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <MailOutlined style={{ color: '#667eea', marginRight: '8px' }} />
                  <Text>{consultant.email}</Text>
                </div>
                <div>
                  <PhoneOutlined style={{ color: '#667eea', marginRight: '8px' }} />
                  <Text>{consultant.phoneNumber}</Text>
                </div>
                <div>
                  <UserOutlined style={{ color: '#667eea', marginRight: '8px' }} />
                  <Text>{consultant.gender}</Text>
                </div>
                <div>
                  <StyledTag color={consultant.status === 'Active' ? 'green' : 'red'}>
                    {consultant.status}
                  </StyledTag>
                </div>
              </Space>
            </InfoSection>
            <Divider />
            <Button
              type="primary"
              icon={<EditOutlined />}
              block
              onClick={openEditModal}
            >
              Edit Profile
            </Button>
          </StyledCard>
        </Col>
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={8}>
              <Card style={{ textAlign: 'center', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', height: '100%' }}>
                <StarOutlined style={{ fontSize: '24px', color: '#ffd700', marginBottom: '8px' }} />
                <Title level={3} style={{ margin: '8px 0 4px 0', color: '#1a1a1a' }}>
                  {consultant.averageRating}
                </Title>
                <Text type="secondary">Average Rating</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card style={{ textAlign: 'center', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', height: '100%' }}>
                <CommentOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                <Title level={3} style={{ margin: '8px 0 4px 0', color: '#1a1a1a' }}>
                  {consultant.feedbackCount}
                </Title>
                <Text type="secondary">Reviews</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card style={{ textAlign: 'center', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', height: '100%' }}>
                <TeamOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                <Title level={3} style={{ margin: '8px 0 4px 0', color: '#1a1a1a' }}>
                  {consultant.totalConsultations}
                </Title>
                <Text type="secondary">Total Consultations</Text>
              </Card>
            </Col>
          </Row>
          <StyledCard title="Personal Information" style={{ marginBottom: '24px' }}>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
              {consultant.bio}
            </Paragraph>
          </StyledCard>
          <StyledCard title="Certificates" style={{ marginBottom: '24px' }}>
            <List
              itemLayout="horizontal"
              dataSource={consultant.certificates}
              renderItem={cert => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<SafetyCertificateOutlined style={{ fontSize: '24px', color: '#667eea' }} />}
                    title={cert.name}
                    description={
                      <div>
                        <Text type="secondary">{cert.issuingOrganization}</Text>
                        <br />
                        <Text type="secondary">
                          <CalendarOutlined style={{ marginRight: '4px' }} />
                          Issued: {moment(cert.dateIssued).format('DD/MM/YYYY')}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </StyledCard>
          <StyledCard title="Working Schedule">
            <Button
              type="primary"
              style={{ marginBottom: 16 }}
              onClick={openAddWHModal}
            >
              Add workinghours
            </Button>
            <List
              itemLayout="horizontal"
              dataSource={uniqueWorkingDays}
              renderItem={schedule => (
                <List.Item
                  actions={[
                    <ViewSlotsButton
                      key="view-slots"
                      type="primary"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewSlots(schedule)}
                    >
                      View Available Slots
                    </ViewSlotsButton>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<ClockCircleOutlined style={{ fontSize: '20px', color: '#52c41a' }} />}
                    title={moment(schedule.date).format('dddd, DD/MM/YYYY')}
                  />
                </List.Item>
              )}
            />
          </StyledCard>
        </Col>
      </Row>
      <Modal
        title="Edit Consultant Profile"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleEditSubmit}
        confirmLoading={saving}
        width={700}
        okText="Save"
      >
        {editForm && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <label>Full Name</label>
                <input
                  className="ant-input"
                  value={editForm.fullName}
                  onChange={e => handleEditFormChange('fullName', e.target.value)}
                  style={{ marginBottom: 12 }}
                />
              </Col>
              <Col span={12}>
                <label>Phone Number</label>
                <input
                  className="ant-input"
                  value={editForm.phoneNumber}
                  onChange={e => handleEditFormChange('phoneNumber', e.target.value)}
                  style={{ marginBottom: 12 }}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <label>Email</label>
                <input
                  className="ant-input"
                  value={editForm.email}
                  onChange={e => handleEditFormChange('email', e.target.value)}
                  style={{ marginBottom: 12 }}
                />
              </Col>
              <Col span={12}>
                <label>Gender</label>
                <input
                  className="ant-input"
                  value={editForm.gender}
                  onChange={e => handleEditFormChange('gender', e.target.value)}
                  style={{ marginBottom: 12 }}
                />
              </Col>
            </Row>
            <label>Bio</label>
            <textarea
              className="ant-input"
              value={editForm.bio}
              onChange={e => handleEditFormChange('bio', e.target.value)}
              rows={3}
              style={{ marginBottom: 16, width: '100%' }}
            />
            <Divider>Certifications</Divider>
            <List
              dataSource={editForm.certifications}
              renderItem={(cert, idx) => (
                <List.Item
                  actions={[
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      size="small"
                      onClick={() => handleRemoveCert(idx)}
                      key="delete"
                    />
                  ]}
                >
                  <Row gutter={8} style={{ width: '100%' }}>
                    <Col span={6}>
                      <input
                        className="ant-input"
                        placeholder="Name"
                        value={cert.name}
                        onChange={e => handleCertChange(idx, 'name', e.target.value)}
                        style={{ marginBottom: 4 }}
                      />
                    </Col>
                    <Col span={6}>
                      <input
                        className="ant-input"
                        placeholder="Issuer"
                        value={cert.issuer}
                        onChange={e => handleCertChange(idx, 'issuer', e.target.value)}
                        style={{ marginBottom: 4 }}
                      />
                    </Col>
                    <Col span={6}>
                      <input
                        className="ant-input"
                        placeholder="Description"
                        value={cert.description}
                        onChange={e => handleCertChange(idx, 'description', e.target.value)}
                        style={{ marginBottom: 4 }}
                      />
                    </Col>
                    <Col span={6}>
                      <input
                        className="ant-input"
                        type="date"
                        placeholder="Date Issued"
                        value={cert.dateIssued}
                        onChange={e => handleCertChange(idx, 'dateIssued', e.target.value)}
                        style={{ marginBottom: 4 }}
                      />
                    </Col>
                  </Row>
                </List.Item>
              )}
              footer={
                <Button
                  icon={<PlusOutlined />}
                  onClick={handleAddCert}
                  type="dashed"
                  block
                >
                  Add Certification
                </Button>
              }
            />
          </div>
        )}
      </Modal>
      <Modal
        title={`Available Slots - ${currentSchedule ? moment(currentSchedule.date).format('dddd, DD/MM/YYYY') : ''}`}
        open={slotsModalVisible}
        onCancel={() => setSlotsModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: '20px' }}>
          <Title level={4}>Available time slots:</Title>
          {availableSlots.length > 0 ? (
            <List
              grid={{ gutter: 8, column: 2 }}
              dataSource={availableSlots}
              renderItem={slot => (
                <List.Item>
                  <SlotCard size="small">
                    <div style={{ textAlign: 'center' }}>
                      <ClockCircleOutlined style={{ marginRight: '8px', color: '#667eea' }} />
                      <Text strong>
                        {moment(slot.startTime).format('HH:mm')} - {moment(slot.endTime).format('HH:mm')}
                      </Text>
                      <br />
                      <Badge status={slot.status === 'Booked' ? 'error' : 'success'} text={slot.status} />
                    </div>
                  </SlotCard>
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No available slots for this date</Text>
          )}
        </div>
      </Modal>
      <Modal
        title="Add Working Hours"
        open={addWHModalVisible}
        onCancel={() => setAddWHModalVisible(false)}
        onOk={handleAddWHSubmit}
        confirmLoading={addingWH}
        okText="Add"
      >
        <div style={{ marginBottom: 16 }}>
          <label>From Date</label>
          <DatePicker
            showTime
            style={{ width: '100%', marginBottom: 8 }}
            value={addWHForm.fromDate}
            onChange={val => handleAddWHFormChange('fromDate', val)}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>To Date</label>
          <DatePicker
            showTime
            style={{ width: '100%', marginBottom: 8 }}
            value={addWHForm.toDate}
            onChange={val => handleAddWHFormChange('toDate', val)}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Start Time</label>
          <TimePicker
            style={{ width: '100%', marginBottom: 8 }}
            value={addWHForm.startTime ? moment(addWHForm.startTime, 'HH:mm') : null}
            onChange={val => handleAddWHFormChange('startTime', val ? val.format('HH:mm') : '')}
            format="HH:mm"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>End Time</label>
          <TimePicker
            style={{ width: '100%' }}
            value={addWHForm.endTime ? moment(addWHForm.endTime, 'HH:mm') : null}
            onChange={val => handleAddWHFormChange('endTime', val ? val.format('HH:mm') : '')}
            format="HH:mm"
          />
        </div>
      </Modal>
    </StyledContainer>
  );
}
