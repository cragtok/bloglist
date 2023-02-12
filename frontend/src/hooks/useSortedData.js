import { useState, useEffect } from "react";

const useSortedData = (initialData = []) => {
    const [sortCategory, setSortCategory] = useState("");
    const [sortMethod, setSortMethod] = useState("descending");
    const [sortedData, setSortedData] = useState([...initialData]);

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

    const sortFunction = (a, b) => {
        if (!sortCategory) return 0;

        // Sorting Blogs
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
        // Sorting Users
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

    useEffect(() => {
        setSortedData([...sortedData].sort(sortFunction));
    }, [sortCategory, sortMethod]);

    return {
        sortCategory,
        setSortCategory,
        sortMethod,
        setSortMethod,
        sortedData,
        setSortedData,
    };
};

export default useSortedData;
