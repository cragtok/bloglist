import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import SortingForm from "./SortingForm";
import Togglable from "./Togglable";

import useData from "../hooks/useData";
import useSortedAndFilteredData from "../hooks/useSortedAndFilteredData";

import { setLoadingState, setUsersFetched } from "../reducers/loadingReducer";
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
    const { usersFetched } = useSelector(state => state.loading);
    const usersService = useData("/api/users");

    const {
        sortCategory,
        sortMethod,
        setSortCategory,
        setSortMethod,
        modifiedData,
        resetSortState,
        setInitialData,
    } = useSortedAndFilteredData("users");

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedInUser");
        const fn = async () => {
            dispatch(setLoadingState(true));
            const loggedInUser = JSON.parse(loggedUserJSON);
            usersService.setServiceToken(loggedInUser.token);
            const fetchedUsers = await usersService.getAll();
            dispatch(setUsers(fetchedUsers));
            setInitialData(
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
            dispatch(setUsersFetched(true));
            dispatch(setLoadingState(false));
        };
        if (loggedUserJSON && !usersFetched) {
            fn();
        } else {
            setInitialData(users);
        }
    }, []);

    useEffect(() => {
        if (sortCategory && !sortingFormRef.current.visible) {
            sortingFormRef.current.setVisibility(true);
        }
    }, [sortCategory]);

    if (!usersFetched) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2 className="title is-2 mt-5">Users</h2>
            <br />
            <Togglable title="" ref={sortingFormRef} buttonLabel="Sort Users">
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
            {usersFetched && !users.length ? (
                <p>No Users</p>
            ) : (
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
            )}
        </div>
    );
};

export default Users;
