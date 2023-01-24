import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { displayNotification } from "../reducers/notificationReducer";
import { loginUser } from "../reducers/userReducer";
import { fetchBlogs } from "../reducers/blogsReducer";
import { fetchUsers } from "../reducers/usersReducer";

import blogService from "../services/blogs";
import usersService from "../services/users";

const SignupForm = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const notification = useSelector(state => state.notification);

    const handleRegister = async e => {
        setIsSubmitting(true);
        e.preventDefault();
        try {
            await usersService.create(username, name, password);
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
                navigate("/");
                return;
            }
            dispatch(displayNotification(statusObj.message, "error", 4));
            setIsSubmitting(false);
        } catch (error) {
            dispatch(
                displayNotification(error.response.data.error, "error", 4)
            );
            setIsSubmitting(false);
        }
    };
    return (
        <div>
            <h2 className="title is-2">Register</h2>
            <form onSubmit={handleRegister}>
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
                    <label className="label">Name:</label>
                    <input
                        className={`input${
                            notification.type === "error" ? " is-danger" : ""
                        }`}
                        id="login-name"
                        type="text"
                        name="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
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
                    Register
                </button>
                <Link to="/login">
                    <button className="button ml-3">Sign In</button>
                </Link>
            </form>
        </div>
    );
};

export default SignupForm;
