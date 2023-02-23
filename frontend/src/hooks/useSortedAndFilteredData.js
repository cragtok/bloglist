import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormState, initialFilters } from "../reducers/formReducer";

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

    const filterBlogFields = data => {
        const filterStringField = (stringField, string) =>
            stringField ? string.includes(stringField) : true;

        const filterRangeField = (rangeField, data) => {
            if (rangeField.from && !rangeField.to && data < rangeField.from) {
                return false;
            }

            if (rangeField.to && !rangeField.from && data > rangeField.to) {
                return false;
            }

            if (
                rangeField.from &&
                rangeField.to &&
                (data < rangeField.from || data > rangeField.to)
            ) {
                return false;
            }
            return true;
        };

        const filterBooleanField = (booleanField, array, condition) =>
            booleanField ? array.find(condition) : true;

        return (
            filterStringField(filterCategories.author, data.author) &&
            filterStringField(filterCategories.title, data.title) &&
            filterStringField(filterCategories.url, data.url) &&
            filterRangeField(
                {
                    from: filterCategories.date.from
                        ? new Date(filterCategories.date.from)
                        : null,
                    to: filterCategories.date.to
                        ? new Date(filterCategories.date.to)
                        : null,
                },
                new Date(data.createdAt)
            ) &&
            filterRangeField(filterCategories.numLikes, data.likes) &&
            filterRangeField(
                filterCategories.numComments,
                data.comments.length
            ) &&
            filterBooleanField(
                filterCategories.likedBlogs,
                data.userLikes,
                likerId => likerId === loggedInUser.id
            ) &&
            filterBooleanField(
                filterCategories.commentedBlogs,
                data.comments,
                comment => comment.user.id === loggedInUser.id
            )
        );
    };
    const filterFunction = data => {
        if (!filterCategoriesPresent(data)) {
            return true;
        }
        return page === "users"
            ? filterUserFields(data)
            : filterBlogFields(data);
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
