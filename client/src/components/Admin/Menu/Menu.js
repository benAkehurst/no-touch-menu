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
  state = {};

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
          <li>View All Menus</li>
          {/* View All Menus */}
          <li>View Current Menu</li>
          {/* View Current Menu */}
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
