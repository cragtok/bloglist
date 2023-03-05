export const isLoggedIn = () => {
    return window.localStorage.getItem("loggedInUser") !== null ? true : false;
};

export const getLocalStorageToken = () => {
    const loggedInUserData = window.localStorage.getItem("loggedInUser");
    const loggedInUserJSON = JSON.parse(loggedInUserData);
    return loggedInUserJSON.token;
};

export const clearLocalStorageToken = () => {
    window.localStorage.removeItem("loggedInUser");
};
