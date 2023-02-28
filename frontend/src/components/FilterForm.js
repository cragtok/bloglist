import React from "react";

const FilterForm = ({
    formTitle,
    filterCategories,
    setFilterCategories,
    resetForm,
    filterFields,
}) => {
    if (!filterCategories) {
        return null;
    }

    const updateFormFields = (field, value) => {
        setFilterCategories({ ...filterCategories, [field]: value });
    };

    const activeClass = value => (value ? "is-primary" : "is-dark");

    const renderTextInput = fieldData => {
        return (
            <div className="field" key={fieldData.name}>
                <label className="label">{fieldData.label}:</label>
                <input
                    value={filterCategories[fieldData.name]}
                    onChange={e =>
                        updateFormFields(fieldData.name, e.target.value)
                    }
                    className={`input ${activeClass(
                        filterCategories[fieldData.name]
                    )}`}
                    type={fieldData.type}
                    name={fieldData.name}
                />
            </div>
        );
    };

    const renderNumberInput = fieldData => {
        return (
            <div className="field" key={fieldData.name}>
                <label className="label">{fieldData.label}:</label>
                <input
                    value={filterCategories[fieldData.name]}
                    onChange={e =>
                        updateFormFields(fieldData.name, e.target.value)
                    }
                    className={`input ${activeClass(
                        filterCategories[fieldData.name]
                    )}`}
                    type={fieldData.type}
                    name={fieldData.name}
                    min={fieldData.min}
                />
            </div>
        );
    };

    const renderBooleanInput = fieldData => {
        return (
            <div className="field" key={fieldData.name}>
                <label
                    className="checkbox label is-normal"
                    style={{ width: "max-content" }}
                >
                    <input
                        onChange={e =>
                            updateFormFields(fieldData.name, e.target.checked)
                        }
                        name={fieldData.name}
                        type="checkbox"
                        checked={filterCategories[fieldData.name]}
                    />{" "}
                    {fieldData.label}
                </label>
            </div>
        );
    };

    const renderRangeInput = fieldData => {
        /* eslint-disable indent */
        return (
            <div key={fieldData.name}>
                <label className="label">{fieldData.label}:</label>
                <div className="field is-horizontal">
                    <div className="level field-body">
                        {[fieldData.ranges.from, fieldData.ranges.to].map(
                            (rangeData, idx) => (
                                <React.Fragment key={idx}>
                                    <label className="label is-small mr-2">
                                        {rangeData.label}:
                                    </label>
                                    <div
                                        className={`field ${
                                            fieldData.rangeType === "date"
                                                ? "has-addons"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            value={
                                                filterCategories[
                                                    fieldData.name
                                                ][rangeData.name] || ""
                                            }
                                            onChange={e =>
                                                updateFormFields(
                                                    fieldData.name,
                                                    {
                                                        ...filterCategories[
                                                            fieldData.name
                                                        ],
                                                        [rangeData.name]:
                                                            e.target.value,
                                                    }
                                                )
                                            }
                                            className={`input ${activeClass(
                                                filterCategories[
                                                    fieldData.name
                                                ][rangeData.name]
                                            )}`}
                                            type={fieldData.rangeType}
                                            min={
                                                fieldData.rangeType === "date"
                                                    ? ""
                                                    : rangeData.min
                                            }
                                            name={`${fieldData.name}-${rangeData.name}`}
                                        />
                                        {fieldData.rangeType === "date" &&
                                            filterCategories[fieldData.name][
                                                rangeData.name
                                            ] && (
                                                <div className="control">
                                                    <a
                                                        onClick={() =>
                                                            updateFormFields(
                                                                "createdAt",
                                                                {
                                                                    ...filterCategories[
                                                                        fieldData
                                                                            .name
                                                                    ],
                                                                    [rangeData.name]:
                                                                        "",
                                                                }
                                                            )
                                                        }
                                                        className="button is-primary"
                                                    >
                                                        Clear
                                                    </a>
                                                </div>
                                            )}
                                    </div>
                                </React.Fragment>
                            )
                        )}
                    </div>
                </div>
                <br />
            </div>
        );
    };

    const renderFormElement = fieldData => {
        /* eslint-disable indent */
        switch (fieldData.type) {
            case "text":
                return renderTextInput(fieldData);
            case "number":
                return renderNumberInput(fieldData);
            case "boolean":
                return renderBooleanInput(fieldData);
            case "range":
                return renderRangeInput(fieldData);
            default:
                return null;
        }
    };

    return (
        <div className="mb-5">
            <div className="title is-5">Filter {formTitle}</div>
            <br />
            <div id="filterFormBody">{filterFields.map(renderFormElement)}</div>
            <br />
            <button onClick={resetForm} className="button">
                Clear Filters
            </button>
        </div>
    );
};

export default FilterForm;
