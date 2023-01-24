import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

test("renders blog's title and author, but not its URL or number of likes by default.", async () => {
    const blog = {
        title: "TEST",
        author: "author",
        url: "www.blog.com",
        likes: 12,
        user: { username: "username" },
    };

    const { container } = render(
        <Blog
            likeBlog={() => {}}
            removeBlog={() => {}}
            blog={blog}
            showDeleteButton={false}
        />
    );

    const titleAuthor = container.querySelector(".blog-titleAuthor");
    const likes = container.querySelector(".blog-likes");
    const url = container.querySelector(".blog-url");

    expect(titleAuthor).toBeDefined();
    expect(titleAuthor).toHaveTextContent("TEST author ");
    screen.debug();
    expect(likes).toBe(null);
    expect(url).toBe(null);
});

test("should render blog's url and likes when the 'view' button is clicked", async () => {
    const blog = {
        title: "TEST",
        author: "author",
        url: "www.blog.com",
        likes: 12,
        user: { username: "username" },
    };

    const { container } = render(
        <Blog
            likeBlog={() => {}}
            removeBlog={() => {}}
            blog={blog}
            showDeleteButton={true}
        />
    );

    const user = userEvent.setup();

    const button = screen.getByText("view");
    await user.click(button);
    const likes = container.querySelector(".blog-likes");
    const url = container.querySelector(".blog-url");

    expect(likes).toBeDefined();
    expect(likes).toHaveTextContent("12");
    expect(url).toBeDefined();
    expect(url).toHaveTextContent("www.blog.com");
});

test("should call event handler for liking a post twice when clicked", async () => {
    const blog = {
        title: "TEST",
        author: "author",
        url: "www.blog.com",
        likes: 12,
        user: { username: "username" },
    };

    const mockHandler = jest.fn();
    render(
        <Blog
            likeBlog={mockHandler}
            removeBlog={() => {}}
            blog={blog}
            showDeleteButton={true}
        />
    );

    const user = userEvent.setup();

    const viewButton = screen.getByText("view");
    await user.click(viewButton);
    const likeButton = screen.getByText("likes");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
});
