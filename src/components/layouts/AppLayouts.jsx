import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Header from './Header'
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayouts() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  })
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  })
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }
  return (
    <>
      {isLoggedIn ? (
        <>
          <Navbar onToggleSidebar={handleToggleSidebar} />
          <Sidebar open={sidebarOpen} />
        </>
      ) : (
        <Header />
      )}

      <div style={{ marginTop: 0, paddingTop: 0, marginLeft: isLoggedIn && sidebarOpen ? 240 : 0, transition: 'margin-left 0.3s' }}>
        <Outlet context={{ setIsLoggedIn }} />
      </div>

    </>
  )
}
