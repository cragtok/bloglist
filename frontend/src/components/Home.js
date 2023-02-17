import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import SortingForm from "./SortingForm";
import FilterForm from "./FilterForm";

import useData from "../hooks/useData";
import useSortedAndFilteredData from "../hooks/useSortedAndFilteredData";

import { setLoadingState } from "../reducers/loadingReducer";
import { setBlogs } from "../reducers/blogsReducer";
import { setNotification } from "../reducers/notificationReducer";

const Home = () => {
    const blogFormRef = useRef();
    const sortingFormRef = useRef();
    const filterFormRef = useRef();

    const dispatch = useDispatch();
    const blogService = useData("/api/blogs");

    const blogs = useSelector(state => state.blogs);
    const { isLoading } = useSelector(state => state.loading);
    const {
        sortCategory,
        sortMethod,
        setSortCategory,
        setSortMethod,
        modifiedData,
        setModifiedData,
        resetForm,
        filterCategories,
        setFilterCategories,
    } = useSortedAndFilteredData("home");

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedInUser");
        const fetchBlogs = async () => {
            dispatch(setLoadingState(true));
            const loggedInUser = JSON.parse(loggedUserJSON);
            blogService.setServiceToken(loggedInUser.token);
            try {
                const blogs = await blogService.getAll();
                dispatch(setBlogs(blogs));
                setModifiedData(blogs);
            } catch (error) {
                dispatch(
                    setNotification(error.response.data.error, "error", 4)
                );
            }
            dispatch(setLoadingState(false));
        };
        if (loggedUserJSON && !blogs.length) {
            fetchBlogs();
        } else {
            setModifiedData(blogs);
        }
    }, []);

    useEffect(() => {
        if (sortCategory && !sortingFormRef.current.visible) {
            sortingFormRef.current.setVisibility(true);
        }
    }, [sortCategory]);

    useEffect(() => {
        if (
            filterCategories &&
            filterFormRef.current &&
            !filterFormRef.current.visible
        ) {
            filterFormRef.current.setVisibility(
                filterCategories.author ||
                    filterCategories.title ||
                    filterCategories.url ||
                    filterCategories.date.from ||
                    filterCategories.date.to ||
                    filterCategories.numComments.from ||
                    filterCategories.numComments.to ||
                    filterCategories.numLikes.from ||
                    filterCategories.numLikes.to ||
                    filterCategories.likedBlogs ||
                    filterCategories.commentedBlogs
            );
        }
    }, [filterCategories]);

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

                <Togglable
                    title=""
                    ref={sortingFormRef}
                    buttonLabel="Sort Blogs"
                >
                    <SortingForm
                        sortCategory={sortCategory}
                        setSortCategory={setSortCategory}
                        sortMethod={sortMethod}
                        setSortMethod={setSortMethod}
                        title="Sort Blogs"
                        resetForm={resetForm}
                        sortFields={[
                            { name: "Title", value: "title" },
                            { name: "Author", value: "author" },
                            { name: "Date Created", value: "createdAt" },
                            { name: "Number of Likes", value: "likes" },
                            { name: "Number of Comments", value: "comments" },
                        ]}
                    />
                </Togglable>
                <br />
                <Togglable
                    title=""
                    ref={filterFormRef}
                    buttonLabel="Filter Blogs"
                >
                    <FilterForm
                        formTitle="Blogs"
                        filterCategories={filterCategories}
                        setFilterCategories={setFilterCategories}
                    />
                </Togglable>
                <br />
                <BlogList
                    blogs={sortCategory ? modifiedData : blogs}
                    sortedField={sortCategory}
                />
            </>
        </div>
    );
};

export default Home;
