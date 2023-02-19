import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import SortingForm from "./SortingForm";
import Togglable from "./Togglable";

import useData from "../hooks/useData";
import useSortedAndFilteredData from "../hooks/useSortedAndFilteredData";

import { setLoadingState } from "../reducers/loadingReducer";
import { setUsers } from "../reducers/usersReducer";

const Users = () => {
    const dispatch = useDispatch();
    const sortingFormRef = useRef();

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

    const {
        sortCategory,
        sortMethod,
        setSortCategory,
        setSortMethod,
        modifiedData,
        setModifiedData,
        resetSortState,
    } = useSortedAndFilteredData("users");

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedInUser");
        const fn = async () => {
            dispatch(setLoadingState(true));
            const loggedInUser = JSON.parse(loggedUserJSON);
            usersService.setServiceToken(loggedInUser.token);
            const fetchedUsers = await usersService.getAll();
            dispatch(setUsers(fetchedUsers));
            setModifiedData(
                fetchedUsers.map(user => {
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
                })
            );
            dispatch(setLoadingState(false));
        };
        if (loggedUserJSON && users.length === 0) {
            fn();
        } else {
            setModifiedData(users);
        }
    }, []);

    useEffect(() => {
        if (sortCategory && !sortingFormRef.current.visible) {
            sortingFormRef.current.setVisibility(true);
        }
    }, [sortCategory]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isLoading && !users.length) {
        return <p>No users...</p>;
    }

    return (
        <div>
            <h2 className="title is-2 mt-5">Users</h2>
            <br />
            <Togglable title="" ref={sortingFormRef} buttonLabel="Sort Blogs">
                <SortingForm
                    sortCategory={sortCategory}
                    setSortCategory={setSortCategory}
                    sortMethod={sortMethod}
                    setSortMethod={setSortMethod}
                    title="Sort Users"
                    resetForm={resetSortState}
                    sortFields={[
                        { name: "Username", value: "username" },
                        { name: "Number of Blogs", value: "blogs" },
                        { name: "Total Blog Likes", value: "totalLikes" },
                        { name: "Totel Blog Comments", value: "totalComments" },
                    ]}
                />
            </Togglable>
            <br />
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
                    {(sortCategory ? modifiedData : users).map(user => (
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
