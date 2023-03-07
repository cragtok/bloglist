import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    blogFiltersPresent,
    userFiltersPresent,
} from "../utils/filtersPresent";
import { filterBlogFields, filterUserFields } from "../utils/filterFields";
import { sortBlogFields, sortUserFields } from "../utils/sortFields";

import { resetPageState } from "../reducers/formReducer";

const useModifiedData = page => {
    const [modifiedData, setModifiedData] = useState([]);
    const [initialData, setInitialData] = useState([]);

    const dispatch = useDispatch();
    const formData = useSelector(state => state.form[page]);
    const loggedInUser = useSelector(state => state.user);
    const { sortCategory, sortMethod, filterCategories } = formData;

    const initializeData = (data, reset = false) => {
        setInitialData([...data]);
        if (reset) {
            dispatch(resetPageState({ page }));
        }
    };

    const filterCategoriesPresent = () =>
        page === "users"
            ? userFiltersPresent(filterCategories)
            : blogFiltersPresent(filterCategories);

    const sortFunction = (a, b) => {
        if (!sortCategory) return 0;
        return page === "users"
            ? sortUserFields(a, b, sortCategory, sortMethod)
            : sortBlogFields(a, b, sortCategory, sortMethod);
    };

    const filterFunction = data => {
        if (!filterCategoriesPresent(data)) {
            return true;
        }
        return page === "users"
            ? filterUserFields(data, filterCategories)
            : filterBlogFields(data, filterCategories, loggedInUser.id);
    };

    useEffect(() => {
        setModifiedData(initialData.filter(filterFunction).sort(sortFunction));
    }, [initialData, sortCategory, sortMethod, filterCategories]);

    return [modifiedData, initializeData];
};

export default useModifiedData;
