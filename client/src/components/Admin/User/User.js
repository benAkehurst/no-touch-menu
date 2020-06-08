import React, { Component } from 'react';
import classes from './User.module.scss';
import axios from '../../../axios-connector';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../../Helpers/localStorage';
import timeDateHelpers from '../../../Helpers/timeAndDate';
import BASE_URL from '../../../Helpers/BASE_URL';

import Aux from '../../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';

class User extends Component {
  state = {
    chosenUserId: null,
    isLoading: false,
    isError: false,
    allUsers: null,
    allUsersVisable: false,
    singleUser: null,
    newUserName: null,
    newUserEmail: null,
    newUserPassword: null,
    responseSuccess: false,
    changePasswordId: null,
    newPassword: null,
  };

  userIdHandler = (event) => {
    this.setState({ chosenUserId: event.target.value });
  };

  newUserHandler = (key, e) => {
    switch (key) {
      case 'name':
        this.setState({ newUserName: e.target.value });
        break;
      case 'email':
        this.setState({ newUserEmail: e.target.value });
        break;
      case 'password':
        this.setState({ newUserPassword: e.target.value });
        break;
      default:
        break;
    }
  };

  resetPasswordHandler = (key, e) => {
    switch (key) {
      case 'userId':
        this.setState({ changePasswordId: e.target.value });
        break;
      case 'newPassword':
        this.setState({ newPassword: e.target.value });
        break;
      default:
        break;
    }
  };

  getAllUsers = () => {
    this.setState({ isLoading: true });
    let data = {
      userId: helpers.getUserId(),
    };
    axios
      .post(`${BASE_URL}api/admin/get-all-users`, data)
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
      .post(`${BASE_URL}api/admin/get-single-user`, data)
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
      .post(`${BASE_URL}api/admin/change-user-admin-role`, data)
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

  handleUserActiveChange = () => {
    this.setState({ isLoading: true });
    let data = {
      requesterId: helpers.getUserId(),
      userId: this.state.chosenUserId,
      userActiveValue: this.state.singleUser.userActive ? false : true,
    };
    axios
      .post(`${BASE_URL}api/admin/change-user-status`, data)
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

  createNewUser = () => {
    let data = {
      name: this.state.newUserName,
      email: this.state.newUserEmail,
      password: this.state.newUserPassword,
    };
    this.setState({ isLoading: true });
    axios
      .post('/auth/create-new-user', data)
      .then((res) => {
        if (res.status === 201) {
          this.setState({
            isLoading: false,
            responseSuccess: true,
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
      });
  };

  updatePassword = () => {
    let data = {
      newPassword: this.state.newPassword,
    };
    this.setState({ isLoading: true });
    axios
      .post(`/auth/reset-password/${this.state.changePasswordId}`, data)
      .then((res) => {
        if (res.status === 201) {
          this.setState({
            isLoading: false,
            responseSuccess: true,
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
        });
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
          {/* Change User Status */}
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Change User Status</h4>
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
                <label>Is Active?</label>
                <p>{this.state.singleUser.userActive ? 'Yes' : 'No'}</p>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.handleUserActiveChange}
                >
                  Change Status
                </Button>
              </div>
            ) : null}
          </li>
          {/* Get Single User */}
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Get Single User</h4>
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
              <div className={classes.SingleListItem}>
                <span>Name - {this.state.singleUser.name}</span>
                <span>User Id - {this.state.singleUser._id}</span>
                <span>Email - {this.state.singleUser.email}</span>
                <span>
                  Created On -{' '}
                  {timeDateHelpers.formatDate(this.state.singleUser.createdAt)}
                </span>
                <span>
                  Updated On -{' '}
                  {timeDateHelpers.formatDate(this.state.singleUser.updatedAt)}
                </span>
                <span>
                  Is Active - {JSON.stringify(this.state.singleUser.userActive)}
                </span>
                <span>
                  Is Admin - {JSON.stringify(this.state.singleUser.isAdmin)}
                </span>
              </div>
            ) : null}
          </li>
          {/* Create A New User */}
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Create New User</h4>
              <div className={classes.SingleOptionsInputs}>
                <input
                  placeholder={'Name'}
                  type="text"
                  onChange={(e) => this.newUserHandler('name', e)}
                />
                <input
                  placeholder={'Email'}
                  type="email"
                  onChange={(e) => this.newUserHandler('email', e)}
                />
                <input
                  placeholder={'Password'}
                  type="password"
                  onChange={(e) => this.newUserHandler('password', e)}
                />
              </div>
              <Button
                color="primary"
                variant="contained"
                onClick={this.createNewUser}
                disabled={
                  !this.state.newUserName &&
                  !this.state.newUserEmail &&
                  !this.state.newUserPassword
                }
              >
                Create
              </Button>
            </div>
          </li>
          {/* Reset Password */}
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Reset Password</h4>
              <div className={classes.SingleOptionsInputs}>
                <input
                  placeholder={'User ID to change'}
                  type="text"
                  onChange={(e) => this.resetPasswordHandler('userId', e)}
                />
                <input
                  placeholder={'New Password'}
                  type="password"
                  onChange={(e) => this.resetPasswordHandler('newPassword', e)}
                />
              </div>
              <Button
                color="primary"
                variant="contained"
                onClick={this.updatePassword}
              >
                Reset Password
              </Button>
            </div>
          </li>
        </ul>
      </Aux>
    );
  }
}

export default withErrorHandler(User, axios);
