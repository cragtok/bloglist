import axios from "axios";

const baseUrl = "/api/users";

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

const getOne = async id => {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
};

const create = async (username, name, password) => {
    const response = await axios.post(baseUrl, {
        username,
        password,
        name,
    });
    return response.data;
};

const usersService = { getAll, getOne, create };
export default usersService;
