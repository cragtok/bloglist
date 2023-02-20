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
    //const user = useSelector(state => state.user);

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
        if (
            filterCategories.author &&
            !data.author.includes(filterCategories.author)
        ) {
            return false;
        }

        if (
            filterCategories.title &&
            !data.title.includes(filterCategories.title)
        ) {
            return false;
        }
        if (filterCategories.url && !data.url.includes(filterCategories.url)) {
            return false;
        }

        // Created At filtering
        let dataCreatedAtDate = new Date(data.createdAt);
        if (
            filterCategories.date.from &&
            !filterCategories.date.to &&
            dataCreatedAtDate < new Date(filterCategories.date.from)
        ) {
            return false;
        }

        if (
            filterCategories.date.to &&
            !filterCategories.date.from &&
            dataCreatedAtDate > new Date(filterCategories.date.to)
        ) {
            return false;
        }

        if (
            filterCategories.date.from &&
            filterCategories.date.to &&
            (dataCreatedAtDate < new Date(filterCategories.date.from) ||
                dataCreatedAtDate > new Date(filterCategories.date.to))
        ) {
            return false;
        }

        // Number of Comments Filtering
        if (
            filterCategories.numComments.from &&
            !filterCategories.numComments.to &&
            data.comments.length < filterCategories.numComments.from
        ) {
            return false;
        }

        if (
            filterCategories.numComments.to &&
            !filterCategories.numComments.from &&
            data.comments.length > filterCategories.numComments.to
        ) {
            return false;
        }

        if (
            filterCategories.numComments.from &&
            filterCategories.numComments.to &&
            (data.comments.length < filterCategories.numComments.from ||
                data.comments.length > filterCategories.numComments.to)
        ) {
            return false;
        }

        // Number of Likes Filtering
        if (
            filterCategories.numLikes.from &&
            !filterCategories.numLikes.to &&
            data.likes < filterCategories.numLikes.from
        ) {
            return false;
        }

        if (
            filterCategories.numLikes.to &&
            !filterCategories.numLikes.from &&
            data.likes > filterCategories.numLikes.to
        ) {
            return false;
        }

        if (
            filterCategories.numLikes.from &&
            filterCategories.numLikes.to &&
            (data.likes < filterCategories.numLikes.from ||
                data.likes > filterCategories.numLikes.to)
        ) {
            return false;
        }

        return true;
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
