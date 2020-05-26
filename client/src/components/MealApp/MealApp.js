import React, { Component } from 'react';
import classes from './MealApp.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../Helpers/localStorage';
import timeDateHelpers from '../../Helpers/timeAndDate';
import BASE_URL from '../../Helpers/BASE_URL';

import Aux from '../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import Uploader from '../../components/Uploader/Uploader';

class MealApp extends Component {
  state = {
    isLoading: false,
    isError: false,
    errorMessage: null,
    successMessage: null,
    deliverooUrl: null,
    justEatUrl: null,
    uberEatsUrl: null,
    downloadButtonVisable: false,
  };

  newUrlInputHandler = (key, e) => {
    switch (key) {
      case 'deliverooUrl':
        this.setState({ deliverooUrl: e.target.value });
        break;
      case 'justEatUrl':
        this.setState({ justEatUrl: e.target.value });
        break;
      case 'uberEatsUrl':
        this.setState({ uberEatsUrl: e.target.value });
        break;
      default:
        break;
    }
  };

  saveLinkButtonHandler = (key) => {
    let mealAppSerice = key;
    let isAdmin = helpers.getAdminStatus() ? true : false;

    if (isAdmin) {
      // api calls as admin
    } else {
      // api calls as user
    }
  };

  render() {
    const spinner = <Spinner size={'large'} />;
    return (
      <Aux>
        <div
          className={[
            classes.SingleCard,
            classes[this.props.deliveryAppColor],
          ].join(' ')}
        >
          <h2>{this.props.title}</h2>
          <div className={classes.CardItem}>Upload</div>
          <div className={classes.CardItem}>Download</div>
          {/* I need to be able to:
            1. add a url link to be uploaded
            2. see the qr code or download the attached pdf
          */}
        </div>
      </Aux>
    );
  }
}

export default withErrorHandler(MealApp, axios);
