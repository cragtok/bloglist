import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> updates parent state and calls onSubmit", async () => {
    const createBlog = jest.fn();
    const user = userEvent.setup();

    render(<BlogForm createBlog={createBlog} />);

    const titleInput = screen.getByPlaceholderText("blog title...");
    const authorInput = screen.getByPlaceholderText("blog author...");
    const urlInput = screen.getByPlaceholderText("blog url...");
    const sendButton = screen.getByText("Create");

    await user.type(titleInput, "title");
    await user.type(authorInput, "author");
    await user.type(urlInput, "url");
    await user.click(sendButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe("title");
    expect(createBlog.mock.calls[0][0].author).toBe("author");
    expect(createBlog.mock.calls[0][0].url).toBe("url");
});
