import * as actionTypes from "./actionTypes";
import snakeClient from "../../http/snakes";

const createSnakeStart = () => {
  return {
    type: actionTypes.CREATE_SNAKE_START
  };
};

const createSnakeSuccess = () => {
  return {
    type: actionTypes.CREATE_SNAKE_SUCCESS
  };
};

const createSnakeFail = (error: string) => {
  return {
    type: actionTypes.CREATE_SNAKE_FAIL,
    error
  };
};

export const createSnakeRemoveError = () => {
  return {
    type: actionTypes.CREATE_SNAKE_REMOVE_ERROR
  };
};

export const createSnake = (
  token: string,
  userId: string,
  snakeName: string,
  rule: number
) => {
  return (dispatch: any) => {
    dispatch(createSnakeStart());
    snakeClient
      .create(token, userId, snakeName, rule)
      .then(res => {
        dispatch(createSnakeSuccess());
        dispatch(getSnakes(token, userId));
      })
      .catch(err => {
        dispatch(createSnakeFail(err.response.data.error));
      });
  };
};

const getSnakesStart = () => {
  return {
    type: actionTypes.GET_SNAKES_START
  };
};

const getSnakesSuccess = (snakes: Array<Object>) => {
  return {
    type: actionTypes.GET_SNAKES_SUCCESS,
    snakes
  };
};

export const getSnakes = (token: string, userId: string) => {
  return (dispatch: any) => {
    dispatch(getSnakesStart());
    snakeClient
      .get(token, userId)
      .then(res => {
        const fetchedSnakes = [];
        for (let key in res.data) {
          fetchedSnakes.push({
            ...res.data[key],
            id: key
          });
        }
        dispatch(getSnakesSuccess(fetchedSnakes));
      })
      .catch(err => {
        console.log(err.response);
      });
  };
};
