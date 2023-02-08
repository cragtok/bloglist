import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BlogList from "./BlogList";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
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
            {user.blogs.length < 1 ? (
                <p className="subtitle mt-3">No Blogs Added By User</p>
            ) : (
                <BlogList
                    blogs={[...user.blogs].sort((a, b) => b.likes - a.likes)}
                />
            )}
        </div>
    );
};

export default User;
