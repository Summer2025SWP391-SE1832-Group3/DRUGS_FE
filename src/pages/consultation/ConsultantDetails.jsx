import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Rate, 
  Avatar, 
  Tag, 
  Button, 
  Modal, 
  Calendar, 
  List, 
  message, 
  Spin,
  Row,
  Col,
  Divider,
  Badge
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  CalendarOutlined, 
  SafetyCertificateOutlined,
  TeamOutlined,
  StarOutlined,
  CommentOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { ConsultantAPI } from '../../apis/consultant';

const { Title, Paragraph, Text } = Typography;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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

const BookingButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 25px;
  height: 50px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
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

const StatCard = styled(Card)`
  text-align: center;
  border-radius: 16px;
  border: none;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  height: 100%;
`;

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


const MALE_AVATARS = [
  'https://images.unsplash.com/photo-1557862921-37829c790f19?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
];

const FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
];

const getAvatarForConsultant = (consultantName) => {
  if (!consultantName) return MALE_AVATARS[0];
  
  
  if (consultantName.toLowerCase().includes('pham thi hoa')) {
    return FEMALE_AVATARS[0];
  }
  
  const nameMapping = {
    'đặng lâm anh tuấn': 0, 
    'đặng võ minh trung': 1, 
    'nguyễnn văn an': 2, 
    'nguyễn văn a': 3, 
    'nguyễn văn minh': 4, 
  };
  
  const lowerName = consultantName.toLowerCase();
  const mappedIndex = nameMapping[lowerName];
  
  if (mappedIndex !== undefined) {
    return MALE_AVATARS[mappedIndex];
  }
  
  
  const nameHash = consultantName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const maleIndex = nameHash % MALE_AVATARS.length;
  return MALE_AVATARS[maleIndex];
};



