import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import blogService from "../services/blogs";

import { displayNotification } from "../reducers/notificationReducer";
import { loginUser } from "../reducers/userReducer";
import { fetchBlogs } from "../reducers/blogsReducer";
import { fetchUsers } from "../reducers/usersReducer";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const notification = useSelector(state => state.notification);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        const statusObj = await dispatch(loginUser(username, password));
        if (statusObj.success) {
            window.localStorage.clear();
            window.localStorage.setItem(
                "loggedInUser",
                JSON.stringify(statusObj.loggedInUser)
            );
            blogService.setToken(statusObj.loggedInUser.token);
            await dispatch(fetchBlogs());
            await dispatch(fetchUsers());
            setUsername("");
            setIsSubmitting(false);
            setPassword("");
            navigate("/");
        } else {
            dispatch(displayNotification(statusObj.message, "error", 4));
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2 className="title is-2">Log in to application</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label className="label">Username:</label>
                    <input
                        className={`input${
                            notification.type === "error" ? " is-danger" : ""
                        }`}
                        id="login-username"
                        type="text"
                        name="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <br />
                <div>
                    <label className="label">Password:</label>
                    <input
                        className={`input${
                            notification.type === "error" ? " is-danger" : ""
                        }`}
                        id="login-password"
                        type="password"
                        name="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <br />
                <button
                    id="login-button"
                    className={`button is-primary${
                        isSubmitting ? " is-loading" : ""
                    }`}
                    disabled={isSubmitting}
                >
                    Login
                </button>
                <Link to="/register">
                    <button className="button ml-3">Register</button>
                </Link>
            </form>
            <br />
        </div>
    );
};

export default LoginForm;
