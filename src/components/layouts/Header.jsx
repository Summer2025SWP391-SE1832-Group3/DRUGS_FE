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
                className="navbar navbar-main bg-gradient-dark navbar-expand-lg position-sticky top-0 px-0 shadow-none z-index-sticky"
                id="navbarBlur"
                data-scroll="true"
            >
                <div className="container-fluid py-1 px-3">

                    <div aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                            <li className="breadcrumb-item text-sm">
                                <a onClick={() => navigate('/')}>
                                    <img
                                        src="https://cdn.iconscout.com/icon/premium/png-256-thumb/drug-abuse-2755791-2288754.png?f=webp"
                                        alt="Logo"
                                        style={{
                                            height: '24px',
                                            width: '24px',
                                            objectFit: 'cover',
                                            verticalAlign: 'middle',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </a>
                            </li>
                            <li className="breadcrumb-item text-sm">
                                <a className="opacity-7 text-white">
                                    Home
                                </a>
                            </li>
                        </ol>
                        <h6 className="font-weight-bolder text-white mb-0">Drug Use Prevention Support System</h6>
                    </div>

                    <div
                        className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
                        id="navbar"
                    >
                        
                        <ul className="ms-md-auto pe-md-3 d-flex align-items-center navbar-nav justify-content-end">
                            <li className="nav-item">
                                {/* Nút Đăng nhập */}
                                <a
                                    className="btn btn-outline-light btn-sm ms-2"
                                    onClick={() => navigate('/login')}
                                    style={{ minWidth: 90 }}
                                >
                                    Đăng nhập
                                </a>
                                {/* Nút Đăng ký */}
                                <a
                                    className="btn btn-primary btn-sm ms-2"
                                    onClick={() => navigate('/register')}
                                    style={{ minWidth: 90 }}
                                >
                                    Đăng ký
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
