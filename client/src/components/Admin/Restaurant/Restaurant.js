import React, { Component } from 'react';
import classes from './Restaurant.module.scss';
import axios from '../../../axios-connector';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../../Helpers/localStorage';
import timeDateHelpers from '../../../Helpers/timeAndDate';
import BASE_URL from '../../../Helpers/BASE_URL';

import Aux from '../../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Uploader from '../../../components/Uploader/Uploader';

class Restaurant extends Component {
  state = {};

  render() {
    return (
      <Aux>
        Restaurant
        <ul>
          <li>View All Restaurants</li>
          <li>Get Single Restaurant</li>
          <li>Create New Restaurant</li>
          <li>Change User Assigned To Restaurant</li>
          <li>Change Restaurant isActive Status</li>
          <li>Edit Restaurant Name</li>
          <li>Delete Restaurant</li>
          <li>Upload Restaurant Logo</li>
          <li></li>
        </ul>
      </Aux>
    );
  }
}

export default withErrorHandler(Restaurant, axios);
