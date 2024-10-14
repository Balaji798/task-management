import { User } from "../../types/User";
import { FETCH_USER, LOGIN_REQUEST, LOGIN_SUCCESS, UserActionTypes, } from '../../types/actionTypes';

// Define the AuthState interface
export interface AuthState {
    loggingIn?: boolean;
    user?: User; // Replace 'any' with the appropriate user type
    loggedIn?: boolean;
    authenticated?: boolean;
    is_profile_completed?: boolean;
    is_new_user?: boolean;
}

// Initial state
const initialState: AuthState = {};

// Reducer function
const authReducer = (state = initialState, action:UserActionTypes): AuthState => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                loggingIn: true,
                user: action.user,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                ...action.user,
                loggedIn: true,
                authenticated: true,
            };
        case FETCH_USER:
            return { ...state, user: action.user };
        default:
            return state;
    }
};

export default authReducer;
