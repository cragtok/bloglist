import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";
import SortingForm from "./SortingForm";

const Home = ({ blogs }) => {
    const blogFormRef = useRef();

    const user = useSelector(state => state.user);

    const [sortCategory, setSortCategory] = useState("");
    const [sortMethod, setSortMethod] = useState("ascending");

    if (!user) {
        return null;
    }

    const sortFunc = (a, b) => {
        const compareValues = (a, b) => {
            if (a === b) {
                return 0;
            }

            if (sortMethod === "ascending") {
                return a > b ? 1 : -1;
            }

            if (sortMethod === "descending") {
                return a > b ? -1 : 1;
            }
        };

        if (!sortCategory) return 0;
        if (sortCategory === "title")
            return compareValues(a.title.toLowerCase(), b.title.toLowerCase());
        if (sortCategory === "author")
            return compareValues(
                a.author.toLowerCase(),
                b.author.toLowerCase()
            );
        if (sortCategory === "dateCreated")
            return compareValues(a.createdAt, b.createdAt);
        if (sortCategory === "numberOfLikes")
            return compareValues(a.likes, b.likes);
        if (sortCategory === "numberOfComments")
            return compareValues(a.comments.length, b.comments.length);
    };

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
                />
                <BlogList blogs={[...blogs].sort(sortFunc)} />
            </>
        </div>
    );
};

export default Home;
