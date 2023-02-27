import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BlogList from "./BlogList";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import SortingForm from "./SortingForm";
import FilterForm from "./FilterForm";
import { blogFilterFields } from "../utils/filterFieldData";
import { blogSortFields } from "../utils/sortFieldData";

import useData from "../hooks/useData";
import { setUsers } from "../reducers/usersReducer";
import { setLoadingState, setUsersFetched } from "../reducers/loadingReducer";
import useSortedAndFilteredData from "../hooks/useSortedAndFilteredData";
import { displayNotification } from "../reducers/notificationReducer";

const User = () => {
    const id = useParams().id;

    const blogFormRef = useRef();
    const sortingFormRef = useRef();
    const filterFormRef = useRef();

    const dispatch = useDispatch();

    const usersService = useData("/api/users");

    const { isLoading, usersFetched } = useSelector(state => state.loading);

    const user = useSelector(state => state.users.filter(u => u.id === id)[0]);

    const {
        sortCategory,
        sortMethod,
        setSortCategory,
        setSortMethod,
        modifiedData,
        resetFilterState,
        resetSortState,
        filterCategories,
        setFilterCategories,
        filterCategoriesPresent,
        setInitialData,
    } = useSortedAndFilteredData("blogs");

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedInUser");
        const fn = async () => {
            dispatch(setLoadingState(true));
            const loggedInUser = JSON.parse(loggedUserJSON);
            usersService.setServiceToken(loggedInUser.token);
            try {
                const fetchedUsers = await usersService.getAll();
                dispatch(setUsers(fetchedUsers));
                const foundUser = fetchedUsers.filter(u => u.id === id)[0];
                if (foundUser) {
                    setInitialData(foundUser.blogs);
                }
                dispatch(setUsersFetched(true));
            } catch (error) {
                let errorMsg;
                if (error.name === "CanceledError") {
                    errorMsg = "Request Timed Out";
                } else if (error.response.data.error) {
                    errorMsg = error.response.data.error;
                } else {
                    errorMsg = "Error: Something Went Wrong!";
                }
                dispatch(displayNotification(errorMsg, "error", 4));
            }
            dispatch(setLoadingState(false));
        };

        if (loggedUserJSON && !usersFetched) {
            fn();
        } else {
            setInitialData(user.blogs);
        }
    }, []);

    useEffect(() => {
        if (filterFormRef.current && !filterFormRef.current.visible) {
            filterFormRef.current.setVisibility(filterCategoriesPresent());
        }
    }, [filterCategories]);

    useEffect(() => {
        if (sortCategory && !sortingFormRef.current.visible) {
            sortingFormRef.current.setVisibility(true);
        }
    }, [sortCategory]);

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
            <Togglable title="" ref={sortingFormRef} buttonLabel="Sort Blogs">
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
            <Togglable title="" ref={filterFormRef} buttonLabel="Filter Blogs">
                <FilterForm
                    formTitle="Blogs"
                    filterCategories={filterCategories}
                    setFilterCategories={setFilterCategories}
                    resetForm={resetFilterState}
                    filterFields={blogFilterFields}
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
