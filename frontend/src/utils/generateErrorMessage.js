const generateErrorMessage = error => {
    let errorMsg;
    if (error.name === "CanceledError") {
        errorMsg = "Request Timed Out";
    } else if (error.response.data.error) {
        errorMsg = error.response.data.error;
    } else {
        errorMsg = "Error: Something Went Wrong!";
    }
    return errorMsg;
};

export default generateErrorMessage;
