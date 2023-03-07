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

    const scrollToElementId = (elementId, scrollCondition) => {
        const element = document.getElementById(elementId);
        if (scrollCondition && element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (sortCategory && !sortingFormRef.current.visible) {
            sortingFormRef.current.setVisibility(true);
        }
        scrollToElementId(scrolledElementId, sortCategory);
    }, [sortCategory, sortMethod]);

    useEffect(() => {
        if (filterFormRef.current && !filterFormRef.current.visible) {
            filterFormRef.current.setVisibility(
                filterCategoriesPresent(filterCategories)
            );
        }

        scrollToElementId(
            scrolledElementId,
            filterCategoriesPresent(filterCategories)
        );
    }, [filterCategories]);
};

export default useFormListener;
