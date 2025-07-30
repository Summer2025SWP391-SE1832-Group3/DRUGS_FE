import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
    const navigate = useNavigate();
    return (
        <>
            <nav
                className="navbar navbar-main navbar-expand-lg shadow-lg z-index-sticky"
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
                <div className="container-fluid py-0 px-3 d-flex align-items-center justify-content-between">
                    {/* Logo và tiêu đề */}
                    <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center justify-content-center me-2"
                            style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(45deg,rgb(190, 78, 78),rgb(0, 247, 255))',
                                borderRadius: '50%',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate('/')}
                        >
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
                    {/* Tiêu đề căn giữa trên mobile */}
                    <div className="d-md-none flex-grow-1 text-center">
                        <h6 className="font-weight-bolder text-white mb-0" style={{ fontSize: '16px' }}>
                            Drug Use Prevention Support System
                        </h6>
                    </div>
                    <div className="d-flex align-items-center justify-content-between" style={{position: 'absolute', left:'65%', right: '10%', transform: 'translateX(-180%)', width: '100%', gap: 2, zIndex: 2, alignItems: 'center', maxWidth: 300 }}>
                        <a
                            onClick={() => navigate('/courseList')}
                            style={{
                                minWidth: 110,
                                fontWeight: 600,
                                fontSize: 16,
                                color: 'white',
                                background: 'transparent',
                                // border: '2px solid #fff',
                                // borderRadius: 30,
                                padding: '8px 20px',
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
                            <i className="material-symbols-rounded" style={{ fontSize: 20 }}>dashboard</i>
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
                                padding: '8px 28px',
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
                    </div>
                    {/* Nút Courses, All Blogs, Login/Register */}
                    <div className="d-flex mb-0 pb-0 pt-1 px-0">
                        <a
                            className="btn btn-success btn-sm"
                            onClick={() => navigate('/login')}
                            style={{ minWidth: 90 }}
                        >
                            Login
                        </a>
                        <a
                            className="btn btn-primary btn-sm ms-2"
                            onClick={() => navigate('/register')}
                            style={{ minWidth: 90 }}
                        >
                            Register
                        </a>
                    </div>
                </div>
            </nav>
            <style>{`
                .navbar-main .btn:hover {
                    transform: translateY(-1px);
                    transition: all 0.2s ease;
                }
                .navbar-main .btn:active {
                    transform: scale(0.98);
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

                /* Logo hover effect */
                .navbar-brand:hover {
                    transform: scale(1.02);
                    transition: transform 0.2s ease;
                }

                /* Button hover effects */
                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .btn:active {
                    transform: translateY(0) scale(0.98);
                }
            `}</style>
        </>
    )
}
