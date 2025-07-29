import React, { useState, useEffect, useMemo } from 'react';
import { Card, List, Typography, Tag, Space, Spin, Empty, message, Modal, Form, Avatar, Tooltip } from 'antd';
import { CalendarOutlined, EyeOutlined, UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, HeartOutlined, MessageOutlined, ShareAltOutlined } from '@ant-design/icons';
import { BlogAPI } from '../../apis/blog';
import styled, { keyframes } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import CreateBlogForm from '../../components/blog/CreateBlogForm';
import { ActionButton, CreateButton } from '../../components/ui/Buttons';
import StatusTag from '../../components/ui/StatusTag';

const { Title, Paragraph, Text } = Typography;
const apiBase = "https://api-drug-be.purintech.id.vn";
const DEFAULT_BLOG_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000';

// Enhanced Animation keyframes
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Main Container with improved background
const StyledContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  min-width: 100%;
  overflow-x: hidden;
  background: linear-gradient(135deg, 
    rgb(212, 213, 221) 0%, 
    rgb(202, 196, 209) 25%, 
    rgb(217, 212, 218) 50%, 
    rgb(224, 172, 179) 75%, 
    #4facfe 100%);
  background-size: 400% 400%;
  /* animation: ${gradient} 15s ease infinite; */
  padding: 32px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.2) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
`;

// Enhanced Header with glassmorphism effect
const StyledHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
  padding: 40px 32px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 1px 0 rgba(255, 255, 255, 0.5) inset;
  /* animation: ${fadeInUp} 1s ease-out; */
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    /* animation: ${shimmer} 3s infinite; */
  }
  
  .header-icon {
    font-size: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 16px;
    display: inline-block;
    /* animation: ${pulse} 2s infinite; */
  }
  
  .header-title {
    background: linear-gradient(135deg, #2c3e50 0%, #667eea 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 !important;
    font-weight: 800;
    font-size: 2.5rem;
    letter-spacing: -1px;
  }
  
  .header-subtitle {
    color: #64748b;
    font-size: 1.1rem;
    margin-top: 12px !important;
    margin-bottom: 0 !important;
    font-weight: 500;
  }
`;

// Enhanced Blog Card with better hover effects
const StyledBlogCard = styled(Card)`
  margin-bottom: 32px;
  border-radius: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 1px 0 rgba(255, 255, 255, 0.5) inset;
  transition: box-shadow 0.3s;
  /* opacity: 0; */
  /* animation: ${slideInLeft} 0.8s ease-out forwards; */
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
    /* transform: translateX(-100%); */
    transition: transform 0.5s ease;
  }
  
  &:hover {
    /* transform: translateY(-12px) scale(1.02); */
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.15),
      0 8px 32px rgba(102, 126, 234, 0.2);
      
    &::before {
      /* transform: translateX(0); */
    }
  }
  
  .ant-card-head {
    border-bottom: 1px solid rgba(240, 240, 240, 0.5);
    padding: 24px 32px 20px;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.9) 0%, 
      rgba(248, 250, 252, 0.9) 100%);
  }
  
  .ant-card-head-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .ant-card-body {
    padding: 32px;
  }
  
  .ant-card-extra {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
`;

// Enhanced Blog Content with better typography
const BlogContent = styled.div`
  .blog-preview {
    font-size: 16px;
    line-height: 1.7;
    color: #475569;
    margin-bottom: 24px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(transparent, rgba(255, 255, 255, 0.9));
      pointer-events: none;
    }
  }
  
  .blog-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;
    border-top: 1px solid rgba(226, 232, 240, 0.6);
    margin-top: 20px;
  }
  
  .meta-left {
    display: flex;
    align-items: center;
    gap: 20px;
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    
    .anticon {
      color: #94a3b8;
    }
  }
`;

// Enhanced Modal styling
const StyledModal = styled(Modal)`
  .ant-modal {
    top: 0 !important;
  }
    
  .ant-modal-root {
    z-index: 2000 !important;
  }

  .ant-modal-content {
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(20px);
  }

  .ant-modal-header {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%, 
      rgba(248, 250, 252, 0.95) 100%);
    border-bottom: 1px solid rgba(226, 232, 240, 0.6);
    padding: 24px 32px;
    border-radius: 24px 24px 0 0;
  }

  .ant-modal-title {
    font-size: 24px;
    font-weight: 700;
    background: linear-gradient(135deg, #2c3e50 0%, #667eea 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .ant-modal-body {
    padding: 32px;
    background: rgba(255, 255, 255, 0.95);
    max-height: calc(100vh - 200px);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(241, 245, 249, 0.5);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px;
    }
  }

  .ant-modal-close {
    top: 20px;
    right: 20px;
    
    .ant-modal-close-x {
      width: 44px;
      height: 44px;
      line-height: 44px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
      }
    }
  }
`;

