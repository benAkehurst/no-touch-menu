import React, { Component } from 'react';
import classes from './Menu.module.scss';
import axios from '../../../axios-connector';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../../Helpers/localStorage';
import timeDateHelpers from '../../../Helpers/timeAndDate';
import BASE_URL from '../../../Helpers/BASE_URL';

import Aux from '../../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Uploader from '../../../components/Uploader/Uploader';

class Menu extends Component {
  state = {
    isLoading: false,
    allMenus: null,
    chosenRestaurantId: null,
    chosenRestaurantData: null,
  };

  restaurantIdHandler = (e) => {
    this.setState({ chosenRestaurantId: e.target.value });
  };

  getAllMenus = () => {
    this.setState({ isLoading: true });
    axios
      .get(`${BASE_URL}/menus/view-all-menus/${helpers.getUserId()}`)
      .then((res) => {
        if (res.data.success) {
          this.setState({
            isLoading: false,
            allMenus: res.data.data,
          });
        }
      })
      .catch((err) => {
        helpers.clearStorage();
        this.props.history.push({ pathName: '/auth' });
      });
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

  render() {
    return (
      <Aux>
        {this.state.isLoading ? (
          <div className={classes.LoadingBg}>
            <Spinner size={'large'} />
          </div>
        ) : null}
        <ul>
          {/* Get All Menus */}
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4> Get All Menus</h4>
              <Button
                color="primary"
                variant="contained"
                onClick={this.getAllMenus}
              >
                Fetch
              </Button>
            </div>
            {this.state.allMenus ? <p>All menus retreived</p> : null}
          </li>
          {/* View Current Menu */}
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>View Current Menu Restaurant</h4>
              <input
                placeholder={'Restaurant ID'}
                type="text"
                onChange={this.restaurantIdHandler}
              ></input>
              <Button
                color="primary"
                variant="contained"
                onClick={this.getSingleRestaurant}
              >
                Get Restaurant
              </Button>
            </div>
            {this.state.chosenRestaurantData ? (
              <div className={classes.SingleListItem}>
                <span>
                  Current Menu Link -{' '}
                  <a
                    href={
                      this.state.chosenRestaurantData.currentMenu.menuPdfLink
                    }
                  >
                    Link
                  </a>
                </span>
                <span>
                  Created On -{' '}
                  {timeDateHelpers.formatDate(
                    this.state.chosenRestaurantData.currentMenu.createdAt
                  )}
                </span>
              </div>
            ) : null}
          </li>
          {/* View Current Menu QR Code */}
          {/* qrCodeBase64 */}
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>View Current Menu QR Code</h4>
              <input
                placeholder={'Restaurant ID'}
                type="text"
                onChange={this.restaurantIdHandler}
              ></input>
              <Button
                color="primary"
                variant="contained"
                onClick={this.getSingleRestaurant}
              >
                Get Restaurant
              </Button>
            </div>
            {this.state.chosenRestaurantData ? (
              <div className={classes.SingleListItem}>
                <span>
                  Current Menu QR Code -{' '}
                  <img
                    id="qrCodeImage"
                    src={
                      this.state.chosenRestaurantData.currentMenu.qrCodeBase64
                    }
                    alt="Menu QR Code"
                  />{' '}
                </span>
              </div>
            ) : null}
          </li>
          <li>Get Menu as PDF</li>
          {/* Get Menu as PDF */}
          <li>Add Menu to Restaurant</li>
          {/* Add Menu to Restaurant */}
          <li>Remove Menu From Restaurant</li>
          {/* Remove Menu From Restaurant */}
        </ul>
      </Aux>
    );
  }
}

export default withErrorHandler(Menu, axios);
