import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilterCategories } from "../reducers/formReducer";

const FilterForm = ({ page, formTitle, filterFields, initialFilters }) => {
    const { filterCategories } = useSelector(state => state.form[page]);
    const dispatch = useDispatch();

    if (!filterCategories) {
        return null;
    }
    const [formFilters, setFormFilters] = useState({ ...filterCategories });

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(setFilterCategories({ page, filterCategories: formFilters }));
    };

    const clearFilters = () => {
        dispatch(
            setFilterCategories({ page, filterCategories: initialFilters })
        );
        setFormFilters({ ...initialFilters });
    };

    const activeClass = value => (value ? "is-primary" : "is-dark");

    const renderTextInput = (fieldData, filterCategories) => {
        return (
            <div className="field" key={fieldData.name}>
                <label className="label">{fieldData.label}:</label>
                <input
                    value={filterCategories[fieldData.name]}
                    onChange={e =>
                        setFormFilters({
                            ...formFilters,
                            [fieldData.name]: e.target.value,
                        })
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

    const renderNumberInput = (fieldData, filterCategories) => {
        return (
            <div className="field" key={fieldData.name}>
                <label className="label">{fieldData.label}:</label>
                <input
                    value={filterCategories[fieldData.name]}
                    onChange={e =>
                        setFormFilters({
                            ...formFilters,
                            [fieldData.name]: e.target.value,
                        })
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

    const renderBooleanInput = (fieldData, filterCategories) => {
        return (
            <div className="field" key={fieldData.name}>
                <label
                    className="checkbox label is-normal"
                    style={{ width: "max-content" }}
                >
                    <input
                        onChange={e => {
                            setFormFilters({
                                ...formFilters,
                                [fieldData.name]: e.target.checked,
                            });
                        }}
                        name={fieldData.name}
                        type="checkbox"
                        checked={filterCategories[fieldData.name]}
                    />{" "}
                    {fieldData.label}
                </label>
            </div>
        );
    };

    const renderRangeInput = (fieldData, filterCategories) => {
        /* eslint-disable indent */
        return (
            <div key={fieldData.name}>
                <label className="label">{fieldData.label}:</label>
                <div className="field is-horizontal">
                    <div className="level field-body">
                        {[fieldData.ranges.from, fieldData.ranges.to].map(
                            rangeData => (
                                <React.Fragment key={crypto.randomUUID()}>
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
                                            onChange={e => {
                                                setFormFilters({
                                                    ...formFilters,
                                                    [fieldData.name]: {
                                                        ...filterCategories[
                                                            fieldData.name
                                                        ],
                                                        [rangeData.name]:
                                                            e.target.value,
                                                    },
                                                });
                                            }}
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
                                                        onClick={() => {
                                                            setFormFilters({
                                                                ...formFilters,
                                                                createdAt: {
                                                                    ...filterCategories[
                                                                        fieldData
                                                                            .name
                                                                    ],
                                                                    [rangeData.name]:
                                                                        "",
                                                                },
                                                            });
                                                        }}
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
                return renderTextInput(fieldData, formFilters);
            case "number":
                return renderNumberInput(fieldData, formFilters);
            case "boolean":
                return renderBooleanInput(fieldData, formFilters);
            case "range":
                return renderRangeInput(fieldData, formFilters);
            default:
                return null;
        }
    };

    return (
        <div className="mb-5">
            <div className="title is-5">Filter {formTitle}</div>
            <br />
            <form id="filterFormBody">
                {filterFields.map(renderFormElement)}
                <br />
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="button is-primary"
                >
                    Filter
                </button>{" "}
                <button type="button" onClick={clearFilters} className="button">
                    Clear Filters
                </button>
            </form>
            <br />
        </div>
    );
};

export default FilterForm;
