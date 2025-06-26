import styled from 'styled-components';
import { Button } from 'antd';

// ActionButton: for view, edit, delete
const ActionButton = styled(Button)`
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 20px;
  height: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  
  &.view-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
      color: white;
    }
  }
  
  &.edit-btn {
    background: linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(6, 182, 212, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #0891b2 0%, #0284c7 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(6, 182, 212, 0.4);
      color: white;
    }
  }
  
  &.delete-btn {
    background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
    color: white;
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
      color: white;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// CreateButton: for create new blog
const CreateButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  height: 56px;
  padding: 0 40px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 28px;
  margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 12px;
  
  .anticon {
    font-size: 18px;
  }
  
  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
    color: white;
  }
  
  &:active {
    transform: translateY(-2px) scale(1.02);
  }
`;

export { ActionButton, CreateButton };
