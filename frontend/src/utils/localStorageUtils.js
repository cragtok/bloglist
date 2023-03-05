export const isLoggedIn = () => {
    return window.localStorage.getItem("loggedInUser") !== null ? true : false;
};

export const getLocalStorageToken = () => {
    const loggedInUserData = window.localStorage.getItem("loggedInUser");
    const loggedInUserJSON = JSON.parse(loggedInUserData);
    return loggedInUserJSON.token;
};

export const setLocalStorageUser = loggedInUser => {
    window.localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
};

export const getLocalStorageUserJSON = () => {
    return JSON.parse(window.localStorage.getItem("loggedInUser"));
};

export const clearLocalStorageUser = () => {
    window.localStorage.removeItem("loggedInUser");
};
