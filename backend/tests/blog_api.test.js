const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");
const api = supertest(app);

const helper = require("./test_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

jest.setTimeout(20000);

// Note - run each describe() block separately

beforeEach(async () => {
    console.log("Deleting Users");
    await User.deleteMany({});
    console.log("Users deleted");
    const userIds = [];
    const userPromises = helper.initialUsers.map((user) =>
        api
            .post("/api/users")
            .send(user)
            .then((response) => {
                userIds.push(response.body.id);
            })
    );
    console.log("Adding users");
    await Promise.all(userPromises);
    console.log("Users added");

    const randomIntFromInterval = (min, max) => {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    console.log("Deleting blogs");
    await Blog.deleteMany({});
    console.log("Blogs deleted");
    const blogObjects = helper.initialBlogs.map(
        (blog) =>
            new Blog({
                ...blog,
                user: userIds[randomIntFromInterval(0, userIds.length - 1)],
            })
    );
    const blogPromises = blogObjects.map((blog) => blog.save());
    console.log("Adding blogs");
    await Promise.all(blogPromises);
    console.log("Blogs added");
});

describe("when there are some blogs saved in the database", () => {
    test("all blogs are returned as json", async () => {
        const response = await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body).toHaveLength(helper.initialBlogs.length);
    });

    test("each blog has a property named 'id'", async () => {
        const blogs = await helper.blogsInDb();
        blogs.forEach((blog) => {
            expect(blog.id).toBeDefined();
        });
    });
});

const getToken = async (blogUser) => {
    const tokenResponse = await api
        .post("/api/login")
        .send({ username: blogUser.username, password: blogUser.password })
        .expect(200)
        .expect("Content-Type", /application\/json/);
    return tokenResponse.body.token;
};

describe("addition of a new blog via a POST request to the /api/blogs endpoint", () => {
    test("successfully creates a new blog post with a HTTP 201 response", async () => {
        const blogUser = helper.initialUsers[0];
        const token = await getToken(blogUser);

        const newBlog = {
            title: "Type wars 2",
            author: blogUser.name,
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 22,
        };

        await api
            .post("/api/blogs")
            .send(newBlog)
            .set({ Authorization: `bearer ${token}` })
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const blogs = await helper.blogsInDb();
        const titles = blogs.map((b) => b.title);
        expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
        expect(titles).toContain("Type wars 2");
    });

    test("without a 'likes' property defaults it to 0", async () => {
        const blogUser = helper.initialUsers[1];
        const token = await getToken(blogUser);

        const newBlog = {
            title: "This Blog Has No Likes",
            author: blogUser.username,
            url: "http://www.blogs.com/this_blog_has_no_likes.html",
        };

        const response = await api
            .post("/api/blogs")
            .send(newBlog)
            .set({ Authorization: `bearer ${token}` })
            .expect(201)
            .expect("Content-Type", /application\/json/);

        expect(response.body.likes).toBe(0);
    });

    test("without a 'title' or 'url' properties results in an HTTP 400 response ", async () => {
        const blogUser = helper.initialUsers[2];
        const token = await getToken(blogUser);

        const badBlogs = [helper.initialBlogs[0], helper.initialBlogs[1], {}];
        delete badBlogs[0].url;
        delete badBlogs[1].title;

        const promiseArray = badBlogs.map((blog) =>
            api
                .post("/api/blogs")
                .send(blog)
                .set({ Authorization: `bearer ${token}` })
                .expect(400)
                .expect("Content-Type", /application\/json/)
        );
        await Promise.all(promiseArray);
    });
});

describe("deleting a blog via a DELETE request to the /api/blogs/:id endpoint", () => {
    test("succeeds with status code 204 when the id is valid", async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];

        const foundUser = await User.findById(blogToDelete.user);

        const blogUser = helper.initialUsers.find(
            (user) => user.username === foundUser.username
        );

        const token = await getToken(blogUser);

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set({ Authorization: `bearer ${token}` })
            .expect(204);

        const blogsAtEnd = await helper.blogsInDb();
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
        const blogIds = blogsAtEnd.map((r) => r.id);
        expect(blogIds).not.toContain(blogToDelete.id);
    });

    test("fails with status code 400 when the id is invalid", async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];

        const foundUser = await User.findById(blogToDelete.user);

        const blogUser = helper.initialUsers.find(
            (user) => user.username === foundUser.username
        );

        const token = await getToken(blogUser);

        await api
            .delete("/api/blogs/w1334rwovwj3cw3sfwffefsfsf")
            .set({ Authorization: `bearer ${token}` })
            .expect(400);
    });

    test("fails with status code 401 when a token is not provided", async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];
        await api.delete(`/api/blogs/${blogToDelete._id}`).expect(401);
    });
});

describe("updating a blog's likes via a PUT request to the /api/blogs/:id endpoint", () => {
    test("succeeds with status code 200 ", async () => {
        const initialBlogs = await helper.blogsInDb();
        const blogToUpdate = initialBlogs[3];
        blogToUpdate.likes += 1;

        const foundUser = await User.findById(blogToUpdate.user);
        const blogUser = helper.initialUsers.find(
            (user) => user.username === foundUser.username
        );
        const token = await getToken(blogUser);
        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set({ Authorization: `bearer ${token}` })
            .send(blogToUpdate)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        expect(response.body.likes).toBe(blogToUpdate.likes);

        const blogsAtEnd = await helper.blogsInDb();
        const updatedBlog = blogsAtEnd.find(
            (blog) => blog.id === blogToUpdate.id
        );

        expect(updatedBlog.likes).toBe(blogToUpdate.likes);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
