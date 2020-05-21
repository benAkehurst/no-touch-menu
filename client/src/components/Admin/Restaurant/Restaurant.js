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
  state = {
    isLoading: false,
    allRestaurants: null,
    allRestaurantsVisable: false,
  };

  getAllRestaurants = () => {
    this.setState({ isLoading: true });
    axios
      .get(`${BASE_URL}/restaurant/view-all-restaurants/${helpers.getUserId()}`)
      .then((res) => {
        if (res.data.success) {
          this.setState({
            isLoading: false,
            allRestaurants: res.data.data,
            allRestaurantsVisable: true,
          });
        }
      })
      .catch((err) => {
        helpers.clearStorage();
        this.props.history.push({ pathName: '/auth' });
      });
  };

  hideAllRestaurants = () => {
    this.state.allRestaurantsVisable
      ? this.setState({ allRestaurantsVisable: false })
      : this.setState({ allRestaurantsVisable: true });
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
          {/* View All Restaurants */}
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4> View All Restaurants</h4>
              <Button
                color="primary"
                variant="contained"
                onClick={this.getAllRestaurants}
              >
                Fetch
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={this.hideAllRestaurants}
                disabled={!this.state.allRestaurants}
              >
                {this.state.allRestaurantsVisable ? 'Hide' : 'Show'}
              </Button>
            </div>
            {this.state.allRestaurantsVisable
              ? this.state.allRestaurants.map((restaurant) => {
                  return (
                    <div
                      className={classes.SingleListItem}
                      key={restaurant._id}
                    >
                      <span>Name - {restaurant.restaurantName}</span>
                      <span
                        onClick={() =>
                          this.props.restaurantIdClick(restaurant._id)
                        }
                        className={classes.Hoverable}
                      >
                        {' '}
                        Select ID -{restaurant._id}
                      </span>
                      <span>Main User - {restaurant.user.name}</span>
                    </div>
                  );
                })
              : null}
          </li>
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
