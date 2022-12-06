export const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", JSON.stringify(action.payload.token));
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
            };
        case "LOGOUT":
            localStorage.clear();
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                rows: [],
                groups: [],
            };
        case "SET_GROUPS":
            return {
                ...state,
                groups: action.payload,
            };
        case "SET_CATEGORIES":
            return {
                ...state,
                categories: action.payload,
            };
        case "SET_ROWS":
            return {
                ...state,
                rows: action.payload,
            };
        default:
            return state;
    }
};