import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Space, Avatar, Tag, Spin, Button, Divider, List, Empty, Form, Input, message, Dropdown, Menu, Modal } from 'antd';
import { UserOutlined, CalendarOutlined, ArrowLeftOutlined, LikeOutlined, MessageOutlined, SendOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { BlogAPI } from '../../apis/blog';
import { CommentAPI } from '../../apis/comment';
import styled from 'styled-components';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const StyledContainer = styled.div`
  padding: 24px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const StyledImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const StyledMeta = styled.div`
  margin: 16px 0;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
`;

const StyledTag = styled(Tag)`
  margin-right: 8px;
  padding: 4px 8px;
  border-radius: 4px;
`;

const DEFAULT_BLOG_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000';
const apiBase = "https://api-drug-be.purintech.id.vn";

const CommentSection = styled.div`
  margin-top: 32px;
  padding: 24px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
`;

const CommentForm = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
`;

const CommentItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const CommentContent = styled.div`
  margin-left: 40px;
  color: #262626;
  line-height: 1.6;
`;

const CommentNumber = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  background-color: #1890ff;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
  font-size: 12px;
  font-weight: bold;
  margin-right: 8px;
`;

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [form] = Form.useForm();
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const response = await BlogAPI.getById(id);
        setBlog(response);
        const commentRes = await CommentAPI.getCommentsByBlogId(id);
        setComments(Array.isArray(commentRes) ? commentRes : []);
      } catch (error) {
        setComments([]);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchBlogDetails();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSubmitComment = async (values) => {
    try {
      setCommentLoading(true);
      await CommentAPI.postComment(values.content, Number(id));
      const commentRes = await CommentAPI.getCommentsByBlogId(id);
      setComments(Array.isArray(commentRes) ? commentRes : []);
      form.resetFields();
      message.success('Comment added successfully!');
    } catch (error) {
      message.error('Failed to add comment. Please try again.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
    setEditModalVisible(true);
  };

  const handleEditModalOk = async () => {
    try {
      await CommentAPI.updateComment(editingComment.commentId, editContent);
      const commentRes = await CommentAPI.getCommentsByBlogId(id);
      setComments(Array.isArray(commentRes) ? commentRes : []);
      setEditModalVisible(false);
      message.success('Comment updated successfully!');
    } catch (error) {
      if (error?.response?.status === 403) {
        message.error('You do not have permission to edit this comment.');
      } else {
        message.error('Failed to update comment.');
      }
    }
  };

  const handleEditModalCancel = () => {
    setEditModalVisible(false);
  };

  const handleDeleteComment = (comment) => {
    Modal.confirm({
      title: 'Delete Comment',
      content: 'Are you sure you want to delete this comment?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await CommentAPI.deleteComment(comment.commentId);
          const commentRes = await CommentAPI.getCommentsByBlogId(id);
          setComments(Array.isArray(commentRes) ? commentRes : []);
          message.success('Comment deleted successfully!');
        } catch (error) {
          if (error?.response?.status === 403) {
            message.error('You do not have permission to delete this comment.');
          } else {
            message.error('Failed to delete comment.');
          }
        }
      }
    });
  };

  if (loading) {
    return (
      <StyledContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </StyledContainer>
    );
  }

  if (!blog) {
    return (
      <StyledContainer>
        <Card>
          <Empty description="Blog not found" />
        </Card>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/blogList')}
        style={{ marginBottom: '16px' }}
      >
        Back to Blogs
      </Button>

      <StyledCard>
        <Title level={2}>{blog.title}</Title>
        
        <StyledMeta>
          <Space size="large">
            <Space>
              <Avatar icon={<UserOutlined />} />
              <Text strong>{blog.postedBy}</Text>
            </Space>
            <Space>
              <CalendarOutlined />
              <Text>{new Date(blog.postedAt).toLocaleDateString()}</Text>
            </Space>
            <StyledTag color="blue">{blog.status}</StyledTag>
          </Space>
        </StyledMeta>

        {blog.blogImages && blog.blogImages.length > 0 ? (
          <StyledImage 
            src={`${apiBase}${blog.blogImages[0]}`}
            alt={blog.title}
          />
        ) : (
          <StyledImage 
            src={DEFAULT_BLOG_IMAGE} 
            alt="Default blog image"
          />
        )}

        <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
          {blog.content}
        </Paragraph>

        <Divider />

        <div style={{ marginTop: '24px' }}>
          <Space>
            <Button type="text" icon={<MessageOutlined />}>
              {comments.length} Comment{comments.length !== 1 ? 's' : ''}
            </Button>
          </Space>
        </div>

        {/* Comment Section */}
        <CommentSection>
          <Title level={4} style={{ marginBottom: '16px' }}>
            <MessageOutlined style={{ marginRight: '8px' }} />
            Comments ({comments.length})
          </Title>
          <CommentForm>
            <Title level={5} style={{ marginBottom: '16px' }}>Add a Comment</Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmitComment}
            >
              <Form.Item
                name="content"
                rules={[
                  { required: true, message: 'Please enter your comment!' }
                ]}
              >
                <TextArea rows={4} placeholder="Write your comment here..." showCount maxLength={500} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={commentLoading} icon={<SendOutlined />}>Post Comment</Button>
              </Form.Item>
            </Form>
          </CommentForm>
          {comments.length > 0 ? (
            <div>
              <Title level={5} style={{ marginBottom: '16px' }}>All Comments</Title>
              {comments.map((comment, index) => (
                <CommentItem key={comment.commentId || index}>
                  <CommentHeader>
                    <CommentNumber>{index + 1}</CommentNumber>
                    <Avatar size={32} icon={<UserOutlined />} />
                    <div style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', flex: 1 }}>
                      <Text strong>{comment.userName || `User #${index + 1}`}</Text>
                      <Dropdown overlay={
                        <Menu onClick={({ key }) => {
                          if (key === 'edit') handleEditComment(comment);
                          if (key === 'delete') handleDeleteComment(comment);
                        }}>
                          <Menu.Item key="edit" icon={<EditOutlined />}>Change</Menu.Item>
                          <Menu.Item key="delete" icon={<DeleteOutlined />}>Delete</Menu.Item>
                        </Menu>
                      } trigger={["click"]}>
                        <Button
                          type="text"
                          icon={<EllipsisOutlined rotate={90} />}
                          style={{ marginLeft: 16 }}
                        />
                      </Dropdown>
                    </div>
                  </CommentHeader>
                  <CommentContent>{comment.content}</CommentContent>
                  <div style={{ marginLeft: 40, color: '#8c8c8c', fontSize: 12, marginTop: 4 }}>
                    {comment.commentAt && new Date(comment.commentAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </CommentItem>
              ))}
            </div>
          ) : (
            <Empty description="No comments yet. Be the first to comment!" style={{ margin: '24px 0' }} />
          )}
        </CommentSection>
      </StyledCard>
      <Modal
        title="Edit Comment"
        open={editModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        okText="Save"
        cancelText="Cancel"
      >
        <Input.TextArea
          value={editContent}
          onChange={e => setEditContent(e.target.value)}
          rows={4}
          maxLength={500}
          showCount
        />
        <div style={{ height: 32 }} />
      </Modal>
    </StyledContainer>
  );
}