// Enhanced Modal Content
const ModalContent = styled.div`
  .blog-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 16px;
    margin-bottom: 32px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
  
  .blog-title {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #2c3e50 0%, #667eea 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 24px;
    line-height: 1.2;
  }
  
  .blog-content {
    font-size: 18px;
    line-height: 1.8;
    color: #475569;
    margin-bottom: 32px;
    white-space: pre-wrap;
  }
  
  .blog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 0;
    border-top: 2px solid rgba(226, 232, 240, 0.6);
    margin-top: 24px;
  }
  
  .blog-meta-info {
    display: flex;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }
  
  .meta-info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
  }
`;

// Enhanced Empty State
const StyledEmpty = styled(Empty)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 80px 40px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  
  .ant-empty-image {
    margin-bottom: 24px;
    
    svg {
      width: 120px;
      height: 120px;
      opacity: 0.6;
    }
  }
  
  .ant-empty-description {
    font-size: 18px;
    color: #64748b;
    font-weight: 500;
  }
`;

// Loading Spinner Container
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  
  .ant-spin {
    .ant-spin-dot {
      i {
        background-color: #667eea;
      }
    }
  }
`;

// Enhanced Image component with better error handling
const BlogImage = ({ src, alt, className, style, fallbackSrc = DEFAULT_BLOG_IMAGE }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);
  
  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
    />
  );
};

function getImageUrl(img) {
  if (!img) return DEFAULT_BLOG_IMAGE;
  console.log(img); 
  if (img.startsWith('http')) return img;
  return `${apiBase}${img}`;
}

