import axios from "axios";

const baseUrl = "/api/blogs";

let token = null;

const setToken = newToken => {
    token = `bearer ${newToken}`;
};

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const create = async newObject => {
    const config = { headers: { Authorization: token } };
    const response = await axios.post(baseUrl, newObject, config);
    return response.data;
};

const update = async blog => {
    const config = { headers: { Authorization: token } };
    const response = await axios.put(`${baseUrl}/${blog.id}`, blog, config);
    return response.data;
};

const remove = async id => {
    const config = { headers: { Authorization: token } };
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return response.data;
};

const addComment = async (blogId, comment) => {
    const config = { headers: { Authorization: token } };
    const response = await axios.post(
        `${baseUrl}/${blogId}/comments`,
        { comment },
        config
    );
    return response.data;
};

const blogService = { remove, create, getAll, setToken, update, addComment };
export default blogService;
