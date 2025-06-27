import { Tag } from 'antd';
import styled from 'styled-components';

const StyledTag = styled(Tag)`
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  border: none;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  &.ant-tag-green {
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  &.ant-tag-orange {
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  }
`;

export default function StatusTag({ color, children, ...rest }) {
  return (
    <StyledTag color={color} {...rest}>{children}</StyledTag>
  );
}
