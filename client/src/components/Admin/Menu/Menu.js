import React, { Component } from 'react';
import classes from './Menu.module.scss';
import axios from '../../../axios-connector';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../../Helpers/localStorage';
import BASE_URL from '../../../Helpers/BASE_URL';

import Aux from '../../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Banner from '../../../components/UI/Banner/Banner';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Uploader from '../../../components/Uploader/Uploader';

class Menu extends Component {
  state = {};

  render() {
    return (
      <Aux>
        Menu
        <ul>
          <li>View All Menus</li>
          <li>View Current Menu</li>
          <li>View Current Menu QR Code</li>
          <li>Get Menu as PDF</li>
          <li>Add Menu to Restaurant</li>
          <li>Get All Menus</li>
          <li>Remove Menu From Restaurant</li>
          <li></li>
        </ul>
      </Aux>
    );
  }
}

export default withErrorHandler(Menu, axios);
