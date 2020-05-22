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

  render() {
    return (
      <Aux>
        {this.state.isLoading ? (
          <div className={classes.LoadingBg}>
            <Spinner size={'large'} />
          </div>
        ) : null}
        Menu
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
          {/* get restraunt by id and extract just id */}
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
          <li>View Current Menu QR Code</li>
          {/* View Current Menu QR Code */}
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
