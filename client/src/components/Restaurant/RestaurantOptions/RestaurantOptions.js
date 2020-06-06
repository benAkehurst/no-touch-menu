import React, { Component } from 'react';
import classes from './RestaurantOptions.module.scss';
import axios from '../../../axios-connector';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import timeDateHelpers from '../../../Helpers/timeAndDate';

import Aux from '../../../hoc/Aux/Aux';
import Uploader from '../../Uploader/Uploader';

class RestaurantOptions extends Component {
  render() {
    const restaurantInfo = (
      <section className={classes.RestaurantOption}>
        <h3>Restaurant Information</h3>
        <div className={classes.RestaurantInformation}>
          <div className={classes.RestaurantSingleInfo}>
            <h4>Restaurant Name</h4>
            <p>{this.props.data.restaurantName}</p>
          </div>
          <div className={classes.RestaurantSingleInfo}>
            <h4>Main User</h4>
            <p>{this.props.data.user.name}</p>
          </div>
          <div className={classes.RestaurantSingleInfo}>
            <h4>Created On Date</h4>
            <p>{timeDateHelpers.formatDate(this.props.data.createdAt)}</p>
          </div>
        </div>
      </section>
    );

    const logoOptions = (
      <section className={classes.RestaurantOption}>
        {this.props.data.restaurantLogo ? (
          <Aux>
            <h4>Current Logo:</h4>
            <img
              alt="restaurant logo"
              src={this.props.data.restaurantLogo}
              style={{ width: '250px', height: '150px' }}
            />
          </Aux>
        ) : null}
        <Uploader
          title={'Upload New Restaurant Logo'}
          uploadType={'newLogo'}
        ></Uploader>
      </section>
    );
    return (
      <Aux>
        {this.props.data ? (
          <div>
            {restaurantInfo}
            {logoOptions}
          </div>
        ) : null}
      </Aux>
    );
  }
}

export default withErrorHandler(RestaurantOptions, axios);
