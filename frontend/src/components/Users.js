import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import UsersSortingForm from "./UsersSortingForm";
import useData from "../hooks/useData";

import { setLoadingState } from "../reducers/loadingReducer";
import { setUsers } from "../reducers/usersReducer";

const Users = () => {
    const dispatch = useDispatch();
    const users = useSelector(state => {
        return state.users.map(user => {
            return {
                ...user,
                totalBlogLikes: user.blogs.reduce(
                    (acc, currValue) => acc + currValue.likes,
                    0
                ),
                totalBlogComments: user.blogs.reduce(
                    (acc, currValue) => acc + currValue.comments.length,
                    0
                ),
            };
        });
    });
    const { isLoading } = useSelector(state => state.loading);

    const usersService = useData("/api/users");

    const [sortCategory, setSortCategory] = useState("");
    const [sortMethod, setSortMethod] = useState("descending");

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

    const sortFunc = (a, b) => {
        const compareValues = (a, b) => {
            if (a === b) {
                return 0;
            }

            if (sortMethod === "ascending") {
                return a > b ? 1 : -1;
            }

            if (sortMethod === "descending") {
                return a > b ? -1 : 1;
            }
        };
        if (!sortCategory) return 0;
        if (sortCategory === "username")
            return compareValues(
                a.username.toLowerCase(),
                b.username.toLowerCase()
            );
        if (sortCategory === "blogs")
            return compareValues(a.blogs.length, b.blogs.length);
        if (sortCategory === "totalLikes") {
            return compareValues(a.totalBlogLikes, b.totalBlogLikes);
        }
        if (sortCategory === "totalComments") {
            return compareValues(a.totalBlogComments, b.totalBlogComments);
        }
    };

    return (
        <div>
            <h2 className="title is-2 mt-5">Users</h2>
            <br />
            <UsersSortingForm
                sortCategory={sortCategory}
                setSortCategory={setSortCategory}
                sortMethod={sortMethod}
                setSortMethod={setSortMethod}
            />
            <table className="table is-striped is-bordered is-hoverable is-fullwidth">
                <thead>
                    <tr>
                        <th
                            className={`${
                                sortCategory === "username"
                                    ? "has-text-success"
                                    : ""
                            }`}
                        >
                            User
                        </th>
                        <th
                            className={`${
                                sortCategory === "blogs"
                                    ? "has-text-success"
                                    : ""
                            }`}
                        >
                            Blogs
                        </th>
                        {sortCategory === "totalLikes" && (
                            <th className="has-text-success">
                                Total Blog Likes
                            </th>
                        )}
                        {sortCategory === "totalComments" && (
                            <th className="has-text-success">
                                Total Blog Comments
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {[...users].sort(sortFunc).map(user => (
                        <tr key={user.id}>
                            <td>
                                <Link to={`/users/${user.id}`}>
                                    {user.name}
                                </Link>{" "}
                            </td>
                            <td>{user.blogs.length}</td>
                            {sortCategory === "totalLikes" && (
                                <td>{user.totalBlogLikes}</td>
                            )}
                            {sortCategory === "totalComments" && (
                                <td>{user.totalBlogComments}</td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
