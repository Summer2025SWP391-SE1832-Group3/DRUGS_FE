import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { message } from 'antd';

export default function Sidebar({ open }) {
    const navigate = useNavigate();
    const navbarHeight = 64;

    let isStaff = false;
    let isManager = false;
    let isAdmin = false;
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            isStaff = user && user.role === "Staff";
            isManager = user && user.role === "Manager";
            isAdmin = user && user.role === "Admin";
        } catch { }
    }

    const handlePersonalBlogsClick = () => {
        if (!userData) {
            message.warning('Please login to view your personal blogs');
            navigate('/');
            return;
        }
        try {
            const user = JSON.parse(userData);
            if (user && user.userId) {
                navigate(`/blogByUserId/${user.userId}`);
            } else {
                message.error('Unable to find user information');
                navigate('/');
            }
        } catch (error) {
            message.error('Error accessing user data');
            navigate('/');
        }
    };

    return (
        <aside
            className="sidebar position-fixed h-100 shadow-lg"
            style={{
                width: 200,
                top: navbarHeight,
                left: open ? 0 : -220,
                height: `calc(100vh - ${navbarHeight}px)`,
                transition: 'left 0.3s',
                zIndex: 1040,
                background: 'linear-gradient(135deg, rgb(46, 105, 139) 0%, rgb(34, 76, 139) 50%, rgb(53, 50, 205) 100%)',
                borderTopRightRadius: 18,
                borderBottomRightRadius: 18,
                boxShadow: '2px 0 16px rgba(34,76,139,0.08)',
                padding: '12px 0',
            }}
        >
            <nav className="nav flex-column mt-2">
                <Link to="/profile" className="nav-link text-white d-flex align-items-center px-3 py-2">
                    <i className="material-symbols-rounded me-2">account_circle</i>
                    <span style={{ fontSize: 15 }}>Profile</span>
                </Link>
                {isAdmin && (
                    <Link to="/accountListAdmin" className="nav-link text-white d-flex align-items-center px-3 py-2">
                    <i className="material-symbols-rounded me-2">group</i>
                    <span style={{ fontSize: 15 }}>Manage Account</span>
                </Link>
                )}
                {(isStaff || isManager) && (
                    <Link to="/manageCourse" className="nav-link text-white d-flex align-items-center px-3 py-2">
                        <i className="material-symbols-rounded me-2">dashboard</i>
                        <span style={{ fontSize: 15 }}>Manage Course</span>
                    </Link>
                )}
                {(isStaff || isManager) && ( 
                    <Link to="/manageSurvey" className="nav-link text-white d-flex align-items-center px-3 py-2">
                    <i className="material-symbols-rounded me-2">assignment_turned_in</i>
                    <span style={{ fontSize: 15 }}>Manage Survey</span>
                </Link>
                )}
                <Link to="/" className="nav-link text-white d-flex align-items-center px-3 py-2">
                    <i className="material-symbols-rounded me-2">group</i>
                    <span style={{ fontSize: 15 }}>Consultants</span>
                </Link>
                {isManager && (
                    <Link to="/blogManager" className="nav-link text-white d-flex align-items-center px-3 py-2">
                    <i className="material-symbols-rounded me-2">event</i>
                    <span style={{ fontSize: 15 }}>Blog Manager</span>
                </Link>              
                )}
                {isStaff && (
                    <a onClick={handlePersonalBlogsClick} className="nav-link text-white d-flex align-items-center px-3 py-2" style={{ cursor: 'pointer' }}>
                        <i className="material-symbols-rounded me-2">post</i>
                        <span style={{ fontSize: 15 }}>Personal Blogs</span>
                    </a>
                )}
            </nav>
        </aside>
    )
}