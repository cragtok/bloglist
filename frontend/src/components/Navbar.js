import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { setUser } from "../reducers/userReducer";
import { setBlogs } from "../reducers/blogsReducer";
import { setUsers } from "../reducers/usersReducer";
import { removeNotification } from "../reducers/notificationReducer";
import { resetFormState } from "../reducers/formReducer";
import { resetLoadingState } from "../reducers/loadingReducer";

import { clearLocalStorage } from "../utils/localStorageUtils";

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

    const user = useSelector(state => state.user);

    const handleLogout = () => {
        dispatch(setUser(null));
        dispatch(removeNotification());
        dispatch(setBlogs([]));
        dispatch(setUsers([]));
        dispatch(resetFormState());
        dispatch(resetLoadingState());
        clearLocalStorage();
        navigate("/");
    };

    const handleActiveTabClick = () => {
        if (isActive) setIsActive(false);
    };

    const generateTabClassName = pathname =>
        location.pathname === pathname
            ? "navbar-item is-active"
            : "navbar-item";

    if (!user) {
        return null;
    }
    return (
        <nav
            className="navbar is-fixed-top is-primary has-shadow"
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
                        onClick={handleActiveTabClick}
                        className={generateTabClassName("/")}
                        to="/"
                    >
                        Home
                    </Link>
                    <Link
                        onClick={handleActiveTabClick}
                        className={generateTabClassName(`/users/${user.id}`)}
                        to={`/users/${user.id}`}
                    >
                        Blogs
                    </Link>
                    <Link
                        onClick={handleActiveTabClick}
                        className={generateTabClassName("/users")}
                        to="/users"
                    >
                        Users
                    </Link>
                </div>
                <div className="navbar-end" style={styles.navbarEnd}>
                    <div className="navbar-item">
                        <div className="navbar-item">
                            <div
                                className={`tag ${
                                    !isActive
                                        ? "is-primary is-medium"
                                        : "is-outlined"
                                }`}
                            >
                                {`${user.name} logged in`}
                            </div>
                        </div>
                        <div
                            className="
                        buttons navbar-item"
                        >
                            <a
                                className="button is-responsive is-fullwidth"
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
