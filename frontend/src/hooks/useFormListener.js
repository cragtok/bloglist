import { useEffect } from "react";

import {
    userFiltersPresent,
    blogFiltersPresent,
} from "../utils/filtersPresent";

const useFormListener = (
    sortCategory,
    sortMethod,
    filterCategories,
    filterFormRef,
    sortingFormRef,
    scrolledElementId
) => {
    const filterCategoriesPresent =
        scrolledElementId === "userslist"
            ? userFiltersPresent
            : blogFiltersPresent;

    useEffect(() => {
        if (sortCategory && !sortingFormRef.current.visible) {
            sortingFormRef.current.setVisibility(true);
        }

        const element = document.getElementById(scrolledElementId);
        if (sortCategory && element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }, [sortCategory, sortMethod]);

    useEffect(() => {
        if (filterFormRef.current && !filterFormRef.current.visible) {
            filterFormRef.current.setVisibility(
                filterCategoriesPresent(filterCategories)
            );
        }

        const element = document.getElementById(scrolledElementId);
        if (filterCategoriesPresent(filterCategories) && element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }, [filterCategories]);
};

export default useFormListener;
