import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useLoggedInUser } from "../hooks";
import BlogList from "./BlogList";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";

const User = () => {
    const id = useParams().id;
    const user = useSelector(state => state.users.find(user => user.id === id));
    const blogFormRef = useRef();
    const loggedInUser = useLoggedInUser();
    if (!loggedInUser.isLoggedIn()) {
        return null;
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
            {loggedInUser.user.id === user.id && (
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
