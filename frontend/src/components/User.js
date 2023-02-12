import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BlogList from "./BlogList";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import BlogSortingForm from "./BlogSortingForm";

import useData from "../hooks/useData";
import { setUsers } from "../reducers/usersReducer";
import { setLoadingState } from "../reducers/loadingReducer";
import useSortedData from "../hooks/useSortedData";

const User = () => {
    const id = useParams().id;
    const blogFormRef = useRef();
    const dispatch = useDispatch();

    const usersService = useData("/api/users");

    const { isLoading } = useSelector(state => state.loading);

    const user = useSelector(state => state.users.filter(u => u.id === id)[0]);

    const {
        sortCategory,
        sortMethod,
        setSortCategory,
        setSortMethod,
        sortedData,
        setSortedData,
    } = useSortedData();

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedInUser");
        const fn = async () => {
            dispatch(setLoadingState(true));
            const loggedInUser = JSON.parse(loggedUserJSON);
            usersService.setServiceToken(loggedInUser.token);
            const fetchedUsers = await usersService.getAll();
            dispatch(setUsers(fetchedUsers));
            const foundUser = fetchedUsers.filter(u => u.id === id)[0];
            if (foundUser) {
                setSortedData(foundUser.blogs);
            }
            dispatch(setLoadingState(false));
        };

        if (loggedUserJSON && !user) {
            fn();
        } else {
            setSortedData(user.blogs);
        }
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
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
            <BlogSortingForm
                sortCategory={sortCategory}
                setSortCategory={setSortCategory}
                sortMethod={sortMethod}
                setSortMethod={setSortMethod}
            />
            <br />
            {user.blogs.length < 1 ? (
                <p className="subtitle mt-3">No blogs added by user</p>
            ) : (
                <BlogList blogs={sortedData} sortedField={sortCategory} />
            )}
        </div>
    );
};

export default User;
