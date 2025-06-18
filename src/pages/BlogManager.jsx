import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Space, ConfigProvider, Flex, Tag } from "antd";
import { BlogManagerAPI } from "../apis/blogManager";

export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await BlogManagerAPI.getAll();
      setBlogs(res.data);
    } catch (err) {
      message.error("Failed to fetch blogs!");
      setBlogs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await BlogManagerAPI.delete(id);
      message.success("Deleted successfully!");
      fetchBlogs();
    } catch {
      message.error("Delete failed!");
    }
  };

  const handleApprove = async (id) => {
    try {
      await BlogManagerAPI.approve(id);
      message.success("Approved successfully!");
      fetchBlogs();
    } catch {
      message.error("Approve failed!");
    }
  };

  const handleReject = async (id) => {
    try {
      await BlogManagerAPI.reject(id);
      message.success("Rejected successfully!");
      fetchBlogs();
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

  const columns = [
    { title: "ID", dataIndex: "blogId", key: "blogId" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Content", dataIndex: "content", key: "content" },
    { title: "Posted At", dataIndex: "postedAt", key: "postedAt" },
    { title: "Posted By", dataIndex: "postedBy", key: "postedBy" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "Approved")
          return <Tag color="success">Approved</Tag>;
        if (status === "Pending" || status === 0)
          return <Tag color="processing">Processing</Tag>;
        if (status === "Rejected" || status === 2)
          return <Tag color="error">Rejected</Tag>;
        return <Tag color="default">{status}</Tag>;
      }
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Flex gap="small" wrap>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.blogId)}
          >
            <Button color="danger" variant="solid">
              Delete
            </Button>
          </Popconfirm>
          <Button
            color="cyan"
            variant="solid"
            onClick={() => handleApprove(record.blogId)}
            disabled={record.status === "Approved"}
          >
            Approve
          </Button>
          <Button
            color="warning"
            variant="solid"
            onClick={() => handleReject(record.blogId)}
            disabled={record.status === "Rejected"}
          >
            Reject
          </Button>
        </Flex>
      ),
    },
  ];

  return (
    <ConfigProvider>
      <div style={{ padding: 24 }}>
        <h2>Blog List</h2>
        <Table
          columns={columns}
          dataSource={blogs}
          rowKey="blogId"
          loading={loading}
          pagination={{ pageSize: 6 }}
          bordered
        />
      </div>
    </ConfigProvider>
  );
}
