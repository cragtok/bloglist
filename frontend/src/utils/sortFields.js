const compareValues = (a, b, sortMethod) => {
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

export const sortBlogFields = (a, b, sortCategory, sortMethod) => {
    if (sortCategory === "title" || sortCategory === "author") {
        return compareValues(
            a[sortCategory].toLowerCase(),
            b[sortCategory].toLowerCase(),
            sortMethod
        );
    }

    if (sortCategory === "comments") {
        return compareValues(a.comments.length, b.comments.length, sortMethod);
    }
    return compareValues(a[sortCategory], b[sortCategory], sortMethod);
};

export const sortUserFields = (a, b, sortCategory, sortMethod) => {
    if (sortCategory === "username")
        return compareValues(
            a.username.toLowerCase(),
            b.username.toLowerCase(),
            sortMethod
        );
    if (sortCategory === "blogs")
        return compareValues(a.blogs.length, b.blogs.length, sortMethod);

    return compareValues(a[sortCategory], b[sortCategory], sortMethod);
};
