import React from "react";
import { Link } from "react-router-dom";

const UsersTable = ({ users, filterCategories, sortCategory }) => {
    const getStyledClass = field => {
        if (!filterCategories) {
            return "";
        }

        let className =
            sortCategory === field
                ? "has-text-weight-bold"
                : "has-text-weight-normal";

        if (
            (field === "username" && filterCategories[field]) ||
            (field !== "username" &&
                (filterCategories[field].from || filterCategories[field].to))
        ) {
            className += " has-text-primary";
        }
        return className;
    };

    return (
        <div>
            <table
                id="userslist"
                className="table is-striped is-bordered is-hoverable is-fullwidth mb-5"
            >
                <thead>
                    <tr>
                        <th className={getStyledClass("username")}>User</th>
                        <th className={getStyledClass("blogs")}>Blogs</th>
                        <th className={getStyledClass("totalBlogLikes")}>
                            Total Blog Likes
                        </th>
                        <th className={getStyledClass("totalBlogComments")}>
                            Total Blog Comments
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                <Link to={`/users/${user.id}`}>
                                    {user.username}
                                </Link>{" "}
                            </td>
                            <td>{user.blogs.length}</td>
                            <td>{user.totalBlogLikes}</td>
                            <td>{user.totalBlogComments}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
