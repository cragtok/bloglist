import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import BlogList from "../components/BlogList";
import BlogForm from "../components/BlogForm";
import Togglable from "../components/Togglable";
import SortingForm from "../components/SortingForm";
import FilterForm from "../components/FilterForm";

import useAPI from "../hooks/useAPI";
import useModifiedData from "../hooks/useModifiedData";
import useFormListener from "../hooks/useFormListener";

import { setLoadingState, setBlogsFetched } from "../reducers/loadingReducer";
import { setBlogs } from "../reducers/blogsReducer";
import { displayNotification } from "../reducers/notificationReducer";

import { blogFilterFields } from "../constants/filterFormFields";
import { blogSortFields } from "../constants/sortFormFields";
import { initialBlogFilters } from "../constants/initialFilters";

import generateErrorMessage from "../utils/generateErrorMessage";
import { getLocalStorageToken } from "../utils/localStorageUtils";

const Home = () => {
    const blogFormRef = useRef();
    const sortingFormRef = useRef();
    const filterFormRef = useRef();

    const dispatch = useDispatch();
    const blogs = useSelector(state => state.blogs);
    const { isLoading, blogsFetched } = useSelector(state => state.loading);
    const { filterCategories, sortCategory, sortMethod } = useSelector(
        state => state.form["home"]
    );

    const blogService = useAPI("/api/blogs");
    const [modifiedData, initializeData] = useModifiedData("home");

    useEffect(() => {
        let ignoreRequest = false;
        const fetchData = async () => {
            dispatch(setLoadingState(true));
            blogService.setServiceToken(getLocalStorageToken());
            try {
                const blogs = await blogService.getAll();
                if (!ignoreRequest) {
                    dispatch(setBlogs(blogs));
                    dispatch(setBlogsFetched(true));
                    initializeData(blogs);
                }
            } catch (error) {
                dispatch(
                    displayNotification(generateErrorMessage(error), "error", 4)
                );
            }
            dispatch(setLoadingState(false));
        };

        !blogsFetched ? fetchData() : initializeData(blogs);

        return () => {
            ignoreRequest = true;
        };
    }, []);

    useFormListener(
        sortCategory,
        sortMethod,
        filterCategories,
        filterFormRef,
        sortingFormRef,
        "bloglist"
    );

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
