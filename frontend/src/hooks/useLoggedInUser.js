import { useSelector } from "react-redux";

const useLoggedInUser = () => {
    const user = useSelector(state => state.user);

    const isLoggedIn = () => {
        return user !== null;
    };
    return { user, isLoggedIn };
};

export default useLoggedInUser;
