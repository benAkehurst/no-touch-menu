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
import Checkbox from '@material-ui/core/Checkbox';

class User extends Component {
  state = {
    chosenUserId: null,
    isLoading: false,
    isError: false,
    allUsers: null,
    allUsersVisable: false,
    singleUser: null,
  };

  userIdHandler = (event) => {
    this.setState({ chosenUserId: event.target.value });
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

  getSingleUser = () => {
    let data = {
      requesterId: helpers.getUserId(),
      userId: this.state.chosenUserId,
    };
    axios
      .post(`${BASE_URL}/admin/get-single-user`, data)
      .then((res) => {
        if (res.data.success) {
          this.setState({
            isLoading: false,
            singleUser: res.data.data,
          });
        }
      })
      .catch((err) => {
        helpers.clearStorage();
        this.props.history.push({ pathName: '/auth' });
      });
  };

  handleIsAdminChange = () => {
    this.setState({ isLoading: true });
    let data = {
      requesterId: helpers.getUserId(),
      userId: this.state.chosenUserId,
      isAdminValue: this.state.singleUser.isAdmin ? false : true,
    };
    axios
      .post(`${BASE_URL}/admin/change-user-admin-role`, data)
      .then((res) => {
        if (res.data.success) {
          this.setState({
            isLoading: false,
            singleUser: res.data.data,
          });
        }
      })
      .catch((err) => {
        helpers.clearStorage();
        this.props.history.push({ pathName: '/auth' });
      });
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
          {/* Get All Users */}
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
          {/* Change User Admin Role */}
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Change User Admin Role</h4>
              <input
                placeholder={'User ID'}
                type="text"
                onChange={this.userIdHandler}
              ></input>
              <Button
                color="primary"
                variant="contained"
                onClick={this.getSingleUser}
                disabled={!this.state.chosenUserId}
              >
                Get User
              </Button>
            </div>
            {this.state.singleUser ? (
              <div className={classes.ChangeAdminStatus}>
                <label>Is an Admin?</label>
                <p>{this.state.singleUser.isAdmin ? 'Yes' : 'No'}</p>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.handleIsAdminChange}
                >
                  Change Status
                </Button>
              </div>
            ) : null}
          </li>
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
