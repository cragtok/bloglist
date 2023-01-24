import usersReducer from "./usersReducer";
import deepFreeze from "deep-freeze";

const users = [
    {
        username: "user1",
        name: "user1",
        blogs: [
            {
                title: "THIS IS A NEW BLOG",
                author: "user",
                url: "www.eee.com",
                likes: 1,
                id: "63c8adcb42b624785148951d",
            },
            {
                title: "THIS IS A NEW BLOG",
                author: "user",
                url: "www.eee.com",
                likes: 1,
                id: "63c8adcb42b62478514835dd",
            },
        ],
        id: "63c1e08b2adfc3be470daee7",
    },
    {
        username: "user2",
        name: "user2",
        blogs: [
            {
                title: "qwdqwdd",
                author: "qwddqwd",
                url: "www.eee.com",
                likes: 0,
                id: "63c7be38285cdbd5bd9860f8",
            },
        ],
        id: "63c1e0922adfc3be470daeeb",
    },
    {
        username: "user3",
        name: "user3",
        blogs: [],
        id: "63c1e0982adfc3be470daeef",
    },
];

describe("usersReducer", () => {
    test("should set the list of users", () => {
        const initialState = [];
        deepFreeze(initialState);

        const action = {
            type: "users/setUsers",
            payload: users,
        };

        const nextState = usersReducer(initialState, action);

        nextState.forEach(user => {
            const initialUsers = users;
            const foundUser = initialUsers.find(
                initialUser => initialUser.id === user.id
            );
            expect(foundUser).not.toBe(undefined);
            expect(foundUser.username).toBe(user.username);
            expect(foundUser.name).toBe(user.name);
            expect(foundUser.blogs.length).toBe(user.blogs.length);
        });
    });
    test("should return new state upon creation of a new blog", () => {
        const initialState = [...users];
        deepFreeze(initialState);
        const newBlog = {
            title: "THIS IS A NEW BLOG",
            author: "user",
            url: "www.eee.com",
            likes: 1,
            id: "83c8adcb42b624785148b284",
            user: {
                name: initialState[2].name,
                username: initialState[2].username,
                id: initialState[2].id,
            },
        };

        const action = {
            type: "users/addUserBlog",
            payload: newBlog,
        };
        const nextState = usersReducer(initialState, action);

        const foundUser = nextState.find(user => user.id === newBlog.user.id);
        expect(foundUser.blogs.length).toBe(initialState[2].blogs.length + 1);
        const addedBlog = foundUser.blogs.find(blog => blog.id === newBlog.id);
        expect(addedBlog.title).toBe(newBlog.title);
        expect(addedBlog.user).toBe(undefined);
    });
    test("should return new state upon removal of a blog", () => {
        const initialState = [...users];
        deepFreeze(initialState);

        const userId = users[0].id;
        const blogId = users[0].blogs[0].id;
        const action = {
            type: "users/removeUserBlog",
            payload: { userId, blogId },
        };

        const nextState = usersReducer(initialState, action);

        const foundUser = nextState.find(user => user.id === userId);
        expect(foundUser.blogs.length).toBe(users[0].blogs.length - 1);
        const mappedBlogs = foundUser.blogs.map(blog => blog.id);
        expect(mappedBlogs).not.toContain(blogId);
    });
});
