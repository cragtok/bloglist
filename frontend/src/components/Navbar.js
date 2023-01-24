import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../reducers/userReducer";
import { setBlogs } from "../reducers/blogsReducer";

import blogService from "../services/blogs";
import { setUsers } from "../reducers/usersReducer";
import { useLoggedInUser } from "../hooks";

const styles = {
    navbarStart: {
        marginRight: "auto",
        marginLeft: "38px",
    },
    navbarEnd: {
        marginRight: 0,
    },
};

const Navbar = () => {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const { user, isLoggedIn } = useLoggedInUser();

    const handleLogout = () => {
        dispatch(logoutUser());
        window.localStorage.removeItem("loggedInUser");
        blogService.setToken(null);
        dispatch(setBlogs([]));
        dispatch(setUsers([]));
        navigate("/");
    };

    if (!isLoggedIn()) {
        return null;
    }
    return (
        <nav
            className="navbar is-primary has-shadow mb-4"
            role="navigation"
            aria-label="main navigation"
        >
            <div className="navbar-brand">
                <a
                    role="button"
                    onClick={() => setIsActive(!isActive)}
                    className="navbar-burger"
                    aria-label="menu"
                    aria-expanded="false"
                    data-target="navbarBasicExample"
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div
                className={!isActive ? "navbar-menu" : "navbar-menu is-active"}
            >
                <div className="navbar-start" style={styles.navbarStart}>
                    <Link
                        className={`navbar-item ${
                            location.pathname === "/" ? "is-active" : ""
                        }`}
                        to="/"
                    >
                        Home
                    </Link>
                    <Link
                        className={`navbar-item ${
                            location.pathname === `/users/${user.id}`
                                ? "is-active"
                                : ""
                        }`}
                        to={`/users/${user.id}`}
                    >
                        Blogs
                    </Link>
                    <Link
                        className={`navbar-item ${
                            location.pathname === "/users" ? "is-active" : ""
                        }`}
                        to="/users"
                    >
                        Users
                    </Link>
                </div>
                <div className="navbar-end" style={styles.navbarEnd}>
                    <div className="navbar-item">
                        <div className="navbar-item">
                            <div className="tag is-primary is-medium">
                                {`${user.name} logged in`}
                            </div>
                        </div>
                        <div
                            className="
                        buttons navbar-item"
                        >
                            <a
                                className="button is-light is-responsive is-fullwidth"
                                onClick={handleLogout}
                            >
                                Log Out
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
