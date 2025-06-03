import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onToggleSidebar }) {
    // Optional: Define focus handlers if needed
    // const focused = (e) => { /* ... */ }
    // const defocused = (e) => { /* ... */ }

    const preventDefault = (e) => e.preventDefault();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        navigate('/login');
        window.location.reload(); //đảm bảo layout cập nhật lại trạng thái đăng nhập
    };

    return (
        <>
            <nav
                className="navbar navbar-main bg-gradient-dark navbar-expand-lg position-sticky top-0 px-0 shadow-none z-index-sticky"
                id="navbarBlur"
                data-scroll="true"
            >
                <div className="container-fluid py-1 px-3">
                    <div className="sidenav-toggler sidenav-toggler-inner d-xl-block d-none me-3">
                        <a href="#" className="nav-link text-body p-0" onClick={e => { e.preventDefault(); onToggleSidebar && onToggleSidebar(); }}>
                            <div className="sidenav-toggler-inner text-white">
                                <i className="sidenav-toggler-line bg-white" />
                                <i className="sidenav-toggler-line bg-white" />
                                <i className="sidenav-toggler-line bg-white" />
                            </div>
                        </a>
                    </div>
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
                                <a className="opacity-7 text-white" href="#" onClick={preventDefault}>
                                    Pages
                                </a>
                            </li>
                            <li
                                className="breadcrumb-item text-sm text-white active"
                                aria-current="page"
                            >
                                New User
                            </li>
                        </ol>
                    </div>

                    <div
                        className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
                        id="navbar"
                    >
                        <ul className="ms-md-auto pe-md-3 d-flex align-items-center navbar-nav  justify-content-end">
                            <li className="nav-item">
                                <a
                                    className="nav-link text-body p-0 position-relative"
                                    onClick={() => (navigate('/profile'))}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <i className="material-symbols-rounded me-sm-1 text-white">
                                        account_circle
                                    </i>
                                </a>
                            </li>
                            <li className="nav-item d-xl-none ps-3 d-flex align-items-center">
                                <a
                                    href="#"
                                    className="nav-link text-body p-0"
                                    id="iconNavbarSidenav"
                                    onClick={e => { e.preventDefault(); onToggleSidebar && onToggleSidebar(); }}
                                >
                                    <div className="sidenav-toggler-inner">
                                        <i className="sidenav-toggler-line" />
                                        <i className="sidenav-toggler-line" />
                                        <i className="sidenav-toggler-line" />
                                    </div>
                                </a>
                            </li>
                            <li className="nav-item dropdown px-3">
                                <a href="#" className="nav-link text-body p-0"
                                    onClick={preventDefault}
                                    id="settingsDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="material-symbols-rounded fixed-plugin-button-nav cursor-pointer text-white">
                                        settings
                                    </i>
                                </a>
                                <ul className='dropdown-menu dropdown-menu-end p-2 me-sm-n4' aria-labelledby='settingsDropdown'>
                                    <li >
                                        <a className="dropdown-item border-radius-md" onClick={e => { e.preventDefault(); handleLogout(); }}>
                                        <div className="d-flex align-items-center py-1">
                                            <div className="my-auto">
                                                <span className="material-symbols-rounded">logout</span>
                                            </div>
                                            <div className="ms-2">
                                                <h6 className="text-sm font-weight-normal mb-0">
                                                    Logout
                                                </h6>
                                            </div>
                                        </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown pe-2">
                                <a
                                    href="#"
                                    className="nav-link text-body p-0 position-relative"
                                    id="dropdownMenuButton"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    onClick={preventDefault}
                                >
                                    <i className="material-symbols-rounded cursor-pointer text-white">
                                        notifications
                                    </i>
                                    <span className="position-absolute top-5 start-100 translate-middle badge rounded-pill bg-danger border border-white small py-1 px-2">
                                        <span className="small">11</span>
                                        <span className="visually-hidden">unread notifications</span>
                                    </span>
                                </a>
                                <ul
                                    className="dropdown-menu dropdown-menu-end p-2 me-sm-n4"
                                    aria-labelledby="dropdownMenuButton"
                                >
                                    <li className="mb-2">
                                        <a className="dropdown-item border-radius-md" href="#" onClick={preventDefault}>
                                            <div className="d-flex align-items-center py-1">
                                                <div className="my-auto">
                                                    <span className="material-symbols-rounded">email</span>
                                                </div>
                                                <div className="ms-2">
                                                    <h6 className="text-sm font-weight-normal mb-0">
                                                        New message from Laur
                                                    </h6>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="mb-2">
                                        <a className="dropdown-item border-radius-md" href="#" onClick={preventDefault}>
                                            <div className="d-flex align-items-center py-1">
                                                <div className="my-auto">
                                                    <span className="material-symbols-rounded">headphones</span>
                                                </div>
                                                <div className="ms-2">
                                                    <h6 className="text-sm font-weight-normal mb-0">
                                                        New album by Travis Scott
                                                    </h6>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item border-radius-md" href="#" onClick={preventDefault}>
                                            <div className="d-flex align-items-center py-1">
                                                <div className="my-auto">
                                                    <span className="material-symbols-rounded">
                                                        shopping_cart
                                                    </span>
                                                </div>
                                                <div className="ms-2">
                                                    <h6 className="text-sm font-weight-normal mb-0">
                                                        Payment successfully completed
                                                    </h6>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}