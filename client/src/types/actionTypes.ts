import { Task } from "./Task";
import { User } from "./User";

export const FETCH_TASK_REQUEST = 'FETCH_TASK_REQUEST';
export const FETCH_TASK_SUCCESS = 'FETCH_TASK_SUCCESS';
export const FETCH_TASK_FAILURE = 'FETCH_TASK_FAILURE';
export const GET_ALL_TASK = 'GET_ALL_TASK';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS ='LOGIN_SUCCESS';
export const FETCH_USER ='FETCH_USER';
export const SET_USER_PROFILE ='SET_USER_PROFILE';
export const SET_USER_STATUS = 'SET_USER_STATUS'
// Action interface for fetch product request
interface FetchTaskRequestAction {
    type: typeof FETCH_TASK_REQUEST;
}

interface FetchUserRequestAction {
    type: typeof FETCH_USER
    user: User
}

interface LoginRequestAction {
    type: typeof LOGIN_REQUEST
    user:User
}

interface LoginSuccessAction {
    type: typeof LOGIN_SUCCESS
    user: User
}

// Action interface for fetch product success
interface FetchTaskSuccessAction {
    type: typeof FETCH_TASK_SUCCESS;
    task: Task[]; // Replace 'any' with the appropriate product type
}

// Action interface for fetch product failure
interface FetchTaskFailureAction {
    type: typeof FETCH_TASK_FAILURE;
    error: string; // You can define the error type accordingly
}

// Action interface for getting all products
interface GetAllTaskAction {
    type: typeof GET_ALL_TASK;
    task: Task[]; // Replace 'any' with the appropriate product type
}

// Union type for all actions
export type TaskActionTypes =
    | FetchTaskRequestAction
    | FetchTaskSuccessAction
    | FetchTaskFailureAction
    | GetAllTaskAction;

export type UserActionTypes = |FetchUserRequestAction | LoginRequestAction | LoginSuccessAction