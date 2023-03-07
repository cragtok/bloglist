import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import BlogList from "../components/BlogList";
import Togglable from "../components/Togglable";
import BlogForm from "../components/BlogForm";
import SortingForm from "../components/SortingForm";
import FilterForm from "../components/FilterForm";

import useFormListener from "../hooks/useFormListener";
import useModifiedData from "../hooks/useModifiedData";
import useAPI from "../hooks/useAPI";

import { setUsers } from "../reducers/usersReducer";
import { setLoadingState, setUsersFetched } from "../reducers/loadingReducer";
import { displayNotification } from "../reducers/notificationReducer";

import { blogFilterFields, initialBlogFilters } from "../utils/filterFieldData";
import { blogSortFields } from "../utils/sortFieldData";
import generateErrorMessage from "../utils/generateErrorMessage";
import {
    getLocalStorageToken,
    getLocalStorageUserJSON,
} from "../utils/localStorageUtils";

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

    const [userFound, setUserFound] = useState(false);

    const usersService = useAPI("/api/users");
    const [modifiedData, initializeData] = useModifiedData("blogs");

    useEffect(() => {
        let ignoreRequest = false;
        const fetchData = async () => {
            dispatch(setLoadingState(true));
            usersService.setServiceToken(getLocalStorageToken());
            try {
                const fetchedUsers = await usersService.getAll();
                if (ignoreRequest) {
                    return;
                }
                dispatch(setUsers(fetchedUsers));
                const foundUser = fetchedUsers.filter(u => u.id === id)[0];
                if (foundUser) {
                    initializeData(foundUser.blogs);
                    dispatch(setUsersFetched(true));
                    setUserFound(true);
                }
            } catch (error) {
                dispatch(
                    displayNotification(generateErrorMessage(error), "error", 4)
                );
            }
            dispatch(setLoadingState(false));
        };

        !usersFetched ? fetchData() : initializeData(user.blogs);
        setUserFound(true);
        return () => {
            ignoreRequest = true;
        };
    }, []);

    useEffect(() => {
        if (userFound) {
            initializeData(user.blogs, true);
        }
    }, [id]);

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
            {getLocalStorageUserJSON().id === id && (
                <>
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
                </>
            )}
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
