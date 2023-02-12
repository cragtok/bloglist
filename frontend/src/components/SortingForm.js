import React from "react";

const SortingForm = ({
    sortCategory,
    setSortCategory,
    sortMethod,
    setSortMethod,
    sortFields,
    title,
}) => {
    return (
        <div className="mb-5">
            <div className="title is-5">{title}</div>
            <div className="select is-primary mr-3">
                <select
                    value={sortCategory}
                    onChange={e => setSortCategory(e.target.value)}
                >
                    <option key="none" value="">
                        None
                    </option>
                    {sortFields.map(sortField => (
                        <option
                            key={crypto.randomUUID()}
                            value={sortField.value}
                        >
                            {sortField.name}
                        </option>
                    ))}
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

export default SortingForm;
