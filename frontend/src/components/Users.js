import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import SortingForm from "./SortingForm";
import Togglable from "./Togglable";
import FilterForm from "./FilterForm";
import UsersTable from "./UsersTable";

import { userFilterFields, initialUserFilters } from "../utils/filterFieldData";
import { userSortFields } from "../utils/sortFieldData";
import generateErrorMessage from "../utils/generateErrorMessage";

import useAPI from "../hooks/useAPI";
import useModifiedData from "../hooks/useModifiedData";

import { setLoadingState, setUsersFetched } from "../reducers/loadingReducer";
import { setUsers } from "../reducers/usersReducer";
import { displayNotification } from "../reducers/notificationReducer";

const Users = () => {
    const dispatch = useDispatch();
    const sortingFormRef = useRef();
    const filterFormRef = useRef();

    const users = useSelector(state => {
        return state.users.map(user => {
            return {
                ...user,
                totalBlogLikes: user.blogs.reduce(
                    (acc, currValue) => acc + currValue.likes,
                    0
                ),
                totalBlogComments: user.blogs.reduce(
                    (acc, currValue) => acc + currValue.comments.length,
                    0
                ),
            };
        });
    });
    const { isLoading, usersFetched } = useSelector(state => state.loading);
    const usersService = useAPI("/api/users");

    const {
        filterCategories,
        filterCategoriesPresent,
        modifiedData,
        setInitialData,
        sortCategory,
        sortMethod,
    } = useModifiedData("users");

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedInUser");
        const fn = async () => {
            dispatch(setLoadingState(true));
            const loggedInUser = JSON.parse(loggedUserJSON);
            usersService.setServiceToken(loggedInUser.token);

            try {
                const fetchedUsers = await usersService.getAll();
                dispatch(setUsers(fetchedUsers));
                setInitialData(
                    fetchedUsers.map(user => {
                        return {
                            ...user,
                            totalBlogLikes: user.blogs.reduce(
                                (acc, currValue) => acc + currValue.likes,
                                0
                            ),
                            totalBlogComments: user.blogs.reduce(
                                (acc, currValue) =>
                                    acc + currValue.comments.length,
                                0
                            ),
                        };
                    })
                );
                dispatch(setUsersFetched(true));
            } catch (error) {
                dispatch(
                    displayNotification(generateErrorMessage(error), "error", 4)
                );
            }

            dispatch(setLoadingState(false));
        };
        if (loggedUserJSON && !usersFetched) {
            fn();
        } else {
            setInitialData(users);
        }
    }, []);

    useEffect(() => {
        if (sortCategory && !sortingFormRef.current.visible) {
            sortingFormRef.current.setVisibility(true);
        }

        const element = document.getElementById("userslist");
        if (sortCategory && element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }, [sortCategory, sortMethod]);

    useEffect(() => {
        if (filterFormRef.current && !filterFormRef.current.visible) {
            filterFormRef.current.setVisibility(filterCategoriesPresent());
        }

        const element = document.getElementById("userslist");
        if (filterCategoriesPresent() && element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }, [filterCategories]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!isLoading && (!usersFetched || !users.length)) {
        return <p>No Users</p>;
    }

    return (
        <div>
            <h2 className="title is-2 mt-5">Users</h2>
            <br />
            <Togglable title="" ref={sortingFormRef} buttonLabel="Sort Users">
                <SortingForm
                    page="users"
                    title="Sort Users"
                    sortFields={userSortFields}
                />
            </Togglable>
            <br />
            <Togglable title="" ref={filterFormRef} buttonLabel="Filter Users">
                <FilterForm
                    formTitle="Users"
                    page="users"
                    filterFields={userFilterFields}
                    initialFilters={initialUserFilters}
                />
            </Togglable>
            <br />
            <UsersTable
                users={modifiedData}
                filterCategories={filterCategories}
                sortCategory={sortCategory}
            />
        </div>
    );
};

export default Users;
