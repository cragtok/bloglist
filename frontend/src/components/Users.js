import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import useData from "../hooks/useData";

import { setLoadingState } from "../reducers/loadingReducer";
import { setUsers } from "../reducers/usersReducer";

const Users = () => {
    const dispatch = useDispatch();
    const users = useSelector(state =>
        [...state.users].sort((a, b) => b.blogs.length - a.blogs.length)
    );
    const { isLoading } = useSelector(state => state.loading);

    const usersService = useData("/api/users");

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedInUser");
        const fn = async () => {
            dispatch(setLoadingState(true));
            const loggedInUser = JSON.parse(loggedUserJSON);
            usersService.setServiceToken(loggedInUser.token);
            const fetchedUsers = await usersService.getAll();
            dispatch(setUsers(fetchedUsers));
            dispatch(setLoadingState(false));
        };
        if (loggedUserJSON && users.length === 0) {
            fn();
        }
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isLoading && !users.length) {
        return <p>No users...</p>;
    }
    return (
        <div>
            <h2 className="title is-2 mt-5">Users</h2>
            <table className="table is-striped is-bordered is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Blogs</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                <Link to={`/users/${user.id}`}>
                                    {user.name}
                                </Link>{" "}
                            </td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
