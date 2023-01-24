import notificationReducer from "./notificationReducer";
import deepFreeze from "deep-freeze";

describe("notificationReducer", () => {
    test("should display set and unset the notification upon receiving action with payload", () => {
        const initialState = {
            notification: {
                message: "",
                timerRef: null,
                type: "",
            },
        };

        const setNotification = {
            type: "notification/setNotification",
            payload: {
                message: "NEW MESSAGE",
                type: "error",
                timerRef: setTimeout(() => {}, 4000),
            },
        };

        deepFreeze(initialState);

        const notificationDisplayedState = notificationReducer(
            initialState,
            setNotification
        );

        expect(notificationDisplayedState.message).toBe(
            setNotification.payload.message
        );
        expect(notificationDisplayedState.timerRef).not.toBe(null);
        expect(notificationDisplayedState.type).toBe(
            setNotification.payload.type
        );

        setTimeout(() => {
            const removeNotification = {
                type: "notification/removeNotification",
            };
            const notificationRemovedState = notificationReducer(
                notificationDisplayedState,
                removeNotification
            );

            expect(notificationRemovedState.message).toBe(
                initialState.notification.message
            );
            expect(notificationRemovedState.timerRef).toBe(null);
            expect(notificationRemovedState.type).toBe(
                initialState.notification.type
            );
        }, 4000);
    });
});
