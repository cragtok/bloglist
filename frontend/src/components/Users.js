import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import SortingForm from "./SortingForm";
import Togglable from "./Togglable";
import FilterForm from "./FilterForm";
import { userFilterFields } from "../utils/filterFieldData";
import { userSortFields } from "../utils/sortFieldData";

import useData from "../hooks/useData";
import useSortedAndFilteredData from "../hooks/useSortedAndFilteredData";

import { setLoadingState, setUsersFetched } from "../reducers/loadingReducer";
import { setUsers } from "../reducers/usersReducer";

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
    const { usersFetched } = useSelector(state => state.loading);
    const usersService = useData("/api/users");

    const {
        sortCategory,
        sortMethod,
        setSortCategory,
        setSortMethod,
        modifiedData,
        resetSortState,
        setInitialData,
        filterCategories,
        setFilterCategories,
        resetFilterState,
        filterCategoriesPresent,
    } = useSortedAndFilteredData("users");

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedInUser");
        const fn = async () => {
            dispatch(setLoadingState(true));
            const loggedInUser = JSON.parse(loggedUserJSON);
            usersService.setServiceToken(loggedInUser.token);
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
                            (acc, currValue) => acc + currValue.comments.length,
                            0
                        ),
                    };
                })
            );
            dispatch(setUsersFetched(true));
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

    if (!usersFetched) {
        return <p>Loading...</p>;
    }

    if (usersFetched && !users.length) {
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
                />
            </Togglable>
            <br />
            <table className="table is-striped is-bordered is-hoverable is-fullwidth mb-5">
                <thead>
                    <tr>
                        <th
                            className={`${
                                sortCategory === "username"
                                    ? "has-text-success"
                                    : ""
                            }`}
                        >
                            User
                        </th>
                        <th
                            className={`${
                                sortCategory === "blogs"
                                    ? "has-text-success"
                                    : ""
                            }`}
                        >
                            Blogs
                        </th>
                        <th
                            className={
                                sortCategory === "totalBlogLikes"
                                    ? "has-text-success"
                                    : ""
                            }
                        >
                            Total Blog Likes
                        </th>
                        <th
                            className={
                                sortCategory === "totalBlogComments"
                                    ? "has-text-success"
                                    : ""
                            }
                        >
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
