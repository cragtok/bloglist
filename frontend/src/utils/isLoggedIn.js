const isLoggedIn = () => {
    return window.localStorage.getItem("loggedInUser") !== null ? true : false;
};

export default isLoggedIn;
