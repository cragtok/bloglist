import axios from "axios";

const useData = (baseUrl, serviceToken = null) => {
    let token = `bearer ${serviceToken}`;

    const setServiceToken = newToken => {
        token = `bearer ${newToken}`;
    };

    const getAll = async () => {
        const config = { headers: { Authorization: token } };
        const response = await axios.get(baseUrl, config);
        return response.data;
    };

    const getOne = async id => {
        const config = { headers: { Authorization: token } };
        const response = await axios.get(`${baseUrl}/${id}`, config);
        return response.data;
    };

    const create = async newObject => {
        const config = { headers: { Authorization: token } };
        const response = await axios.post(baseUrl, newObject, config);
        return response.data;
    };

    const update = async updatedObject => {
        const config = { headers: { Authorization: token } };
        const response = await axios.put(
            `${baseUrl}/${updatedObject.id}`,
            updatedObject,
            config
        );
        return response.data;
    };

    const remove = async id => {
        const config = { headers: { Authorization: token } };
        const response = await axios.delete(`${baseUrl}/${id}`, config);
        return response.data;
    };

    const services = {
        getAll,
        create,
        remove,
        update,
        setServiceToken,
        getOne,
    };
    return services;
};

export default useData;
