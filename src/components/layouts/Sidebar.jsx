import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar({ open }) {
    // Adjust the top value to match your navbar's height (e.g., 64px)
  const navbarHeight = 74
  return (
    <aside className="sidebar bg-gradient-dark position-fixed h-100" 
    style={{ width: 240, 
            top: navbarHeight, 
            left: open ? 0 : -240, 
            height: `calc(100vh - ${navbarHeight}px)`, 
            transition: 'left 0.3s' , 
            zIndex: 1040 }}>
      <nav className="nav flex-column mt-3">
        <Link to="/" className="nav-link text-white">
          <i className="material-symbols-rounded me-2">dashboard</i>
          Dashboard
        </Link>
        <Link to="/users" className="nav-link text-white">
          <i className="material-symbols-rounded me-2">group</i>
          Users
        </Link>
        <Link to="/drugs" className="nav-link text-white">
          <i className="material-symbols-rounded me-2">medication</i>
          Drugs
        </Link>
        <Link to="/orders" className="nav-link text-white">
          <i className="material-symbols-rounded me-2">shopping_cart</i>
          Orders
        </Link>
        <Link to="/settings" className="nav-link text-white">
          <i className="material-symbols-rounded me-2">settings</i>
          Settings
        </Link>
      </nav>
    </aside>
  )
}