const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const User = require("../models/user");
const api = supertest(app);

jest.setTimeout(20000);

beforeEach(async () => {
    console.log("Deleting users");
    await User.deleteMany({});
    console.log("Users deleted");
});

describe("creating a user via POST request to /api/users", () => {
    test("succeeds with status code 201 and results in a new user when a valid request body is received", async () => {
        const newUser = {
            username: "USERNAME",
            name: "USER",
            password: "123456",
        };

        const response = await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        expect(response.body.username).toBe("USERNAME");
        expect(response.body.name).toBe("USER");

        const usersAtEnd = await helper.usersInDb();
        const userIds = usersAtEnd.map((user) => user.id);
        expect(userIds).toContain(response.body.id);
    });
    test("fails with status code 400 when the password or username are omitted", async () => {
        const newUser1 = {
            name: "BADUSER1",
            password: "123456",
        };
        const newUser2 = {
            username: "BADUSERNAME2",
            name: "BADUSER2",
        };

        await api
            .post("/api/users")
            .send(newUser1)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        await api
            .post("/api/users")
            .send(newUser2)
            .expect(400)
            .expect("Content-Type", /application\/json/);
    });
    test("fails with status code 400 when the password or username are less then 3 characters", async () => {
        const newUser1 = {
            name: "BADUSER1",
            password: "12",
            username: "BBBB",
        };
        const newUser2 = {
            username: "BA",
            name: "BADUSER2",
            password: "123456",
        };

        await api
            .post("/api/users")
            .send(newUser1)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        await api
            .post("/api/users")
            .send(newUser2)
            .expect(400)
            .expect("Content-Type", /application\/json/);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
