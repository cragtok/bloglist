import userReducer from "./userReducer";
import deepFreeze from "deep-freeze";

describe("userReducer", () => {
    test("should return new state upon login", () => {
        const initialState = {};
        deepFreeze(initialState);

        const userObj = { token: "token", username: "username", name: "name" };

        const action = {
            type: "user/setUser",
            payload: userObj,
        };

        const newState = userReducer(initialState, action);

        expect(newState.token).toBe(userObj.token);
        expect(newState.name).toBe(userObj.name);
        expect(newState.username).toBe(userObj.username);
    });

    test("should reset state upon logout", () => {
        const initialState = {
            token: "token",
            username: "username",
            name: "name",
        };
        deepFreeze(initialState);

        const action = {
            type: "user/setUser",
            payload: null,
        };

        const newState = userReducer(initialState, action);

        expect(newState).toBe(null);
    });
});
