import blogsReducer from "./blogsReducer";
import deepFreeze from "deep-freeze";

const blogsArray = [
    {
        author: "user1",
        id: "1",
        likes: 0,
        title: "Blog Post1",
        url: "www.blogs.com",
        user: {
            id: "a",
            name: "user1",
            username: "user1",
        },
        comments: [],
        userLikes: [],
    },
    {
        author: "user2",
        id: "2",
        likes: 0,
        title: "Blog Post2",
        url: "www.blogs.com",
        user: {
            id: "b",
            name: "user2",
            username: "user2",
        },
        comments: [],
        userLikes: [],
    },
];

describe("blogsReducer", () => {
    test("should return new state upon creation of a new blog", () => {
        const initialState = [...blogsArray];
        deepFreeze(initialState);

        const action = {
            type: "blogs/addBlog",
            payload: {
                author: "user1",
                id: "3",
                likes: 0,
                title: "ADDED BY REDUCER - user1",
                url: "www.blogs.com",
                user: {
                    ...initialState[0]["user"],
                },
                comments: [],
            },
        };
        const newState = blogsReducer(initialState, action);
        expect(newState).toHaveLength(initialState.length + 1);
        expect(newState.map(s => s.title)).toContainEqual(action.payload.title);
    });
    test("should return new state upon deletion of a new blog", () => {
        const initialState = [...blogsArray];
        deepFreeze(initialState);
        const action = {
            type: "blogs/removeBlog",
            payload: "2",
        };
        const newState = blogsReducer(initialState, action);
        expect(newState).toHaveLength(initialState.length - 1);
        expect(newState.map(s => s.id)).not.toContainEqual(action.payload.id);
    });

    test("should return new state upon adding a new comment to a blog", () => {
        const initialState = [...blogsArray];
        deepFreeze(initialState);
        const blog = {
            ...blogsArray[0],
            user: { ...blogsArray[0].user },
            comments: [...blogsArray[0].comments],
        };
        const action = {
            type: "blogs/addComment",
            payload: { comment: "Comment", blogId: blog.id },
        };
        const newState = blogsReducer(initialState, action);

        const commentedBlog = newState.find(b => b.id === blog.id);

        expect(commentedBlog.comments.length).toBe(blog.comments.length + 1);

        expect(commentedBlog.comments).toContainEqual("Comment");
    });
});
