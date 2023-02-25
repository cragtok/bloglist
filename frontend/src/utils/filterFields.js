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

export const filterBlogFields = (data, filterCategories, loggedInUserId) => {
    return (
        filterStringField(filterCategories.author, data.author) &&
        filterStringField(filterCategories.title, data.title) &&
        filterStringField(filterCategories.url, data.url) &&
        filterRangeField(
            {
                from: filterCategories.createdAt.from
                    ? new Date(filterCategories.createdAt.from)
                    : null,
                to: filterCategories.createdAt.to
                    ? new Date(filterCategories.createdAt.to)
                    : null,
            },
            new Date(data.createdAt)
        ) &&
        filterRangeField(filterCategories.numLikes, data.likes) &&
        filterRangeField(filterCategories.numComments, data.comments.length) &&
        filterBooleanField(
            filterCategories.likedBlogs,
            data.userLikes,
            likerId => likerId === loggedInUserId
        ) &&
        filterBooleanField(
            filterCategories.commentedBlogs,
            data.comments,
            comment => comment.user.id === loggedInUserId
        )
    );
};

export const filterUserFields = (data, filterCategories) => {
    return (
        filterStringField(filterCategories.username, data.username) &&
        filterRangeField(filterCategories.blogs, data.blogs.length) &&
        filterRangeField(
            filterCategories.totalBlogLikes,
            data.totalBlogLikes
        ) &&
        filterRangeField(
            filterCategories.totalBlogComments,
            data.totalBlogComments
        )
    );
};
