import * as React from "react";
import * as styles from "./privateSnakeCreator.scss";
import { Button, Input } from "react-materialize";
import * as actions from "../../redux/actions/index";
import { connect } from "react-redux";
import Spinner from "../UI/Spinner/Spinner";

// State is never set so we use the '{}' type.
interface IPrivateSnakeCreatorState {
  isInputDisplayed: boolean;
  newSnake: string;
  rule: number;
}

interface IPrivateSnakeCreatorProps {
  loading: boolean;
  error: string;
  token: string;
  userId: string;
  createSnake: any;
  removeError: any;
}

const mapStateToProps = (state: any) => {
  return {
    loading: state.snake.createSnakeLoading,
    error: state.snake.createSnakeError,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    createSnake: (
      token: string,
      userId: string,
      snakeName: string,
      rule: number
    ) => dispatch(actions.createSnake(token, userId, snakeName, rule)),
    removeError: () => dispatch(actions.createSnakeRemoveError())
  };
};

class PrivateSnakeCreator extends React.Component<
  IPrivateSnakeCreatorProps,
  IPrivateSnakeCreatorState
> {
  public state = {
    isInputDisplayed: false,
    newSnake: "",
    rule: 1
  };

  public addClickHandler = (e: any) => {
    this.props.removeError();
    if (this.state.isInputDisplayed && this.state.newSnake !== "") {
      this.props.createSnake(
        this.props.token,
        this.props.userId,
        this.state.newSnake,
        Number(this.state.rule)
      );
      this.setState({
        ...this.state,
        isInputDisplayed: !this.state.isInputDisplayed,
        newSnake: ""
      });
    } else if (!this.state.isInputDisplayed && this.props.error) {
      return;
    } else {
      this.setState({
        ...this.state,
        isInputDisplayed: !this.state.isInputDisplayed
      });
    }
    e.preventDefault();
  };
  public handleChange = (event: any) => {
    const newState: IPrivateSnakeCreatorState = {
      ...this.state,
      [event.target.name]: event.target.value,
      isInputDisplayed: true
    };
    this.setState(newState);
  };

  private errorHandler = () => {
    let error;
    if (this.props.error && this.state.newSnake === "") {
      error = <span className={styles.error}>{this.props.error}</span>;
    }
    return error;
  };

  private inputHandler = () => {
    let inputBox;
    if (this.state.isInputDisplayed || this.props.error) {
      inputBox = (
        <form onSubmit={this.addClickHandler} className={styles.input}>
          <Input
            autoFocus
            type="text"
            name="newSnake"
            label="New Snake"
            onChange={this.handleChange}
          />
          <Input
            type="number"
            name="rule"
            label="rule"
            onChange={this.handleChange}
          />
        </form>
      );
    }
    return inputBox;
  };
  private loadingHandler = () => {
    let loading = (
      <Button
        floating
        icon={this.state.newSnake !== "" ? "check" : "add"}
        className="red"
        large
        onClick={this.addClickHandler}
        style={{
          verticalAlign: "middle",
          display: "inline-block",
          marginTop: "21px"
        }}
      />
    );
    if (this.props.loading) {
      loading = <Spinner />;
    }
    return loading;
  };
  public render() {
    return (
      <div className={styles.wrapper}>
        {this.errorHandler()}
        {this.inputHandler()}
        {this.loadingHandler()}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivateSnakeCreator);
