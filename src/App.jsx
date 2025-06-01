import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Navbar from './components/layouts/Navbar'
import Sidebar from './components/layouts/Sidebar'
import Home from './pages/Home'
import AppRoutes from './routes/appRoutes'
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  return (
    <>
      {/* <Navbar onToggleSidebar={handleToggleSidebar} />
      <Sidebar open={sidebarOpen} />
      <main style={{ marginLeft: sidebarOpen ? 240 : 0, transition: 'margin-left 0.3s' }}>
        
      </main> */}
      <AppRoutes />
    </>
  )
}

export default App
