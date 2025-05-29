import React from 'react'

export default function Navbar({ onToggleSidebar }) {
    // Optional: Define focus handlers if needed
    // const focused = (e) => { /* ... */ }
    // const defocused = (e) => { /* ... */ }

    const preventDefault = (e) => e.preventDefault();

    return (
        <>
            <nav
                className="navbar navbar-main bg-gradient-dark navbar-expand-lg position-sticky top-1 px-0 shadow-none z-index-sticky"
                id="navbarBlur"
                data-scroll="true"
            >
                <div className="container-fluid py-1 px-3">
                    <div aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                            <li className="breadcrumb-item text-sm">
                                <a className="opacity-3 text-dark" href="#" onClick={preventDefault}>
                                    {/* ...SVG... */}
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
                        <h6 className="font-weight-bolder text-white mb-0">New User</h6>
                    </div>
                    <div className="sidenav-toggler sidenav-toggler-inner d-xl-block d-none ">
                        <a href="#" className="nav-link text-body p-0" onClick={e => { e.preventDefault(); onToggleSidebar && onToggleSidebar(); }}>
                            <div className="sidenav-toggler-inner text-white">
                                <i className="sidenav-toggler-line bg-white" />
                                <i className="sidenav-toggler-line bg-white" />
                                <i className="sidenav-toggler-line bg-white" />
                            </div>
                        </a>
                    </div>
                    <div
                        className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
                        id="navbar"
                    >
                        <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                            <div className="input-group input-group-outline">
                                <label className="form-label">Search here</label>
                                <input
                                    type="text"
                                    className="form-control text-white"
                                    // onFocus={focused}
                                    // onBlur={defocused}
                                />
                            </div>
                        </div>
                        <ul className="navbar-nav  justify-content-end">
                            <li className="nav-item">
                                <a
                                    href="#"
                                    className="nav-link text-body p-0 position-relative"
                                    onClick={preventDefault}
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
                                    onClick={preventDefault}
                                >
                                    <div className="sidenav-toggler-inner">
                                        <i className="sidenav-toggler-line" />
                                        <i className="sidenav-toggler-line" />
                                        <i className="sidenav-toggler-line" />
                                    </div>
                                </a>
                            </li>
                            <li className="nav-item px-3">
                                <a href="#" className="nav-link text-body p-0" onClick={preventDefault}>
                                    <i className="material-symbols-rounded fixed-plugin-button-nav cursor-pointer text-white">
                                        settings
                                    </i>
                                </a>
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