import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import useLogin from "../hooks/useLogin";

const SignupForm = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const [isSubmitting, userService] = useLogin();

    const notification = useSelector(state => state.notification);

    const handleRegister = async e => {
        e.preventDefault();
        await userService.register(username, name, password);
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
