import React from "react";

const FilterAndSortedFieldIndicator = ({
    filterStyle,
    filterText,
    sortedStyle,
    sortedText,
}) => {
    return (
        <div>
            <p>
                Filtered Field:{" "}
                <span className={filterStyle}>{filterText}</span>
            </p>
            <p>
                Sorted Field: <span className={sortedStyle}>{sortedText}</span>
            </p>
            <p>
                Filtered and Sorted Field:{" "}
                <span className={`${sortedStyle} ${filterStyle}`}>
                    {sortedText} and {filterText}
                </span>
            </p>
            <br />
        </div>
    );
};

export default FilterAndSortedFieldIndicator;
