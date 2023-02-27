import axios from "axios";

const useData = (baseUrl, serviceToken = null) => {
    let token = `bearer ${serviceToken}`;

    const setServiceToken = newToken => {
        token = `bearer ${newToken}`;
    };

    const generateConfigObject = (timeout = 5000) => {
        return {
            signal: AbortSignal.timeout(timeout),
            headers: { Authorization: token },
        };
    };

    const getAll = async () => {
        const response = await axios.get(baseUrl, generateConfigObject());
        return response.data;
    };

    const getOne = async id => {
        const response = await axios.get(
            `${baseUrl}/${id}`,
            generateConfigObject()
        );
        return response.data;
    };

    const create = async newObject => {
        const response = await axios.post(
            baseUrl,
            newObject,
            generateConfigObject()
        );
        return response.data;
    };

    const update = async updatedObject => {
        const response = await axios.put(
            `${baseUrl}/${updatedObject.id}`,
            updatedObject,
            generateConfigObject()
        );
        return response.data;
    };

    const remove = async id => {
        const response = await axios.delete(
            `${baseUrl}/${id}`,
            generateConfigObject()
        );
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
