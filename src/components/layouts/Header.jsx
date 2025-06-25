import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header() {
    const preventDefault = (e) => {
        e.preventDefault();
    };
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
                    {/* Nút Login/Register */}
                    <div className="d-flex align-items-center mb-0 pb-0 pt-1 px-0">
                        <a
                            className="btn btn-outline-light btn-sm"
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
            `}</style>
        </>
    )
}
