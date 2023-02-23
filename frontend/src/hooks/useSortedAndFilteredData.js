import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormState, initialFilters } from "../reducers/formReducer";
import filterBlogFields from "../utils/filterBlogFields";

const useSortedAndFilteredData = page => {
    const [sortCategory, setSortCategory] = useState("");
    const [sortMethod, setSortMethod] = useState("descending");

    const [firstRender, setFirstRender] = useState(true);

    const [modifiedData, setModifiedData] = useState([]);
    const [initialData, setInitialData] = useState([]);

    const [filterCategories, setFilterCategories] = useState(null);

    const formData = useSelector(state => state.form[page]);
    const loggedInUser = useSelector(state => state.user);

    const dispatch = useDispatch();

    const filterCategoriesPresent = () => {
        return (
            filterCategories &&
            (filterCategories.author ||
                filterCategories.title ||
                filterCategories.url ||
                filterCategories.date.from ||
                filterCategories.date.to ||
                filterCategories.numComments.from ||
                filterCategories.numComments.to ||
                filterCategories.numLikes.from ||
                filterCategories.numLikes.to ||
                filterCategories.likedBlogs ||
                filterCategories.commentedBlogs)
        );
    };

    const resetSortState = () => {
        setSortCategory("");
        setSortMethod("descending");
    };

    const resetFilterState = () => {
        setFilterCategories(initialFilters);
    };

    const compareValues = (a, b) => {
        if (a === b) {
            return 0;
        }

        if (sortMethod === "ascending") {
            return a > b ? 1 : -1;
        }

        if (sortMethod === "descending") {
            return a > b ? -1 : 1;
        }
    };

    const sortBlogFields = (a, b) => {
        if (sortCategory === "title" || sortCategory === "author") {
            return compareValues(
                a[sortCategory].toLowerCase(),
                b[sortCategory].toLowerCase()
            );
        }

        if (sortCategory === "comments") {
            return compareValues(a.comments.length, b.comments.length);
        }
        return compareValues(a[sortCategory], b[sortCategory]);
    };

    const sortUserFields = (a, b) => {
        if (sortCategory === "username")
            return compareValues(
                a.username.toLowerCase(),
                b.username.toLowerCase()
            );
        if (sortCategory === "blogs")
            return compareValues(a.blogs.length, b.blogs.length);

        return compareValues(a[sortCategory], b[sortCategory]);
    };

    const sortFunction = (a, b) => {
        if (!sortCategory) return 0;
        return page === "users" ? sortUserFields(a, b) : sortBlogFields(a, b);
    };

    const filterUserFields = data => {
        data;
        return true;
    };

    const filterFunction = data => {
        if (!filterCategoriesPresent(data)) {
            return true;
        }
        return page === "users"
            ? filterUserFields(data)
            : filterBlogFields(data, filterCategories, loggedInUser.id);
    };

    useEffect(() => {
        setSortCategory(formData.sortCategory);
        setSortMethod(formData.sortMethod);
        setFilterCategories({ ...formData.filterCategories });
        setModifiedData(initialData.filter(filterFunction).sort(sortFunction));
        setFirstRender(false);
    }, []);

    useEffect(() => {
        if (!modifiedData.length) {
            setModifiedData([...initialData]);
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
        sortCategory,
        setSortCategory,
        sortMethod,
        setSortMethod,
        modifiedData,
        setModifiedData,
        resetSortState,
        resetFilterState,
        filterCategories,
        setFilterCategories,
        filterCategoriesPresent,
        setInitialData,
    };
};

export default useSortedAndFilteredData;
