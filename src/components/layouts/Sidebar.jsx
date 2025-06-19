import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { message } from 'antd';

export default function Sidebar({ open }) {
    const navigate = useNavigate();
    const navbarHeight = 55;

    const handlePersonalBlogsClick = () => {
        const userData = localStorage.getItem('user');
        console.log('User data from localStorage:', userData); // Debug log
        
        if (!userData) {
            message.warning('Please login to view your personal blogs');
            navigate('/');
            return;
        }

        try {
            const user = JSON.parse(userData);
            console.log('Parsed user data:', user); // Debug log
            
            if (user && user.userId) {
                navigate(`/blogByUserId/${user.userId}`);
            } else {
                console.error('User data missing userId:', user);
                message.error('Unable to find user information');
                navigate('/');
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            message.error('Error accessing user data');
            navigate('/');
        }
    };

    return (
        <aside className="sidebar bg-gradient-dark position-fixed h-100" 
        style={{ width: 240, 
                top: navbarHeight, 
                left: open ? 0 : -240, 
                height: `calc(100vh - ${navbarHeight}px)`, 
                transition: 'left 0.3s' , 
                zIndex: 1040 }}>
            <nav className="nav flex-column mt-3">
                <Link to="/profile" className="nav-link text-white">
                    <i className="material-symbols-rounded me-2">account_circle</i>
                    Profile
                </Link>
                <Link to="/courseList" className="nav-link text-white">
                    <i className="material-symbols-rounded me-2">dashboard</i>
                    Courses
                </Link>
                <Link to="/" className="nav-link text-white">
                    <i className="material-symbols-rounded me-2">group</i>
                    Consultants
                </Link>
                <Link to="/" className="nav-link text-white">
                    <i className="material-symbols-rounded me-2">event</i>
                    Events
                </Link>
                <Link to="/blogList" className="nav-link text-white">
                    <i className="material-symbols-rounded me-2">post</i>
                    Blogs
                </Link>
                <a onClick={handlePersonalBlogsClick} className="nav-link text-white" style={{ cursor: 'pointer' }}>
                    <i className="material-symbols-rounded me-2">post</i>
                    Personal Blogs
                </a>
            </nav>
        </aside>
    )
}