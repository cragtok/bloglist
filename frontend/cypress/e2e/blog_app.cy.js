describe("Blog app", function () {
    beforeEach(function () {
        cy.request("POST", "http://localhost:3003/api/testing/reset");
        cy.createUser({
            username: "testuser1",
            name: "testuser",
            password: "123456",
        });

        cy.visit("http://localhost:3000");
    });

    it("Login form is shown", function () {
        cy.contains("Log in to application");
        cy.contains("Username");
        cy.contains("Password");
        cy.contains("Login");
    });

    describe("Login", function () {
        it("succeeds with correct credentials", function () {
            cy.get("#login-username").type("testuser1");
            cy.get("#login-password").type("123456");
            cy.get("#login-button").click();
            cy.contains("testuser logged in");
        });

        it("fails with wrong credentials", function () {
            cy.get("#login-username").type("wrongusername");
            cy.get("#login-password").type("wrongpassword");
            cy.get("#login-button").click();
            cy.get(".notification-error")
                .should("contain", "Invalid username or password")
                .and("have.css", "color", "rgb(255, 0, 0)");
        });
    });

    describe("When logged in", function () {
        beforeEach(function () {
            cy.createUser({
                username: "testuser2",
                name: "testuser2",
                password: "123456",
            });

            cy.login({ username: "testuser1", password: "123456" });
            cy.createBlog({
                title: "hello world",
                author: "testuser1",
                url: "www.blog.com",
            });
            cy.visit("http://localhost:3000");
        });

        it("A blog can be created", function () {
            cy.get("#toggleable-show").click();
            cy.get("#blog-title").type("NEW BLOG");
            cy.get("#blog-author").type("testuser");
            cy.get("#blog-url").type("www.blogs.com");
            cy.get("#blog-create").click();
            cy.contains("NEW BLOG testuser ");
            cy.get(".notification-success")
                .should("contain", "a new blog post NEW BLOG by testuser added")
                .and("have.css", "color", "rgb(0, 128, 0)");
        });

        it("A blog can be liked", function () {
            cy.contains("view").click();
            cy.contains("like").click();
            cy.contains("Likes 1 ");
            cy.get(".notification-success")
                .should("have.css", "color", "rgb(0, 128, 0)")
                .and("contain", "Blog post hello world liked");
        });

        it("A user can delete one of his own blogs", function () {
            cy.contains("view").click();
            cy.contains("Delete").click();
            cy.get(".notification-success")
                .should("contain", "Blog post deleted")
                .and("have.css", "color", "rgb(0, 128, 0)");
            cy.get("html").should("not.contain", "hello world testuser1 ");
        });

        it("A user cannot delete a blog belonging to another user", function () {
            window.localStorage.clear();
            cy.visit("http://localhost:3000");
            cy.get("#login-username").type("testuser2");
            cy.get("#login-password").type("123456");
            cy.get("#login-button").click();
            cy.contains("testuser2 logged in");

            cy.contains("hello world testuser1 ");
            cy.contains("view").click();
            cy.get("html").should("not.contain", "Delete");
        });

        it("Blogs are sorted in descending order of the number of likes", function () {
            function submitBlogForm(title, author, url) {
                cy.get("#toggleable-show").click();
                cy.get("#blog-title").type(title);
                cy.get("#blog-author").type(author);
                cy.get("#blog-url").type(url);
                cy.get("#blog-create").click();
            }

            submitBlogForm("1st blog", "testuser1", "www.blog.com");
            cy.contains("1st blog testuser1 ")
                .parent()
                .contains("view")
                .click();

            cy.get(".blog-likes").contains("like").click();
            cy.get(".notification-success").and(
                "have.css",
                "color",
                "rgb(0, 128, 0)"
            );
            cy.contains("Likes 1 ");

            cy.get(".blog-likes").contains("like").click();
            cy.get(".notification-success").and(
                "have.css",
                "color",
                "rgb(0, 128, 0)"
            );
            cy.contains("Likes 2 ");
            cy.contains("hide").click();

            submitBlogForm("2nd blog", "testuser1", "www.blog.com");
            cy.contains("2nd blog testuser1 ")
                .parent()
                .contains("view")
                .click();

            cy.get(".blog-likes").contains("like").click();
            cy.get(".notification-success").and(
                "have.css",
                "color",
                "rgb(0, 128, 0)"
            );
            cy.contains("Likes 1 ");
            cy.contains("hide").click();

            cy.get(".blog-titleAuthor")
                .eq(0)
                .should("contain", "1st blog testuser1");
            cy.get(".blog-titleAuthor")
                .eq(1)
                .should("contain", "2nd blog testuser1");
            cy.get(".blog-titleAuthor")
                .eq(2)
                .should("contain", "hello world testuser1");
        });
    });
});
