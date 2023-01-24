import { useSelector } from "react-redux";

export const useLoggedInUser = () => {
    const user = useSelector(state => state.user);

    const isLoggedIn = () => {
        return user !== null;
    };
    return { user, isLoggedIn };
};
