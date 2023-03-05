import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import BlogList from "./BlogList";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import SortingForm from "./SortingForm";
import FilterForm from "./FilterForm";

import useFormListener from "../hooks/useFormListener";
import useModifiedData from "../hooks/useModifiedData";
import useAPI from "../hooks/useAPI";

import { setUsers } from "../reducers/usersReducer";
import { setLoadingState, setUsersFetched } from "../reducers/loadingReducer";
import { displayNotification } from "../reducers/notificationReducer";

import { blogFilterFields, initialBlogFilters } from "../utils/filterFieldData";
import { blogSortFields } from "../utils/sortFieldData";
import generateErrorMessage from "../utils/generateErrorMessage";

const User = () => {
    const id = useParams().id;

    const blogFormRef = useRef();
    const sortingFormRef = useRef();
    const filterFormRef = useRef();

    const dispatch = useDispatch();
    const { isLoading, usersFetched } = useSelector(state => state.loading);
    const user = useSelector(state => state.users.filter(u => u.id === id)[0]);
    const { filterCategories, sortCategory, sortMethod } = useSelector(
        state => state.form["blogs"]
    );

    const usersService = useAPI("/api/users");
    const [modifiedData, initializeData] = useModifiedData("blogs");

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedInUser");
        const fetchData = async () => {
            dispatch(setLoadingState(true));
            const loggedInUser = JSON.parse(loggedUserJSON);
            usersService.setServiceToken(loggedInUser.token);
            try {
                const fetchedUsers = await usersService.getAll();
                dispatch(setUsers(fetchedUsers));
                const foundUser = fetchedUsers.filter(u => u.id === id)[0];
                if (foundUser) {
                    initializeData(foundUser.blogs);
                    dispatch(setUsersFetched(true));
                }
            } catch (error) {
                dispatch(
                    displayNotification(generateErrorMessage(error), "error", 4)
                );
            }
            dispatch(setLoadingState(false));
        };

        if (loggedUserJSON && !usersFetched) {
            fetchData();
        } else {
            initializeData(user.blogs);
        }
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

    if (!isLoading && !usersFetched) {
        return <div>User not found</div>;
    }

    return (
        <div>
            <h2 className="title is-2 mt-5">{user.name}</h2>
            <h4 className="title is-4">added blogs</h4>
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
            <Togglable title="" ref={sortingFormRef} buttonLabel="Sort Blogs">
                <SortingForm
                    page="blogs"
                    title="Sort Blogs"
                    sortFields={blogSortFields}
                />
            </Togglable>
            <br />
            <Togglable title="" ref={filterFormRef} buttonLabel="Filter Blogs">
                <FilterForm
                    page="blogs"
                    formTitle="Blogs"
                    filterFields={blogFilterFields}
                    initialFilters={initialBlogFilters}
                />
            </Togglable>
            <br />
            {user.blogs.length < 1 ? (
                <p className="subtitle mt-3">No blogs added by user</p>
            ) : (
                <BlogList
                    blogs={modifiedData}
                    sortedField={sortCategory}
                    filterCategories={filterCategories}
                />
            )}
        </div>
    );
};

export default User;
