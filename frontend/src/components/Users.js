import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import SortingForm from "./SortingForm";
import Togglable from "./Togglable";
import FilterForm from "./FilterForm";
import { userFilterFields, initialUserFilters } from "../utils/filterFieldData";
import { userSortFields } from "../utils/sortFieldData";

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
        resetFilterState,
        resetSortState,
        setFilterCategories,
        setInitialData,
        setSortCategory,
        setSortMethod,
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
            setInitialData(users);
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

    const getStyledClass = field => {
        if (!filterCategories) {
            return "";
        }

        let className =
            sortCategory === field
                ? "has-text-weight-bold"
                : "has-text-weight-normal";

        if (
            (field === "username" && filterCategories[field]) ||
            (field !== "username" &&
                (filterCategories[field].from || filterCategories[field].to))
        ) {
            className += " has-text-primary";
        }
        return className;
    };

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
                    sortCategory={sortCategory}
                    setSortCategory={setSortCategory}
                    sortMethod={sortMethod}
                    setSortMethod={setSortMethod}
                    title="Sort Users"
                    resetForm={resetSortState}
                    sortFields={userSortFields}
                />
            </Togglable>
            <br />
            <Togglable title="" ref={filterFormRef} buttonLabel="Filter Users">
                <FilterForm
                    formTitle="Users"
                    filterCategories={filterCategories}
                    setFilterCategories={setFilterCategories}
                    resetForm={resetFilterState}
                    filterFields={userFilterFields}
                    initialFilters={initialUserFilters}
                />
            </Togglable>
            <br />
            <table className="table is-striped is-bordered is-hoverable is-fullwidth mb-5">
                <thead>
                    <tr>
                        <th className={getStyledClass("username")}>User</th>
                        <th className={getStyledClass("blogs")}>Blogs</th>
                        <th className={getStyledClass("totalBlogLikes")}>
                            Total Blog Likes
                        </th>
                        <th className={getStyledClass("totalBlogComments")}>
                            Total Blog Comments
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {modifiedData.map(user => (
                        <tr key={user.id}>
                            <td>
                                <Link to={`/users/${user.id}`}>
                                    {user.username}
                                </Link>{" "}
                            </td>
                            <td>{user.blogs.length}</td>
                            <td>{user.totalBlogLikes}</td>
                            <td>{user.totalBlogComments}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
