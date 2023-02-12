import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BlogList from "./BlogList";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import SortingForm from "./SortingForm";

import useData from "../hooks/useData";
import { setUsers } from "../reducers/usersReducer";
import { setLoadingState } from "../reducers/loadingReducer";

const User = () => {
    const id = useParams().id;
    const blogFormRef = useRef();
    const dispatch = useDispatch();

    const usersService = useData("/api/users");

    const { isLoading } = useSelector(state => state.loading);

    const users = useSelector(state =>
        [...state.users].sort((a, b) => b.blogs.length - a.blogs.length)
    );

    const [sortCategory, setSortCategory] = useState("");
    const [sortMethod, setSortMethod] = useState("descending");

    const user = users.filter(u => u.id === id)[0];

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
        if (sortCategory === "title")
            return compareValues(a.title.toLowerCase(), b.title.toLowerCase());
        if (sortCategory === "author")
            return compareValues(
                a.author.toLowerCase(),
                b.author.toLowerCase()
            );
        if (sortCategory === "createdAt")
            return compareValues(a.createdAt, b.createdAt);
        if (sortCategory === "likes") return compareValues(a.likes, b.likes);
        if (sortCategory === "comments")
            return compareValues(a.comments.length, b.comments.length);
    };
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <div>
                <p>User not found</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="title is-2 mt-5">{user.name}</h2>
            <h4 className="title is-4">added blogs</h4>
            {user.id && (
                <Togglable
                    title=""
                    ref={blogFormRef}
                    buttonLabel="Create New Post"
                    style={{
                        marginLeft: "1%",
                        marginRight: "1%",
                    }}
                >
                    <BlogForm
                        toggleVisibility={() => {
                            blogFormRef.current.toggleVisibility();
                        }}
                    />
                </Togglable>
            )}

            <br />
            <SortingForm
                sortCategory={sortCategory}
                setSortCategory={setSortCategory}
                sortMethod={sortMethod}
                setSortMethod={setSortMethod}
            />
            <br />
            {user.blogs.length < 1 ? (
                <p className="subtitle mt-3">No Blogs Added By User</p>
            ) : (
                <BlogList
                    blogs={[...user.blogs].sort(sortFunc)}
                    sortedField={sortCategory}
                />
            )}
        </div>
    );
};

export default User;
