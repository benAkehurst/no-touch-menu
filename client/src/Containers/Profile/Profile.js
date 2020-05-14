import React, { Component } from 'react';
import classes from './Profile.module.scss';
import axios from '../../axios-connector';
import { getUserToken, getUserId } from '../../Helpers/localStorage';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Profile extends Component {
  state = {};

  componentDidMount() {}

  render() {
    return <div>Profile</div>;
  }
}

export default withErrorHandler(Profile, axios);
