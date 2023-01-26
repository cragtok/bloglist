import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import useLogin from "../hooks/useLogin";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const notification = useSelector(state => state.notification);

    const [isSubmitting, userService] = useLogin();

    const handleLogin = async e => {
        e.preventDefault();
        await userService.login(username, password);
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
