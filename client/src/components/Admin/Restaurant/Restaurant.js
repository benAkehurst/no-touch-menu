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
    singleRestaurant: null,
    chosenRestaurantId: null,
    chosenRestaurantData: null,
    newRestaurantName: null,
    newRestaurantOwner: null,
    changeRestaurantID: null,
    changeRestaurantUserUser: null,
  };

  restaurantIdHandler = (event) => {
    this.setState({ chosenRestaurantId: event.target.value });
  };

  newRestaurantHandler = (key, e) => {
    switch (key) {
      case 'restaurantName':
        this.setState({ newRestaurantName: e.target.value });
        break;
      case 'ownerId':
        this.setState({ newRestaurantOwner: e.target.value });
        break;
      default:
        break;
    }
  };

  changeUserRestaurantHandler = (key, e) => {
    switch (key) {
      case 'restaurantID':
        this.setState({ changeRestaurantID: e.target.value });
        break;
      case 'userId':
        this.setState({ changeRestaurantUserUser: e.target.value });
        break;
      default:
        break;
    }
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

  getSingleRestaurant = () => {
    this.setState({ isLoading: true });
    axios
      .get(
        `${BASE_URL}/restaurant/get-single-restaurant/${this.state.chosenRestaurantId}`
      )
      .then((res) => {
        if (res.data.success) {
          this.setState({
            isLoading: false,
            chosenRestaurantData: res.data.data,
          });
        }
      })
      .catch((err) => {
        helpers.clearStorage();
        this.props.history.push({ pathName: '/auth' });
      });
  };

  createNewRestaurant = () => {
    let data = {
      restaurantName: this.state.newRestaurantName,
      userId: this.state.newRestaurantOwner,
      menus: [],
      isActive: true,
    };
    this.setState({ isLoading: true });
    axios
      .post(
        `${BASE_URL}/restaurant/create-new-restaurant/${helpers.getUserId()}`,
        data
      )
      .then((res) => {
        if (res.data.success) {
          this.setState({
            isLoading: false,
          });
        }
      })
      .catch((err) => {
        helpers.clearStorage();
        this.props.history.push({ pathName: '/auth' });
      });
  };

  changeUserAssignedToRestaurant = () => {
    let data = {
      restaurantId: this.state.changeRestaurantID,
      newUserId: this.state.changeRestaurantUserUser,
    };
    this.setState({ isLoading: true });
    axios
      .post(
        `${BASE_URL}/restaurant/change-user-assigned-to-restaurant/${helpers.getUserId()}`,
        data
      )
      .then((res) => {
        if (res.data.success) {
          this.setState({
            isLoading: false,
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
          {/* Get Single Restaurant */}
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Get Single Restaurant</h4>
              <input
                placeholder={'Restaurant ID'}
                type="text"
                onChange={this.restaurantIdHandler}
              ></input>
              <Button
                color="primary"
                variant="contained"
                onClick={this.getSingleRestaurant}
                disabled={!this.state.chosenRestaurantId}
              >
                Get Restaurant
              </Button>
            </div>
            {this.state.chosenRestaurantData ? (
              <div className={classes.SingleListItem}>
                <span>
                  Restaurant Name -{' '}
                  {this.state.chosenRestaurantData.restaurantName}
                </span>
                <span>
                  User Id - {this.state.chosenRestaurantData.user._id}
                </span>
                <span>
                  User Name - {this.state.chosenRestaurantData.user.name}
                </span>
                <span>
                  Telephone - {this.state.chosenRestaurantData.user.telephone}
                </span>
                <span>
                  Created On -{' '}
                  {timeDateHelpers.formatDate(
                    this.state.chosenRestaurantData.createdAt
                  )}
                </span>
                <span>
                  Updated On -{' '}
                  {timeDateHelpers.formatDate(
                    this.state.chosenRestaurantData.updatedAt
                  )}
                </span>
              </div>
            ) : null}
          </li>
          {/* Create New Restaurant */}
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Create New Restaurant</h4>
              <input
                placeholder={'Restaurant Name'}
                type="text"
                onChange={(e) => this.newRestaurantHandler('restaurantName', e)}
              />
              <input
                placeholder={'Restaurant Owner ID'}
                type="text"
                onChange={(e) => this.newRestaurantHandler('ownerId', e)}
              />
              <Button
                color="primary"
                variant="contained"
                onClick={this.createNewRestaurant}
              >
                Create Restaurant
              </Button>
            </div>
          </li>
          {/* Change User Assigned to Restaurant */}
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Change User Assigned to Restaurant</h4>
              <input
                placeholder={'Restaurant ID'}
                type="text"
                onChange={(e) =>
                  this.changeUserRestaurantHandler('restaurantID', e)
                }
              />
              <input
                placeholder={'User ID'}
                type="text"
                onChange={(e) => this.changeUserRestaurantHandler('userId', e)}
              />
              <Button
                color="primary"
                variant="contained"
                onClick={this.changeUserAssignedToRestaurant}
              >
                Change User
              </Button>
            </div>
          </li>
          <li>Change Restaurant isActive Status</li>
          <li>Edit Restaurant Name</li>
          <li>Delete Restaurant</li>
          <li>Upload Restaurant Logo</li>
        </ul>
      </Aux>
    );
  }
}

export default withErrorHandler(Restaurant, axios);
