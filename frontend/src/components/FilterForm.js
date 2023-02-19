import React from "react";

const FilterForm = ({
    formTitle,
    filterCategories,
    setFilterCategories,
    resetForm,
}) => {
    if (!filterCategories) {
        return null;
    }

    const {
        author,
        title,
        url,
        date,
        numComments,
        numLikes,
        likedBlogs,
        commentedBlogs,
    } = filterCategories;

    const updateFormFields = (field, value) => {
        setFilterCategories({ ...filterCategories, [field]: value });
    };

    return (
        <div className="mb-5">
            <div className="title is-5">Filter {formTitle}</div>
            <div className="field">
                <label className="label">Author:</label>
                <input
                    value={author}
                    onChange={e => updateFormFields("author", e.target.value)}
                    className="input is-info"
                    type="text"
                    name="author"
                />
            </div>
            <div className="field">
                <label className="label">Title:</label>
                <input
                    value={title}
                    onChange={e => updateFormFields("title", e.target.value)}
                    className="is-primary input"
                    type="text"
                    name="title"
                />
            </div>
            <div className="field">
                <label className="label">Url:</label>
                <input
                    value={url}
                    onChange={e => updateFormFields("url", e.target.value)}
                    className="is-primary input"
                    type="text"
                    name="url"
                />
            </div>
            <div>
                <label className="label">Date of Creation:</label>
                <div className="field is-horizontal">
                    <div className="level field-body">
                        <label className="label is-small mr-2">Min:</label>
                        <div className="field has-addons">
                            <input
                                value={date.from}
                                onChange={e =>
                                    updateFormFields("date", {
                                        ...date,
                                        from: e.target.value,
                                    })
                                }
                                className="is-primary input"
                                type="date"
                                name="date-from"
                            />
                            {date.from && (
                                <div className="control">
                                    <a
                                        onClick={() =>
                                            updateFormFields("date", {
                                                ...date,
                                                from: "",
                                            })
                                        }
                                        className="button is-primary"
                                    >
                                        Clear
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="field has-addons">
                            <input
                                value={date.to}
                                onChange={e =>
                                    updateFormFields("date", {
                                        ...date,
                                        to: e.target.value,
                                    })
                                }
                                className="is-primary input"
                                type="date"
                                name="date-to"
                            />
                            {date.to && (
                                <div className="control">
                                    <a
                                        onClick={() =>
                                            updateFormFields("date", {
                                                ...date,
                                                to: "",
                                            })
                                        }
                                        className="button is-primary"
                                    >
                                        Clear
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <br />
            </div>
            <div>
                <label className="label">Number of Likes:</label>
                <div className="field is-horizontal">
                    <div className="level field-body">
                        <label className="label is-small mr-2">Min:</label>
                        <div className="field">
                            <input
                                value={numLikes.from}
                                onChange={e =>
                                    updateFormFields("numLikes", {
                                        ...numLikes,
                                        from: e.target.value,
                                    })
                                }
                                className="is-primary input"
                                type="number"
                                min="0"
                                name="likes-from"
                            />
                        </div>
                        <label className="label is-small mr-2">Max:</label>
                        <div className="field">
                            <input
                                value={numLikes.to}
                                onChange={e =>
                                    updateFormFields("numLikes", {
                                        ...numLikes,
                                        to: e.target.value,
                                    })
                                }
                                className="is-primary input"
                                type="number"
                                min="0"
                                name="likes-to"
                            />
                        </div>
                    </div>
                </div>
                <br />
            </div>
            <div>
                <label className="label">Number of Comments:</label>
                <div className="field is-horizontal">
                    <div className="level field-body">
                        <label className="label is-small mr-2">Min:</label>
                        <div className="field">
                            <input
                                value={numComments.from}
                                onChange={e =>
                                    updateFormFields("numComments", {
                                        ...numComments,
                                        from: e.target.value,
                                    })
                                }
                                className="is-primary input"
                                min="0"
                                type="number"
                                name="comments-from"
                            />
                        </div>
                        <label className="label is-small mr-2">Max:</label>
                        <div className="field">
                            <input
                                value={numComments.to}
                                onChange={e =>
                                    updateFormFields("numComments", {
                                        ...numComments,
                                        to: e.target.value,
                                    })
                                }
                                className="is-primary input"
                                type="number"
                                min="0"
                                name="comments-to"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="field mt-3">
                <label className="checkbox label is-normal">
                    <input
                        onChange={e =>
                            updateFormFields("likedBlogs", e.target.checked)
                        }
                        name="blogs-liked"
                        type="checkbox"
                        checked={likedBlogs}
                    />{" "}
                    Liked Blogs
                </label>
            </div>
            <div className="field">
                <label className="checkbox label is-normal">
                    <input
                        onChange={e =>
                            updateFormFields("commentedBlogs", e.target.checked)
                        }
                        name="blogs-commented"
                        type="checkbox"
                        checked={commentedBlogs}
                    />{" "}
                    Commented Blogs
                </label>
            </div>
            <br />
            <button onClick={resetForm} className="button">
                Clear Filters
            </button>
        </div>
    );
};

export default FilterForm;
