import React, { PureComponent, Component } from 'react';
import classes from './Restaurant.module.scss';
import axios from '../../axios-connector';
import BASE_URL from '../../Helpers/BASE_URL';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {
  getUserToken,
  getUserId,
  getRestaurantId,
} from '../../Helpers/localStorage';

class Restaurant extends Component {
  state = {
    restaurantDetails: null,
  };

  componentDidMount() {
    axios.get(`${BASE_URL}/`);
  }

  render() {
    return <div>Restaurant</div>;
  }
}

export default withErrorHandler(Restaurant, axios);
