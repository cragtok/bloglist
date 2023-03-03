import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSortCategory, setSortMethod } from "../reducers/formReducer";
const SortingForm = ({ page, sortFields, title }) => {
    const { sortCategory, sortMethod } = useSelector(state => state.form[page]);
    const dispatch = useDispatch();

    return (
        <div className="mb-5">
            <div className="title is-5">{title}</div>
            <div className="select is-primary mr-3">
                <select
                    value={sortCategory}
                    onChange={e =>
                        dispatch(
                            setSortCategory({
                                page,
                                sortCategory: e.target.value,
                            })
                        )
                    }
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
                            onChange={e =>
                                dispatch(
                                    setSortMethod({
                                        page,
                                        sortMethod: e.target.value,
                                    })
                                )
                            }
                        >
                            <option value="ascending">Ascending</option>
                            <option value="descending">Descending</option>
                        </select>
                    </div>
                    <button
                        onClick={() => {
                            dispatch(
                                setSortCategory({
                                    page,
                                    sortCategory: "",
                                })
                            );
                            dispatch(
                                setSortMethod({
                                    page,
                                    sortMethod: "descending",
                                })
                            );
                        }}
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
