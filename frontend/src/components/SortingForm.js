import React from "react";

const SortingForm = ({
    sortCategory,
    setSortCategory,
    sortMethod,
    setSortMethod,
}) => {
    return (
        <div className="mb-5">
            <div className="title is-5">Sort Blogs </div>
            <div className="select is-primary mr-3">
                <select
                    e={sortCategory}
                    onChange={e => setSortCategory(e.target.value)}
                >
                    <option value="">None</option>
                    <option value="username">Username</option>
                    <option value="dateCreated">Date Created</option>
                    <option value="numberOfLikes">Number of Likes</option>
                    <option value="numberOfComments">Number of Comments</option>
                </select>
            </div>
            {sortCategory && (
                <div className="select is-dark">
                    <select
                        value={sortMethod}
                        onChange={e => setSortMethod(e.target.value)}
                    >
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export default SortingForm;
