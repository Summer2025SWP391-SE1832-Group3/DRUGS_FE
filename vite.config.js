import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'antd/es/locale/vi_VN', // hoặc locale bạn dùng
      'antd/es/modal',
      'antd/es/message',
      'antd/es/notification',
      'antd/es/button',
      'antd/es/style',
    ],
  },
});