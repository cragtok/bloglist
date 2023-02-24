import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import SortingForm from "./SortingForm";
import FilterForm from "./FilterForm";

import useData from "../hooks/useData";
import useSortedAndFilteredData from "../hooks/useSortedAndFilteredData";

import { setLoadingState, setBlogsFetched } from "../reducers/loadingReducer";
import { setBlogs } from "../reducers/blogsReducer";
import { setNotification } from "../reducers/notificationReducer";
import { blogFilterFields } from "../utils/filterFieldData";
import { blogSortFields } from "../utils/sortFieldData";

const Home = () => {
    const blogFormRef = useRef();
    const sortingFormRef = useRef();
    const filterFormRef = useRef();

    const dispatch = useDispatch();
    const blogService = useData("/api/blogs");

    const blogs = useSelector(state => state.blogs);
    const { isLoading, blogsFetched } = useSelector(state => state.loading);
    const {
        sortCategory,
        sortMethod,
        setSortCategory,
        setSortMethod,
        modifiedData,
        resetSortState,
        resetFilterState,
        filterCategories,
        setFilterCategories,
        filterCategoriesPresent,
        setInitialData,
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
                dispatch(setBlogsFetched(true));
                setInitialData(blogs);
            } catch (error) {
                dispatch(
                    setNotification(error.response.data.error, "error", 4)
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
    }, [sortCategory]);

    useEffect(() => {
        if (filterFormRef.current && !filterFormRef.current.visible) {
            filterFormRef.current.setVisibility(filterCategoriesPresent());
        }
    }, [filterCategories]);

    if (isLoading || !blogsFetched) {
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
                        sortCategory={sortCategory}
                        setSortCategory={setSortCategory}
                        sortMethod={sortMethod}
                        setSortMethod={setSortMethod}
                        title="Sort Blogs"
                        resetForm={resetSortState}
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
                        formTitle="Blogs"
                        filterCategories={filterCategories}
                        setFilterCategories={setFilterCategories}
                        resetForm={resetFilterState}
                        filterFields={blogFilterFields}
                    />
                </Togglable>
                <br />
                <BlogList blogs={modifiedData} sortedField={sortCategory} />
            </>
        </div>
    );
};

export default Home;