export default function ConsultantDetail() {
  const { id } = useParams();
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [slotsModalVisible, setSlotsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);

  useEffect(() => {
    const fetchConsultant = async () => {
      setLoading(true);
      try {
        const data = await ConsultantAPI.getConsultantById(id);
        setConsultant(data);
      } catch (error) {
        setConsultant(null);
        message.error('Error fetching consultant details');
      } finally {
        setLoading(false);
      }
    };
    fetchConsultant();
  }, [id]);

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (!consultant) return;
    
    try {
      const dateStr = date.format('YYYY-MM-DDT00:00:00');
      const slots = await ConsultantAPI.getAvailableSlotsByDate(consultant.id, dateStr);
      setAvailableSlots(slots);
    } catch {
      setAvailableSlots([]);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      message.warning('Please select a time slot');
      return;
    }

    setBookingLoading(true);
    try {
      await ConsultantAPI.bookConsultation({ slotId: selectedSlot.slotId, consultantId: consultant.id });
      message.success('Consultation appointment booked successfully!');
      setBookingModalVisible(false);
      setSlotsModalVisible(false);
      setSelectedDate(null);
      setSelectedSlot(null);
      setAvailableSlots([]);
      setCurrentSchedule(null);
    } catch (error) {
      message.error('Booking failed. Please try again!');
    } finally {
      setBookingLoading(false);
    }
  };

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

  const disabledDate = (current) => {
    const today = moment().startOf('day');
    return !current || current.isBefore(today, 'day') || current.isSame(today, 'day');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'green';
      case 'Inactive': return 'red';
      case 'Busy': return 'orange';
      default: return 'default';
    }
  };

  
  const uniqueWorkingDays = [];
  const seenDays = new Set();
  if (consultant && consultant.workingHours) {
    consultant.workingHours
      .filter(wh => moment(wh.date).isAfter(moment(), 'day')) 
      .forEach(wh => {
        const dayStr = moment(wh.date).format('YYYY-MM-DD');
        if (!seenDays.has(dayStr)) {
          uniqueWorkingDays.push(wh);
          seenDays.add(dayStr);
        }
      });
  }

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
          <Text>Consultant information not found</Text>
        </div>
      </StyledContainer>
    );
  }

 
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const hideBooking = ['Consultant', 'Staff', 'Manager'].includes(user.role);

  return (
    <StyledContainer>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <StyledCard>
            <ProfileHeader>
              <StyledAvatar
                size={120}
                src={consultant.avatarUrl || getAvatarForConsultant(consultant.fullName)}
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
                  <StyledTag color={getStatusColor(consultant.status)}>
                    {consultant.status}
                  </StyledTag>
                </div>
              </Space>
            </InfoSection>

            <Divider />

            {/* Ẩn nút Book Consultation nếu là consultant, staff, manager */}
            {!hideBooking && (
              <BookingButton 
                type="primary" 
                size="large" 
                block
                onClick={() => setBookingModalVisible(true)}
                icon={<CalendarOutlined />}
              >
                Book Consultation
              </BookingButton>
            )}
          </StyledCard>
        </Col>

        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={8}>
              <StatCard>
                <StarOutlined style={{ fontSize: '24px', color: '#ffd700', marginBottom: '8px' }} />
                <Title level={3} style={{ margin: '8px 0 4px 0', color: '#1a1a1a' }}>
                  {consultant.averageRating}
                </Title>
                <Text type="secondary">Average Rating</Text>
              </StatCard>
            </Col>
            <Col xs={24} sm={8}>
              <StatCard>
                <CommentOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                <Title level={3} style={{ margin: '8px 0 4px 0', color: '#1a1a1a' }}>
                  {consultant.feedbackCount}
                </Title>
                <Text type="secondary">Reviews</Text>
              </StatCard>
            </Col>
            <Col xs={24} sm={8}>
              <StatCard>
                <TeamOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                <Title level={3} style={{ margin: '8px 0 4px 0', color: '#1a1a1a' }}>
                  {consultant.totalConsultations}
                </Title>
                <Text type="secondary">Total Consultations</Text>
              </StatCard>
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

      {/* Main Booking Modal */}
      <Modal
        title="Book Consultation"
        visible={bookingModalVisible}
        onCancel={() => setBookingModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: '20px' }}>
          <Title level={4}>Select consultation date:</Title>
          <Calendar
            fullscreen={false}
            onSelect={handleDateSelect}
            disabledDate={disabledDate}
            value={selectedDate}
          />
        </div>

        {selectedDate && (
          <div style={{ marginBottom: '20px' }}>
            <Title level={4}>Select time slot:</Title>
            {availableSlots.length > 0 ? (
              <List
                grid={{ gutter: 8, column: 2 }}
                dataSource={availableSlots.filter(slot => slot.status !== 'Pending' && slot.status !== 'Rejected')}
                renderItem={slot => (
                  <List.Item>
                    <SlotCard
                      size="small"
                      selected={selectedSlot?.slotId === slot.slotId}
                      onClick={() =>
                        slot.status !== 'Booked' && handleSlotSelect(slot)
                      }
                      style={
                        slot.status === 'Booked'
                          ? { opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' }
                          : {}
                      }
                    >
                      <div style={{ textAlign: 'center' }}>
                        <ClockCircleOutlined style={{ marginRight: '8px', color: '#667eea' }} />
                        <Text strong>
                          {moment(slot.startTime).format('HH:mm')} - {moment(slot.endTime).format('HH:mm')}
                        </Text>
                        <br />
                        <Badge
                          status={
                            slot.status === 'Booked'
                              ? 'error'
                              : 'success'
                          }
                          text={slot.status}
                        />
                      </div>
                    </SlotCard>
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">No available slots for this date</Text>
            )}
          </div>
        )}

        {/* Ẩn nút Confirm Booking nếu là consultant, staff, manager */}
        {selectedSlot && !hideBooking && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              type="primary"
              size="large"
              loading={bookingLoading}
              onClick={handleBooking}
              icon={<CheckCircleOutlined />}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '25px',
                height: '45px',
                minWidth: '200px'
              }}
            >
              Confirm Booking
            </Button>
          </div>
        )}
      </Modal>

      {/* Available Slots Modal */}
      <Modal
        title={`Available Slots - ${currentSchedule ? moment(currentSchedule.date).format('dddd, DD/MM/YYYY') : ''}`}
        visible={slotsModalVisible}
        onCancel={() => setSlotsModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: '20px' }}>
          <Title level={4}>Select time slot:</Title>
          {availableSlots.length > 0 ? (
            <List
              grid={{ gutter: 8, column: 2 }}
              dataSource={availableSlots.filter(slot => slot.status !== 'Pending' && slot.status !== 'Rejected')}
              renderItem={slot => (
                <List.Item>
                  <SlotCard
                    size="small"
                    selected={selectedSlot?.slotId === slot.slotId}
                    onClick={() => slot.status !== 'Booked' && handleSlotSelect(slot)}
                    style={
                      slot.status === 'Booked'
                        ? { opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' }
                        : {}
                    }
                  >
                    <div style={{ textAlign: 'center' }}>
                      <ClockCircleOutlined style={{ marginRight: '8px', color: '#667eea' }} />
                      <Text strong>
                        {moment(slot.startTime).format('HH:mm')} - {moment(slot.endTime).format('HH:mm')}
                      </Text>
                      <br />
                      <Badge
                        status={slot.status === 'Booked' ? 'error' : 'success'}
                        text={slot.status}
                      />
                    </div>
                  </SlotCard>
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">No available slots for this date</Text>
          )}
        </div>

        {/* Ẩn nút Confirm Booking nếu là consultant, staff, manager */}
        {selectedSlot && !hideBooking && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
              type="primary"
              size="large"
              loading={bookingLoading}
              onClick={handleBooking}
              icon={<CheckCircleOutlined />}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '25px',
                height: '45px',
                minWidth: '200px'
              }}
            >
              Confirm Booking
            </Button>
          </div>
        )}
      </Modal>
    </StyledContainer>
  );
}