import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../reducers/notificationReducer";

import useLoginAndRegister from "../hooks/useLoginAndRegister";

const LoginAndSignupForm = () => {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const location = useLocation();
    const notification = useSelector(state => state.notification);

    const [isLoading, loginAndRegisterService] = useLoginAndRegister();
    const dispatch = useDispatch();

    const handleSubmit = async e => {
        e.preventDefault();
        location.pathname === "/login"
            ? await loginAndRegisterService.login(username, password)
            : await loginAndRegisterService.register(username, name, password);
    };

    return (
        <div>
            <h2 className="title is-2">
                {location.pathname === "/login" ? "Log In" : "Register"}{" "}
            </h2>
            <form onSubmit={handleSubmit}>
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
                {location.pathname === "/register" && (
                    <>
                        <div>
                            <label className="label">Name:</label>
                            <input
                                className={`input${
                                    notification.type === "error"
                                        ? " is-danger"
                                        : ""
                                }`}
                                id="login-name"
                                type="text"
                                name="name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <br />
                    </>
                )}
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
                        isLoading ? " is-loading" : ""
                    }`}
                    disabled={isLoading}
                >
                    {location.pathname === "/register" ? "Register" : "Sign In"}
                </button>

                <Link
                    to={
                        location.pathname === "/register"
                            ? "/login"
                            : "/register"
                    }
                >
                    <button
                        className="button ml-3"
                        onClick={() => {
                            if (notification.type === "error") {
                                dispatch(removeNotification());
                            }
                        }}
                    >
                        {location.pathname === "/login"
                            ? "Register"
                            : "Sign In"}
                    </button>
                </Link>
            </form>
            <br />
        </div>
    );
};

export default LoginAndSignupForm;
