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
        if (sortCategory === "title")
            return compareValues(a.title.toLowerCase(), b.title.toLowerCase());
        if (sortCategory === "author")
            return compareValues(
                a.author.toLowerCase(),
                b.author.toLowerCase()
            );
        if (sortCategory === "createdAt")
            return compareValues(a.createdAt, b.createdAt);
        if (sortCategory === "likes") return compareValues(a.likes, b.likes);
        if (sortCategory === "comments")
            return compareValues(a.comments.length, b.comments.length);
    };
    const sortUserFields = (a, b) => {
        if (sortCategory === "username")
            return compareValues(
                a.username.toLowerCase(),
                b.username.toLowerCase()
            );
        if (sortCategory === "blogs")
            return compareValues(a.blogs.length, b.blogs.length);
        if (sortCategory === "totalLikes")
            return compareValues(a.totalBlogLikes, b.totalBlogLikes);

        if (sortCategory === "totalComments")
            return compareValues(a.totalBlogComments, b.totalBlogComments);
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
        const filterStringFields = data => {
            return (
                data.author.includes(filterCategories.author) &&
                data.title.includes(filterCategories.title) &&
                data.url.includes(filterCategories.url)
            );
        };
        return filterStringFields(data);
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
