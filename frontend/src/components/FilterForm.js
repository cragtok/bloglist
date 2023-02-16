import React from "react";

const FilterForm = ({ title }) => {
    return (
        <div className="mb-5">
            <div className="title is-5">Filter {title}</div>
            <div className="field">
                <label className="label">Author:</label>
                <input className="input is-info" type="text" name="author" />
            </div>
            <div className="field">
                <label className="label">Title:</label>
                <input className="is-primary input" type="text" name="title" />
            </div>
            <div className="field">
                <label className="label">Url:</label>
                <input className="is-primary input" type="text" name="url" />
            </div>
            <div>
                <label className="label">Number of Likes:</label>
                <div className="field is-horizontal">
                    <div className="level field-body">
                        <label className="label is-small mr-2">Min:</label>
                        <div className="field">
                            <input
                                className="is-primary input"
                                type="number"
                                name="likes-from"
                            />
                        </div>
                        <label className="label is-small mr-2">Max:</label>
                        <div className="field">
                            <input
                                className="is-primary input"
                                type="number"
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
                                className="is-primary input"
                                type="number"
                                name="comments-from"
                            />
                        </div>
                        <label className="label is-small mr-2">Max:</label>
                        <div className="field">
                            <input
                                className="is-primary input"
                                type="number"
                                name="comments-to"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterForm;
