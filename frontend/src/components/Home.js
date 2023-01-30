import React, { useRef } from "react";
import { useSelector } from "react-redux";

import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import Togglable from "./Togglable";

const Home = ({ blogs }) => {
    const blogFormRef = useRef();

    const user = useSelector(state => state.user);
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
                <BlogList blogs={blogs} />
            </>
        </div>
    );
};

export default Home;
