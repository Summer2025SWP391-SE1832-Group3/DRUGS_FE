import axiosInstance from './axiosInstance';

export const ConsultantAPI = {
  getConsultants: async ({ page = 1, pageSize = 10 } = {}) => {
    const res = await axiosInstance.get(`/Consultant`, {
      params: { page, pageSize }
    });
    return res.data;
  },
  getCertificatesByConsultantId: async (id) => {
    const res = await axiosInstance.get(`/Consultant/${id}/certificates`);
    return res.data;
  },
  getConsultantById: async (id) => {
    const res = await axiosInstance.get(`/Consultant/${id}`);
    return res.data;
  },
  getAvailableSlotsByDate: async (id, date) => {
    const res = await axiosInstance.get(`/consultant/${id}/available-slots`, {
      params: { date }
    });
    return res.data;
  },
  bookConsultation: async ({ slotId, consultantId }) => {
    const res = await axiosInstance.post(`/Consultation/booking`, { slotId, consultantId });
    return res.data;
  },
  getConsultationRequests: async () => {
    const res = await axiosInstance.get(`/Consultation/my-requests`);
    return res.data;
  },
  getSessionByRequestId: async (requestId) => {
    const res = await axiosInstance.get(`/Consultation/session/by-request/${requestId}`);
    return res.data;
  },
  updateSession: async (sessionId, { startTime, sessionNotes, recommendations }) => {
    const res = await axiosInstance.put(`/Consultation/session/${sessionId}`, {
      startTime,
      sessionNotes,
      recommendations,
      googleMeetLink: 'string',
    });
    return res.data;
  },
  approveConsultationRequest: async (id) => {
    const res = await axiosInstance.put(`/consultation/${id}/confirm`);
    return res.data;
  },
  createSession: async (requestId, { startTime, sessionNotes, recommendations }) => {
    const res = await axiosInstance.post(`/Consultation/session`, {
      startTime,
      sessionNotes,
      recommendations,
      googleMeetLink: 'string',
    }, {
      params: { requestId }
    });
    return res.data;
  },
  rejectConsultationRequest: async (id) => {
    const res = await axiosInstance.put(`/consultation/${id}/reject`);
    return res.data;
  },
  getMyBookings: async () => {
    const res = await axiosInstance.get(`/Consultation/my-bookings`);
    return res.data;
  },
  completeSession: async (sessionId) => {
    const res = await axiosInstance.put(`/Consultation/session/${sessionId}/complete`);
    return res.data;
  },
  updateConsultantProfile: async (profile) => {
    const res = await axiosInstance.put(`/Consultant/profile`, profile);
    return res.data;
  },
  addWorkingHoursRange: async (data) => {
    const res = await axiosInstance.post(`/Consultant/workinghours/range`, data);
    return res.data;
  },
};
