import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ onToggleSidebar }) {
    const preventDefault = (e) => e.preventDefault();
    const navigate = useNavigate();
    const location = useLocation();
    
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        navigate('/login');
        window.location.reload();
    };

    // Function to get page name based on current path
    const getPageName = () => {
        const path = location.pathname;
        
        switch (path) {
            case '/':
                return 'Home';
            case '/login':
                return 'Login';
            case '/register':
                return 'Join Community';
            case '/profile':
                return 'My Profile';
            case '/resources':
                return 'Resources';
            
            default:
                if (path.startsWith('/resources/')) {
                    return 'Resources';
                }
                if (path.startsWith('/education/')) {
                    return 'Education Center';
                }
                return 'Prevention Hub';
        }
    };

    const currentPageName = getPageName();

    return (
        <>
            <nav
                className="container-fluid d-flex navbar navbar-main navbar-expand-lg shadow-lg z-index-sticky"
                id="navbarBlur"
                data-scroll="true"
                style={{ 
                    minHeight: 64,
                    background: 'linear-gradient(135deg,rgb(46, 105, 139) 0%,rgb(34, 76, 139) 50%,rgb(53, 50, 205) 100%)',
                    borderBottom: '3px solid rgb(143, 223, 209)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 1000
                }}
            >
                <div className="container-fluid py-0 px-3">
                    <div className="sidenav-toggler sidenav-toggler-inner d-block me-3" style={{ cursor: 'pointer' }}>
                        <a className="nav-link text-body p-0" onClick={e => { onToggleSidebar && onToggleSidebar(); }}>
                            <div className="sidenav-toggler-inner text-white">
                                <i className="sidenav-toggler-line bg-white" />
                                <i className="sidenav-toggler-line bg-white" />
                                <i className="sidenav-toggler-line bg-white" />
                            </div>
                        </a>
                    </div>

                    {/* Brand and breadcrumb section */}
                    <div className="d-flex align-items-center">
                        <div className="navbar-brand d-flex align-items-center me-4" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                            <div className="d-flex align-items-center justify-content-center me-2" 
                                 style={{
                                     width: '40px',
                                     height: '40px',
                                     background: 'linear-gradient(45deg,rgb(190, 78, 78),rgb(0, 247, 255))',
                                     borderRadius: '50%',
                                     boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                 }}>
                                <i className="material-symbols-rounded text-white" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                                    health_and_safety
                                </i>
                            </div>
                            <div className="d-none d-md-block">
                                <h5 className="text-white mb-0 fw-bold" style={{ fontSize: '18px' }}>
                                    Drug Use Prevention
                                </h5>
                                <small className="text-white opacity-8" style={{ fontSize: '12px' }}>
                                    Prevention & Recovery
                                </small>
                            </div>
                        </div>
                    </div>
                    {/* Centered Courses & Blogs navigation - absolute center */}
                    <div style={{ position: 'absolute', left:'65%', right: '10%', top: 0, height: '100%', transform: 'translateX(-165%)', display: 'flex', alignItems: '', zIndex: 2 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', maxWidth: 400 }}>
                        <a
                                onClick={() => navigate('/surveyList')}
                                style={{
                                    minWidth: 110,
                                    fontWeight: 600,
                                    fontSize: 16,
                                    color: 'white',
                                    background: 'transparent',
                                    // border: '2px solid #fff',
                                    // borderRadius: 30,
                                    padding: '8px 10px',
                                    boxShadow: 'none',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    borderRadius: '8px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.15)';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(255,255,255,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                                onMouseDown={(e) => {
                                    e.target.style.transform = 'translateY(0px) scale(0.98)';
                                }}
                                onMouseUp={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                            >
                                <i className="material-symbols-rounded" style={{ fontSize: 20}}>quiz</i>
                                Survey
                            </a>
                            <a
                                onClick={() => navigate('/courseList')}
                                style={{
                                    minWidth: 120,
                                    fontWeight: 600,
                                    fontSize: 16,
                                    color: 'white',
                                    background: 'transparent',
                                    // border: '2px solid #fff',
                                    // borderRadius: 30,
                                    padding: '8px 10px',
                                    boxShadow: 'none',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    borderRadius: '8px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.15)';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(255,255,255,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                                onMouseDown={(e) => {
                                    e.target.style.transform = 'translateY(0px) scale(0.98)';
                                }}
                                onMouseUp={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                            >
                                <i className="material-symbols-rounded" style={{ fontSize: 20}}>dashboard</i>
                                Courses
                            </a>
                            <a
                                onClick={() => navigate('/blogList')}
                                style={{
                                    minWidth: 110,
                                    fontWeight: 600,
                                    fontSize: 16,
                                    color: 'white',
                                    background: 'transparent',
                                    // border: '2px solid #fff',
                                    // borderRadius: 30,
                                    padding: '8px 16px',
                                    boxShadow: 'none',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    borderRadius: '8px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.15)';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(255,255,255,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                                onMouseDown={(e) => {
                                    e.target.style.transform = 'translateY(0px) scale(0.98)';
                                }}
                                onMouseUp={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                            >
                                <i className="material-symbols-rounded" style={{ fontSize: 20 }}>post</i>
                                Blogs
                            </a>
                            <a
                                onClick={() => navigate('/consultants')}
                                style={{
                                    minWidth: 140,
                                    fontWeight: 600,
                                    fontSize: 16,
                                    color: 'white',
                                    background: 'transparent',
                                    padding: '8px 16px',
                                    boxShadow: 'none',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    borderRadius: '8px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.15)';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(255,255,255,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                                onMouseDown={(e) => {
                                    e.target.style.transform = 'translateY(0px) scale(0.98)';
                                }}
                                onMouseUp={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                            >
                                <i className="material-symbols-rounded" style={{ fontSize: 20 }}>groups</i>
                                Consultants
                            </a>
                        </div>
                    </div>
                    <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                        <ul className="ms-md-auto pe-md-3 d-flex align-items-center navbar-nav justify-content-end">
                            
                            {/* Profile */}
                            <li className="nav-item me-2">
                                <a
                                    className="nav-link text-white p-2"
                                    onClick={() => navigate('/profile')}
                                    style={{ cursor: 'pointer', borderRadius: '8px' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <i className="material-symbols-rounded">account_circle</i>
                                </a>
                            </li>

                            {/* Settings & Logout */}
                            <li className="nav-item dropdown">
                                <a 
                                    className="nav-link text-white p-2"
                                    onClick={preventDefault}
                                    id="settingsDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    style={{ cursor: 'pointer', borderRadius: '8px' }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <i className="material-symbols-rounded">more_vert</i>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end p-2 border-0 shadow-lg" 
                                    aria-labelledby="settingsDropdown"
                                    style={{ minWidth: '180px', borderRadius: '12px' }}>
                                    <li>
                                        <a className="dropdown-item border-radius-md py-2" onClick={e => { e.preventDefault(); handleLogout(); }}>
                                            <div className="d-flex align-items-center">
                                                <i className="material-symbols-rounded text-danger me-2">logout</i>
                                                <span className="font-weight-bold text-danger">Logout</span>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Add custom CSS for animations */}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                
                .navbar-nav .nav-link:hover {
                    transform: translateY(-1px);
                    transition: all 0.2s ease;
                }
                
                .dropdown-menu {
                    animation: fadeInDown 0.3s ease;
                }
                
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .navbar-brand:hover {
                    transform: scale(1.02);
                    transition: transform 0.2s ease;
                }

                /* Custom hover effects for navigation links */
                .nav-link-custom {
                    position: relative;
                    overflow: hidden;
                }

                .nav-link-custom::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s;
                }

                .nav-link-custom:hover::before {
                    left: 100%;
                }

                /* Smooth transitions for all interactive elements */
                * {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Enhanced button press effect */
                .nav-link-custom:active {
                    transform: scale(0.95) translateY(1px);
                }
            `}</style>
        </>
    )
}