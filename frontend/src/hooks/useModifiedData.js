import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setFormState,
    setFilterCategories,
    setSortCategory,
    setSortMethod,
} from "../reducers/formReducer";

import {
    blogFiltersPresent,
    userFiltersPresent,
} from "../utils/filtersPresent";

import { filterBlogFields, filterUserFields } from "../utils/filterFields";
import { sortBlogFields, sortUserFields } from "../utils/sortFields";

const useModifiedData = page => {
    const [firstRender, setFirstRender] = useState(true);

    const [modifiedData, setModifiedData] = useState([]);
    const [initialData, setInitialData] = useState([]);

    const formData = useSelector(state => state.form[page]);
    const loggedInUser = useSelector(state => state.user);
    const { sortCategory, sortMethod, filterCategories } = formData;

    const dispatch = useDispatch();

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
        dispatch(setSortCategory(formData.sortCategory));
        dispatch(setSortMethod(formData.sortMethod));
        dispatch(setFilterCategories({ ...formData.filterCategories }));
        setModifiedData(initialData.filter(filterFunction).sort(sortFunction));
        setFirstRender(false);
    }, []);

    useEffect(() => {
        if (!modifiedData.length) {
            setModifiedData(
                [...initialData].filter(filterFunction).sort(sortFunction)
            );
        }
    }, [initialData]);

    useEffect(() => {
        if (!firstRender) {
            setModifiedData(
                initialData.filter(filterFunction).sort(sortFunction)
            );
            dispatch(
                setFormState({
                    page,
                    formState: {
                        filterCategories,
                        sortCategory,
                        sortMethod,
                    },
                })
            );
        }
    }, [sortCategory, sortMethod, filterCategories]);

    return {
        modifiedData,
        setInitialData,
    };
};

export default useModifiedData;
