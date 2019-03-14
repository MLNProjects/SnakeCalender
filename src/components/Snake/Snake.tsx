import * as React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as styles from "./Snake.scss";
import { Collection, CollectionItem } from "react-materialize";
import * as actions from "../../redux/actions/index";
import DeleteSnakeButton from "./DeleteSnakeButton/DeleteSnakeButton";
import Spinner from "../UI/Spinner/Spinner";
import Button from "../UI/Button/Button";

const mapStateToProps = (state: any) => {
  return {
    token: state.auth.token,
    userId: state.auth.userId,
    deleteSnakeSuccess: state.oneSnake.deleteSnakeSuccess,
    loading: state.oneSnake.deleteSnakeLoading
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    logDate: (
      token: string,
      userId: string,
      snakeId: string,
      comment: string
    ) => dispatch(actions.logDate(token, userId, snakeId, comment)),
    deleteSnake: (token: string, userId: string, snakeId: string) =>
      dispatch(actions.deleteSnake(token, userId, snakeId))
  };
};

interface ISnakeProps {
  snake: any;
  snakeId: string;
  token: string;
  userId: string;
  logDate: any;
  deleteSnake: any;
  deleteSnakeSuccess: boolean;
  loading: boolean;
}
const snake: React.SFC<ISnakeProps> = (props: any) => {
  const logHandler = () => {
    if (props.snake.dateLog) {
      const dates: any = props.snake.dateLog;
      let noLog: boolean = false;
      const todayDate = new Date();
      Object.keys(dates).map((date: any) => {
        const thisDate = new Date(Number(date));
        if (
          thisDate.getDate() === new Date().getDate() &&
          thisDate.getMonth() === new Date().getMonth() &&
          thisDate.getFullYear() === new Date().getFullYear()
        ) {
          noLog = true;
        }
      });
      if (!noLog) {
        props.logDate(
          props.token,
          props.userId,
          props.snakeId,
          "this was an ok day"
        );
      } else if (noLog) {
        console.log("THIS DATE ALREADY EXIST DUMMY!");
      }
    } else if (props.snake.snakeName) {
      props.logDate(
        props.token,
        props.userId,
        props.snakeId,
        "This was a beautiful day!"
      );
    }
  };

  const showLog = () => {
    let text: Array<any> = [];
    if (props.snake.dateLog) {
      text = Object.keys(props.snake.dateLog).map(date => {
        return (
          <CollectionItem key={date}>
            Logged On: {new Date(Number(date)).toDateString()}
          </CollectionItem>
        );
      });
    }
    return <Collection>{text.reverse()}</Collection>;
  };

  const redirectWhenDeleted = () => {
    if (props.deleteSnakeSuccess) {
      return <Redirect to="/home" />;
    }
    return null;
  };

  const displaySpinner = () => {
    let loading = null;
    if (props.loading) {
      loading = <Spinner />;
    }
    return loading;
  };
  return (
    <>
      {redirectWhenDeleted()}
      <div className={styles.Container}>
        <h1>{props.snake.snakeName}</h1>
        <h6>
          This snake was created: {new Date(props.snake.created).toDateString()}
        </h6>
        <div>
          <Button clicked={logHandler}>LOG TODAY</Button>
          <DeleteSnakeButton
            delete={() => {
              props.deleteSnake(props.token, props.userId, props.snakeId);
            }}
          />
          {displaySpinner()}
        </div>
        <div className={styles.Log}>{showLog()}</div>
      </div>
    </>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(snake);