export default function BlogByUserId() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [visibleBlogs, setVisibleBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      setVisibleBlogs([]);
      const response = await BlogAPI.getByUserId(userId);
      setBlogs(response);
      console.log("blog res",response);
    } catch (error) {
      message.error('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Tạo thẻ style
    const style = document.createElement('style');
    style.innerHTML = `
      body.modal-open {
        overflow: hidden !important;
      }
    `;
    document.head.appendChild(style);
  
    // Cleanup khi unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (isModalVisible || isCreateModalVisible) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isModalVisible, isCreateModalVisible]);
  
  useEffect(() => {
    fetchUserBlogs();
  }, [userId]);

  useEffect(() => {
    setVisibleBlogs(blogs);
  }, [blogs, loading]);

  const openViewModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalVisible(true);
    setIsEditMode(false);
    setEditBlog(null);
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalVisible(true);
    setIsEditMode(true);
    setEditBlog(blog);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBlog(null);
    setIsEditMode(false);
    setEditBlog(null);
  };

  const handleCreateBlog = async (values) => {
    try {
      setUploading(true);
      const imageFile = values.blogImages?.[0]?.originFileObj;
      const formData = {
        ...values,
        blogImages: imageFile ? [imageFile] : []
      };

      await BlogAPI.createBlog(formData);
      message.success('Blog created successfully');
      setIsCreateModalVisible(false);
      fetchUserBlogs();
    } catch (error) {
      message.error('Failed to create blog');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateBlog = async (values) => {
    try {
      setUploading(true);
      let blogImages = values.blogImages;
      let imageFile = blogImages?.[0]?.originFileObj;
      if (!imageFile && editBlog && editBlog.blogImages && editBlog.blogImages.length > 0) {
        imageFile = undefined;
        blogImages = editBlog.blogImages;
      } else if (imageFile) {
        blogImages = [imageFile];
      } else {
        blogImages = [];
      }
      const formData = {
        ...values,
        blogImages
      };
      await BlogAPI.updateBlog(editBlog.blogId, formData);
      message.success('Blog updated successfully');
      closeModal();
      fetchUserBlogs();
    } catch (error) {
      message.error('Failed to update blog');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBlog = (blog) => {
    Modal.confirm({
      title: 'Delete Confirmation',
      content: (
        <div>
          <p>Are you sure you want to delete this blog post?</p>
          <Text strong>"{blog.title}"</Text>
          <p style={{ marginTop: 8, color: '#ef4444' }}>This action cannot be undone.</p>
        </div>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        try {
          await BlogAPI.deleteBlog(blog.blogId);
          message.success('Blog deleted successfully');
          fetchUserBlogs();
        } catch (error) {
          message.error('Failed to delete blog');
        }
      },
    });
  };

  const editInitialValues = useMemo(() => {
    if (!editBlog) return undefined;
    return {
      title: editBlog.title,
      content: editBlog.content,
      category: editBlog.category,
      blogImages:
        editBlog.blogImages && editBlog.blogImages.length > 0
          ? [
              {
                uid: '-1',
                name: 'current-image.jpg',
                status: 'done',
                url: getImageUrl(editBlog.blogImages[0]),
              },
            ]
          : [],
    };
  }, [editBlog]);

  if (loading) {
    return (
      <StyledContainer>
        <ContentWrapper>
          <LoadingContainer>
            <Spin size="large" />
          </LoadingContainer>
        </ContentWrapper>
      </StyledContainer>
    );
  }

  

  return (
    <StyledContainer>
      <ContentWrapper>
        <StyledHeader>
          <div className="header-icon">
            <UserOutlined />
          </div>
          <Title level={1} className="header-title">
            My Blog Collection
          </Title>
          <Paragraph className="header-subtitle">
            Create, manage and showcase your amazing stories
          </Paragraph>
        </StyledHeader>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
          <CreateButton
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
            size="large"
          >
            Create New Blog
          </CreateButton>
        </div>

        {blogs.length === 0 ? (
          <StyledEmpty
            description="No blog posts found. Start creating your first amazing story!"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={blogs}
            renderItem={(blog) => (
              <StyledBlogCard
                key={blog.blogId}
                title={blog.title}
                extra={
                  <Space wrap>
                    <StatusTag color={blog.status === 'Approved' ? 'green' : 'orange'}>
                      {blog.status}
                    </StatusTag>
                    <ActionButton 
                      className="view-btn"
                      icon={<EyeOutlined />}
                      onClick={() => openViewModal(blog)}
                    >
                      View
                    </ActionButton>
                    <ActionButton 
                      className="edit-btn"
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(blog)}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton 
                      className="delete-btn"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteBlog(blog)}
                    >
                      Delete
                    </ActionButton>
                  </Space>
                }
              >
                <BlogContent>
                  <div className="blog-preview">
                    <Paragraph
                      ellipsis={{ rows: 3 }}
                      style={{ margin: 0, fontSize: '16px', lineHeight: '1.6' }}
                    >
                      {blog.content}
                    </Paragraph>
                  </div>
                  
                  <div className="blog-meta">
                    <div className="meta-left">
                      <div className="meta-item">
                        <CalendarOutlined />
                        <span>{new Date(blog.postedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="meta-item">
                        <UserOutlined />
                        <span>{blog.postedBy}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', color: '#94a3b8' }}>
                      <Tooltip title="Likes">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <HeartOutlined />
                          <span>{Math.floor(Math.random() * 50) + 10}</span>
                        </span>
                      </Tooltip>
                      <Tooltip title="Comments">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageOutlined />
                          <span>{Math.floor(Math.random() * 20) + 5}</span>
                        </span>
                      </Tooltip>
                    </div>
                  </div>
                </BlogContent>
              </StyledBlogCard>
            )}
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
            }}
          />
        )}

        {/* Create Blog Modal */}
        <StyledModal
          title="Create New Blog Post"
          open={isCreateModalVisible}
          onCancel={() => setIsCreateModalVisible(false)}
          footer={null}
          width={900}
          destroyOnHidden
        >
          <CreateBlogForm
            onFinish={handleCreateBlog}
            onCancel={() => setIsCreateModalVisible(false)}
            uploading={uploading}
          />
        </StyledModal>

        {/* View/Edit Blog Modal */}
        <StyledModal
          title={isEditMode ? "Edit Blog Post" : "Blog Post Details"}
          open={isModalVisible}
          onCancel={closeModal}
          footer={null}
          width={900}
          destroyOnHidden
        >
          {selectedBlog && !isEditMode && (
            <ModalContent>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '32px' 
              }}>
                <div className="blog-title">{selectedBlog.title}</div>
                <ActionButton
                  className="edit-btn"
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(selectedBlog)}
                >
                  Edit Blog
                </ActionButton>
              </div>
              
              <BlogImage
                src={getImageUrl( selectedBlog.blogImages[0])}
                alt={selectedBlog.title}
                className="blog-image"
              />
              
              <div className="blog-content">{selectedBlog.content}</div>
              
              <div className="blog-footer">
                <div className="blog-meta-info">
                  <div className="meta-info-item">
                    <StatusTag color={selectedBlog.status === 'Approved' ? 'green' : 'orange'}>
                      {selectedBlog.status}
                    </StatusTag>
                  </div>
                  <div className="meta-info-item">
                    <UserOutlined />
                    <span>By {selectedBlog.postedBy}</span>
                  </div>
                  <div className="meta-info-item">
                    <span>Category: {selectedBlog.category}</span>
                  </div>
                </div>
                <div className="meta-info-item">
                  <CalendarOutlined />
                  <span>{new Date(selectedBlog.postedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </ModalContent>
          )}
          
          {selectedBlog && isEditMode && (
            <div>
              <CreateBlogForm
                onFinish={handleUpdateBlog}
                onCancel={() => setIsEditMode(false)}
                uploading={uploading}
                initialValues={editInitialValues}
              />
            </div>
          )}
        </StyledModal>
      </ContentWrapper>
    </StyledContainer>
  );
}