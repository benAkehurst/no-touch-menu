import React, { Component } from 'react';
import classes from './MenuOptions.module.scss';
import axios from '../../../axios-connector';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../../Helpers/localStorage';
import BASE_URL from '../../../Helpers/BASE_URL';

import Aux from '../../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Uploader from '../../Uploader/Uploader';

class MenuOptions extends Component {
  clickHandler = () => {
    window.open(
      `${BASE_URL}/menus/get-menu-pdf-user/${helpers.getUserToken()}/${helpers.getRestaurantId()}`
    );
  };

  render() {
    const getCurrentMenuPdf = (
      <Button
        color="primary"
        variant="contained"
        onClick={() => this.clickHandler()}
      >
        Download PDF Menu
      </Button>
    );

    const uploadNewMenu = (
      <Uploader title={'Upload New Menu'} uploadType={'newMenu'}></Uploader>
    );

    return (
      <Aux>
        <section className={classes.MenuOption}>{getCurrentMenuPdf}</section>
        <section className={classes.MenuOption}>{uploadNewMenu}</section>
      </Aux>
    );
  }
}

export default withErrorHandler(MenuOptions, axios);
