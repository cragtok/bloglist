# Bloglist

Full Stack Blog list application made using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It is from the University of Helsinki's [Full Stack Open](https://fullstackopen.com/en) MOOC course. The app contains the base features required for submitting the exercises as well as additional features and changes of my own.

From the [course page](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2):

> "In the exercises for this part, we will be building a blog list application, that allows users to save information about interesting blogs they have stumbled across on the internet. For each listed blog we will save the author, title, URL, and amount of upvotes from users of the application."

My additions/changes:

-   Sorting and filtering users.
-   Sorting and filtering blogs.
-   Adding comments with user info.
-   Deleting comments.
-   Unliking Blogs.
-   Styling.
-   Removed Tests.

Application is currently deployed and running on [Render](www.render.com) cloud service.

**Live URL**: https://bloglist-fullstack.onrender.com

## Prerequisites

-   [Node.js](https://nodejs.org/en/) at least v16.19.0.

-   A MongoDB database, either running locally or on the cloud.
    I used [MongoDB Atlas](https://www.mongodb.com/atlas/database), but any other provider is fine.

-   Git

## Installing

1. `git clone https://github.com/cragtok/bloglist.git`
2. `npm run build`

## Running

You can run the app in production or development mode. Development mode is used while developing and updating the application, while production mode is the live version running on the cloud service.

In both cases, you need an `.env` file in the backend which contains the necessary environment variables for running the application.

The `backend` directory contains a `.env.template` file which you can use as a template for your own file:

1. Rename the `.env.template` to `.env`.
2. Edit the `.env` file by setting the `MONGODB_URI`, `PORT`, `SECRET`, variables:
    - `PORT` is any allowable port number on the machine on which the application will run.
    - `MONGODB_URI` is the URI of the MongoDB database.
    - `SECRET` is any unique string which is used to sign JSON web tokens used for authentication and authorization in the application.

### Running In Development Mode

1.  Open the root of the app directory in a terminal.
2.  `cd backend`
3.  `npm run dev`. This will start the backend on `PORT` which was set in `.env`.
4.  Open another terminal.
5.  `cd ../frontend`
6.  `npm start`. This will start the frontend on a new port and automatically open it in a new browser tab. If it doesn't you can manually navigate to the address which is shown on the terminal once the app is running.

### Running In Production Mode

1. `cd ./backend`
2. `npm start`. This will start the application on `localhost:<PORT>`, where `PORT` is the environment variable which was set in `.env`. It can be accessed by opening it on the browser.

## Built With:

-   [React](http://www.reactjs.org) - Frontend UI library.
-   [React Redux](https://react-redux.js.org/) - Frontend state management.
-   [Bulma](https://bulma.io/) - CSS Framework containing ready-to-use frontend components.
-   [MongoDB](https://www.mongodb.com/) - NoSQL Database.
-   [MongoDB Atlas](https://www.mongodb.com/atlas/database) - MongoDB cloud database provider.
-   [NodeJS](https://nodejs.org) - Server-side runtime environment.
-   [Express.js](https://expressjs.com/) - Server side web application framework.
-   [NPM](https://www.npmjs.com/) - Package manager.
-   [VSCodium](https://vscodium.com/) - Community-driven, freely-licensed binary distribution of Microsoft’s editor VS Code.

## Deployment

For deploying, you can run the scripts which are specified on the root `package.json` file:

-   `npm build` for building the application.
-   `npm start` for running the production version application.

## Authors

-   **cragtok**

## License

This project is licensed under the GNU General Public License v3.0 - see the [COPYING.txt](./COPYING.txt) file for more information.
