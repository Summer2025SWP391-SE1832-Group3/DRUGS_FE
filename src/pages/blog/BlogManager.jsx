import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Space, ConfigProvider, Flex, Tag, Modal, Select } from "antd";
import { BlogManagerAPI } from "../../apis/blogManager";
import StatusTag from "../../components/ui/StatusTag";

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchBlogs = async (status = 'All') => {
    setLoading(true);
    try {
      let res;
      if (status === 'All') {
        res = await BlogManagerAPI.getAll();
        setBlogs(res.data || []);
      } else {
        res = await BlogManagerAPI.getByStatus(status);
        setBlogs(res.data || []);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        message.info(`No blogs found for status: "${status}"`);
        setBlogs([]);
      } else {
        message.error("Failed to fetch blog list!");
        setBlogs([]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs(statusFilter);
  }, [statusFilter]);

  const handleDelete = async (id) => {
    try {
      await BlogManagerAPI.delete(id);
      message.success("Deleted successfully!");
      fetchBlogs(statusFilter);
    } catch {
      message.error("Delete failed!");
    }
  };

  const handleApprove = async (id) => {
    try {
      await BlogManagerAPI.approve(id);
      message.success("Approved successfully!");
      fetchBlogs(statusFilter);
    } catch {
      message.error("Approve failed!");
    }
  };

  const handleReject = async (id) => {
    try {
      await BlogManagerAPI.reject(id);
      message.success("Rejected successfully!");
      fetchBlogs(statusFilter);
    } catch {
      message.error("Reject failed!");
    }
  };

  const getStatusText = (status) => {
    if (typeof status === 'string') {
      // Normalize string status
      const s = status.toLowerCase();
      if (s === 'pending' || s === 'processing') return 'Pending';
      if (s === 'approved') return 'Approved';
      if (s === 'rejected') return 'Rejected';
      return status;
    }
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return status;
    }
  };

  const handleShowDetails = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  const columns = [
    { title: "ID", dataIndex: "blogId", key: "blogId" },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (content, record) => {
        if (!content) return "";
        const short = content.length > 20 ? content.slice(0, 20) + "... " : content;
        return (
          <span>
            {short}
            {content.length > 20 && (
              <Button type="link" size="small" onClick={e => { e.stopPropagation(); handleShowDetails(record); }}>more</Button>
            )}
          </span>
        );
      }
    },
    { title: "Posted At", dataIndex: "postedAt", key: "postedAt" },
    { title: "Posted By", dataIndex: "postedBy", key: "postedBy" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let display = status;
        let color = "default";
        if (status === "Processing" || status === 0) {
          display = "Pending";
          color = "orange";
        } else if (status === "Approved" || status === 1) {
          display = "Approved";
          color = "green";
        } else if (status === "Rejected" || status === 2) {
          display = "Rejected";
          color = "orange";
        }
        return <StatusTag color={color}>{display}</StatusTag>;
      }
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const isFinal = record.status === "Approved" || record.status === 1 || record.status === "Rejected" || record.status === 2;
        return (
          <Flex gap="small" wrap>
            <Button
              color="cyan"
              variant="solid"
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(record.blogId);
              }}
              disabled={isFinal || record.status === "Approved" || record.status === 1}
            >
              Approve
            </Button>
            <Button
              color="warning"
              variant="solid"
              onClick={(e) => {
                e.stopPropagation();
                handleReject(record.blogId);
              }}
              disabled={isFinal || record.status === "Rejected" || record.status === 2}
            >
              Reject
            </Button>
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDelete(record.blogId);
              }}
              onCancel={(e) => {
                e?.stopPropagation();
              }}
            >
              <Button color="danger" variant="solid" onClick={(e) => e.stopPropagation()}>
                Delete
              </Button>
            </Popconfirm>
          </Flex>
        );
      },
    },
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Blog List</h2>
          <Select
            value={statusFilter}
            onChange={value => setStatusFilter(value)}
            style={{ width: 160 }}
            options={[
              { label: 'All', value: 'All' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Approved', value: 'Approved' },
              { label: 'Rejected', value: 'Rejected' },
            ]}
          />
        </div>
        <Table
          columns={columns}
          dataSource={blogs}
          rowKey="blogId"
          loading={loading}
          pagination={{ pageSize: 6 }}
          bordered
          onRow={record => ({
            onClick: () => handleShowDetails(record)
          })}
        />
        <Modal
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          title={selectedBlog ? selectedBlog.title : "Blog Details"}
          width={700}
        >
          {selectedBlog && (
            <div style={{ padding: 8 }}>
              <div style={{ marginBottom: 16 }}>
                <b>Title:</b> {selectedBlog.title}
              </div>
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                <span><b>Posted By:</b> {selectedBlog.postedBy}</span>
                <span><b>Posted At:</b> {selectedBlog.postedAt}</span>
                <StatusTag color={
                  getStatusText(selectedBlog.status) === 'Pending' ? 'orange' :
                  getStatusText(selectedBlog.status) === 'Approved' ? 'green' :
                  getStatusText(selectedBlog.status) === 'Rejected' ? 'red' : 'default'
                }>
                  {getStatusText(selectedBlog.status)}
                </StatusTag>
              </div>
              {selectedBlog.blogImages && selectedBlog.blogImages.length > 0 ? (
                <img
                  src={`https://api-drug-be.purintech.id.vn${selectedBlog.blogImages[0]}`}
                  alt={selectedBlog.title}
                  style={{ width: '100%', maxHeight: 350, objectFit: 'contain', borderRadius: 8, marginBottom: 16 }}
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000"
                  alt="Default blog image"
                  style={{ width: '100%', maxHeight: 350, objectFit: 'contain', borderRadius: 8, marginBottom: 16 }}
                />
              )}
              <div style={{ marginBottom: 16 }}>
                <b>Content:</b>
                <div style={{ fontSize: 16, lineHeight: 1.7, marginTop: 8 }}>{selectedBlog.content}</div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
}
