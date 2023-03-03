import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import SortingForm from "./SortingForm";
import FilterForm from "./FilterForm";

import useAPI from "../hooks/useAPI";
import useModifiedData from "../hooks/useModifiedData";

import { setLoadingState, setBlogsFetched } from "../reducers/loadingReducer";
import { setBlogs } from "../reducers/blogsReducer";
import { displayNotification } from "../reducers/notificationReducer";
import { blogFilterFields, initialBlogFilters } from "../utils/filterFieldData";
import { blogSortFields } from "../utils/sortFieldData";
import generateErrorMessage from "../utils/generateErrorMessage";

const Home = () => {
    const blogFormRef = useRef();
    const sortingFormRef = useRef();
    const filterFormRef = useRef();

    const dispatch = useDispatch();
    const blogService = useAPI("/api/blogs");

    const blogs = useSelector(state => state.blogs);
    const { isLoading, blogsFetched } = useSelector(state => state.loading);
    const { filterCategories, sortCategory, sortMethod } = useSelector(
        state => state.form["home"]
    );
    const { filterCategoriesPresent, modifiedData, setInitialData } =
        useModifiedData("home");

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedInUser");
        const fetchBlogs = async () => {
            dispatch(setLoadingState(true));
            const loggedInUser = JSON.parse(loggedUserJSON);
            blogService.setServiceToken(loggedInUser.token);
            try {
                const blogs = await blogService.getAll();
                dispatch(setBlogs(blogs));
                dispatch(setBlogsFetched(true));
                setInitialData(blogs);
            } catch (error) {
                dispatch(
                    displayNotification(generateErrorMessage(error), "error", 4)
                );
            }
            dispatch(setLoadingState(false));
        };
        if (loggedUserJSON && !blogsFetched) {
            fetchBlogs();
        } else {
            setInitialData(blogs);
        }
    }, []);

    useEffect(() => {
        if (sortCategory && !sortingFormRef.current.visible) {
            sortingFormRef.current.setVisibility(true);
        }

        const element = document.getElementById("bloglist");
        if (sortCategory && element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }, [sortCategory, sortMethod]);

    useEffect(() => {
        if (filterFormRef.current && !filterFormRef.current.visible) {
            filterFormRef.current.setVisibility(filterCategoriesPresent());
        }

        const element = document.getElementById("bloglist");
        if (filterCategoriesPresent() && element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }, [filterCategories]);

    if (isLoading) {
        return <div>Loading...</div>;
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
                        page="home"
                        title="Sort Blogs"
                        sortFields={blogSortFields}
                    />
                </Togglable>
                <br />
                <Togglable
                    title=""
                    ref={filterFormRef}
                    buttonLabel="Filter Blogs"
                >
                    <FilterForm
                        page="home"
                        formTitle="Blogs"
                        filterFields={blogFilterFields}
                        initialFilters={initialBlogFilters}
                    />
                </Togglable>
                <br />
                <BlogList
                    blogs={modifiedData}
                    sortedField={sortCategory}
                    filterCategories={filterCategories}
                />
            </>
        </div>
    );
};

export default Home;
