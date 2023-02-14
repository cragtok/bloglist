import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import SortingForm from "./SortingForm";

import useData from "../hooks/useData";
import useSortedData from "../hooks/useSortedData";

import { setLoadingState } from "../reducers/loadingReducer";
import { setBlogs } from "../reducers/blogsReducer";
import { setNotification } from "../reducers/notificationReducer";

const Home = () => {
    const blogFormRef = useRef();

    const dispatch = useDispatch();
    const blogService = useData("/api/blogs");

    const blogs = useSelector(state => state.blogs);
    const { isLoading } = useSelector(state => state.loading);
    const {
        sortCategory,
        sortMethod,
        setSortCategory,
        setSortMethod,
        sortedData,
        setSortedData,
    } = useSortedData([], "home");

    useEffect(() => {
        const fetchBlogs = async () => {
            dispatch(setLoadingState(true));
            const loggedInUser = JSON.parse(loggedUserJSON);
            blogService.setServiceToken(loggedInUser.token);
            try {
                const blogs = await blogService.getAll();
                dispatch(setBlogs(blogs));
                setSortedData(blogs);
            } catch (error) {
                dispatch(
                    setNotification(error.response.data.error, "error", 4)
                );
            }
            dispatch(setLoadingState(false));
        };
        const loggedUserJSON = window.localStorage.getItem("loggedInUser");
        if (loggedUserJSON && !blogs.length) {
            fetchBlogs();
        } else {
            setSortedData(blogs);
        }
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!blogs.length) {
        return <div>No Blogs</div>;
    }
    return (
        <div>
            <>
                <h2 className="title is-2 mt-5">Blog App</h2>
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
                <br />
                <SortingForm
                    sortCategory={sortCategory}
                    setSortCategory={setSortCategory}
                    sortMethod={sortMethod}
                    setSortMethod={setSortMethod}
                    title="Sort Blogs"
                    sortFields={[
                        { name: "Title", value: "title" },
                        { name: "Author", value: "author" },
                        { name: "Date Created", value: "createdAt" },
                        { name: "Number of Likes", value: "likes" },
                        { name: "Number of Comments", value: "comments" },
                    ]}
                />
                <BlogList blogs={sortedData} sortedField={sortCategory} />
            </>
        </div>
    );
};

export default Home;
