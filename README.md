# Bloglist

Full Stack Blog list application made while following University of Helsinki's [Full Stack Open](https://fullstackopen.com/en) MOOC course. Contains the base features required for submitting the exercises as well as additional features of my own.

The course contain
Parts 4, 5, 7d.

From the [course page](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2):

> "In the exercises for this part, we will be building a blog list application, that allows users to save information about interesting blogs they have stumbled across on the internet. For each listed blog we will save the author, title, URL, and amount of upvotes from users of the application."

https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2

https://fullstackopen.com/en/part5
https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4

https://fullstackopen.com/en/part7/exercises_extending_the_bloglist#exercises-7-9-7-21

My additions/changes:

-   Sorting and filtering users.
-   Sorting and filtering blogs.
-   Comments with user info.
-   Deleting Comments.
-   Unliking Blogs.
-   Styling.
-   Removed tests from frontend because I did not update them as I added my extra features, (my mistake - reminder always write tests for your code).

Application is deployed using Cyclic cloud service
live url: www.cyclic.com

## Prerequisites

node js
express js

## Installing

To run the app in production or development mode

Developmentmode is what you see running in the live app.

### Production

### Development

Backend directory

To use own account on MongoDB Atlas
.env file in backend
.env.template

```
$ cd backend
$ npm install
$ npm run build:ui
$ npm start
```

## Built With:

-   [React](http://www.reactjs.org)
-   MongoDB
-   NodeJS
-   Express.js
-   React Redux
-   NPM (Node Package Manager)
-   VSCodium (Open Source Version of VS Code)
-   MongoDB Atlas

## Deployment

## Authors

**cragtok**

## License
