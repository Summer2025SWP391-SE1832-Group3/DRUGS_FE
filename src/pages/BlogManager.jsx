import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Space, ConfigProvider, Flex, Tag, Modal, Radio } from "antd";
import { BlogManagerAPI } from "../apis/blogManager";

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
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Unknown";
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
          color = "processing";
        } else if (status === "Approved" || status === 1) {
          display = "Approved";
          color = "success";
        } else if (status === "Rejected" || status === 2) {
          display = "Rejected";
          color = "error";
        }
        return <Tag color={color}>{display}</Tag>;
      }
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const isFinal = record.status === "Approved" || record.status === 1 || record.status === "Rejected" || record.status === 2;
        return (
          <Flex gap="small" wrap>
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
          <Radio.Group
            options={[
              { label: 'All', value: 'All' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Approved', value: 'Approved' },
              { label: 'Rejected', value: 'Rejected' },
            ]}
            optionType="button"
            buttonStyle="solid"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            size="small"
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
        >
          {selectedBlog && (
            <div>
              <p><b>Title:</b> {selectedBlog.title}</p>
              <p><b>Content:</b> {selectedBlog.content}</p>
              <p><b>Posted At:</b> {selectedBlog.postedAt}</p>
              <p><b>Posted By:</b> {selectedBlog.postedBy}</p>
              <p><b>Status:</b> {getStatusText(selectedBlog.status)}</p>
            </div>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
}
