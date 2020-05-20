import React, { Component } from 'react';
import classes from './User.module.scss';
import axios from '../../../axios-connector';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../../Helpers/localStorage';
import BASE_URL from '../../../Helpers/BASE_URL';

import Aux from '../../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Banner from '../../../components/UI/Banner/Banner';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Uploader from '../../../components/Uploader/Uploader';

class User extends Component {
  state = {
    isLoading: false,
    isError: false,
    allUsers: null,
    allUsersVisable: false,
  };

  getAllUsers = () => {
    this.setState({ isLoading: true });
    let data = {
      userId: helpers.getUserId(),
    };
    axios
      .post(`${BASE_URL}/admin/get-all-users`, data)
      .then((res) => {
        if (res.data.success) {
          this.setState({
            isLoading: false,
            allUsers: res.data.data,
            allUsersVisable: true,
          });
        }
      })
      .catch((err) => {
        helpers.clearStorage();
        this.props.history.push({ pathName: '/auth' });
      });
  };

  hideAllUsers = () => {
    this.state.allUsersVisable
      ? this.setState({ allUsersVisable: false })
      : this.setState({ allUsersVisable: true });
  };

  render() {
    return (
      <Aux>
        {this.state.isLoading ? (
          <div className={classes.LoadingBg}>
            <Spinner size={'large'} />
          </div>
        ) : null}
        <ul>
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Get All Users</h4>
              <Button
                color="primary"
                variant="contained"
                onClick={this.getAllUsers}
              >
                Fetch
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={this.hideAllUsers}
                disabled={!this.state.allUsers}
              >
                {this.state.allUsersVisable ? 'Hide' : 'Show'}
              </Button>
            </div>
            {this.state.allUsersVisable
              ? this.state.allUsers.map((user) => {
                  return (
                    <div className={classes.SingleListItem} key={user._id}>
                      <span>{user.name}</span>
                      <span
                        onClick={() => this.props.userIdClick(user._id)}
                        className={classes.Hoverable}
                      >
                        {user._id}
                      </span>
                      <span>{user.email}</span>
                    </div>
                  );
                })
              : null}
          </li>
          <li>Change User Admin Role</li>
          <li>Change User Status</li>
          <li>Get Single User</li>
          <li>Delete Single User</li>
          <li>Create New User</li>
          <li>Reset Password</li>
          <li>Check User Valid</li>
          <li></li>
        </ul>
      </Aux>
    );
  }
}

export default withErrorHandler(User, axios);
