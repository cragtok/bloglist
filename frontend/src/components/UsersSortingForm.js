import React from "react";

const UsersSortingForm = ({
    sortCategory,
    setSortCategory,
    sortMethod,
    setSortMethod,
}) => {
    return (
        <div className="mb-5">
            <div className="title is-5">Sort Users </div>
            <div className="select is-primary mr-3">
                <select
                    value={sortCategory}
                    onChange={e => setSortCategory(e.target.value)}
                >
                    <option value="">None</option>
                    <option value="username">Username</option>
                    <option value="blogs">Number of Blogs</option>
                    <option value="totalLikes">Total Blog Likes</option>
                    <option value="totalComments">Total Blog Comments</option>
                </select>
            </div>
            {sortCategory && (
                <>
                    <div className="select is-secondary mr-3">
                        <select
                            value={sortMethod}
                            onChange={e => setSortMethod(e.target.value)}
                        >
                            <option value="ascending">Ascending</option>
                            <option value="descending">Descending</option>
                        </select>
                    </div>
                    <button
                        onClick={() => setSortCategory("")}
                        className="button"
                    >
                        Clear
                    </button>
                </>
            )}
        </div>
    );
};

export default UsersSortingForm;
