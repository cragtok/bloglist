import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import SortingForm from "../components/SortingForm";
import Togglable from "../components/Togglable";
import FilterForm from "../components/FilterForm";
import UsersTable from "../components/UsersTable";

import useAPI from "../hooks/useAPI";
import useModifiedData from "../hooks/useModifiedData";
import useFormListener from "../hooks/useFormListener";

import { setLoadingState, setUsersFetched } from "../reducers/loadingReducer";
import { setUsers } from "../reducers/usersReducer";
import { displayNotification } from "../reducers/notificationReducer";

import { userFilterFields, initialUserFilters } from "../utils/filterFieldData";
import { userSortFields } from "../utils/sortFieldData";
import generateErrorMessage from "../utils/generateErrorMessage";
import { getLocalStorageToken } from "../utils/localStorageUtils";

const Users = () => {
    const sortingFormRef = useRef();
    const filterFormRef = useRef();

    const dispatch = useDispatch();
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
    const { filterCategories, sortCategory, sortMethod } = useSelector(
        state => state.form["users"]
    );

    const usersService = useAPI("/api/users");
    const [modifiedData, initializeData] = useModifiedData("users");

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
                initializeData(
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

        !usersFetched ? fetchData() : initializeData(users);

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
        "userslist"
    );

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
