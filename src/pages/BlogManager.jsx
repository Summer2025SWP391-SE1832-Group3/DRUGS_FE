import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Space, ConfigProvider, Flex } from "antd";
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

  const handleEdit = (record) => {
    // Tùy bạn muốn mở modal hay chuyển trang edit
    message.info("Edit feature not implemented yet!");
  };

  const columns = [
    { title: "ID", dataIndex: "blogId", key: "blogId" },
    { title: "Staff Creator", dataIndex: "staffCreator", key: "staffCreator" },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Content", dataIndex: "content", key: "content" },
    { title: "Category", dataIndex: "category", key: "category" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Flex gap="small" wrap>
          <Button
            color="warning"
            variant="solid"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
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
          >
            Approve
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
        />
      </div>
    </ConfigProvider>
  );
}
