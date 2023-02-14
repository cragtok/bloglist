import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import SortingForm from "./SortingForm";

import useSortedData from "../hooks/useSortedData";

const Home = ({ blogs }) => {
    const blogFormRef = useRef();

    const user = useSelector(state => state.user);

    const {
        sortCategory,
        sortMethod,
        setSortCategory,
        setSortMethod,
        sortedData,
        setSortedData,
    } = useSortedData([], "home");

    useEffect(() => {
        setSortedData([...blogs]);
    }, [blogs]);

    if (!user) {
        return null;
    }

    return (
        <div>
            <>
                <h2 className="title is-2 mt-5">Blog App</h2>
                <Togglable
                    title=""
                    ref={blogFormRef}
                    buttonLabel="Create New Post"
                    style={{
                        marginLeft: "1%",
                        marginRight: "1%",
                    }}
                >
                    <BlogForm
                        toggleVisibility={() => {
                            blogFormRef.current.toggleVisibility();
                        }}
                    />
                </Togglable>
                <br />
                <SortingForm
                    sortCategory={sortCategory}
                    setSortCategory={setSortCategory}
                    sortMethod={sortMethod}
                    setSortMethod={setSortMethod}
                    title="Sort Blogs"
                    sortFields={[
                        { name: "Title", value: "title" },
                        { name: "Author", value: "author" },
                        { name: "Date Created", value: "createdAt" },
                        { name: "Number of Likes", value: "likes" },
                        { name: "Number of Comments", value: "comments" },
                    ]}
                />
                <BlogList blogs={sortedData} sortedField={sortCategory} />
            </>
        </div>
    );
};

export default Home;
