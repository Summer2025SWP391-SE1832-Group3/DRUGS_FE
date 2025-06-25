import styled, { keyframes } from 'styled-components';

const gradient = keyframes`
  0% { background-position: 50% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 50% 50%; }
`;

const GlobalBackground = styled.div`
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
  background-position: center center;
  background-attachment: fixed;
  animation: ${gradient} 15s ease infinite;
  position: relative;
  z-index: 0;

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
    z-index: 1;
  }
`;

export default GlobalBackground; 