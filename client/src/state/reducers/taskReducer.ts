import { Task } from "../../types/Task";
import { TaskActionTypes, FETCH_TASK_REQUEST, FETCH_TASK_SUCCESS, FETCH_TASK_FAILURE, GET_ALL_TASK } from '../../types/actionTypes';

// Define the TaskState interface
export interface TaskState {
  task: Task[]; // Replace 'any' with the appropriate product type
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: TaskState = {
  task: [],
  loading: false,
  error: null,
};

// Reducer function
const taskReducer = (state = initialState, action:TaskActionTypes): TaskState => {
  switch (action.type) {
      case FETCH_TASK_REQUEST:
          return {
              ...state,
              loading: true,
          };
      case FETCH_TASK_SUCCESS:
          return {
              ...state,
              task: action.task,
              loading: false,
              error: null,
          };
      case GET_ALL_TASK:
          return {
              ...state,
              task: action.task,
              loading: false,
              error: null,
          };
      case FETCH_TASK_FAILURE:
          return {
              ...state,
              loading: false,
              error: action.task,
          };
      default:
          return state;
  }
};

export default taskReducer;
