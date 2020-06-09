import React, { Component } from 'react';
import classes from './WarningBanner.module.scss';
import axios from '../../../axios-connector';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../../Helpers/localStorage';
import BASE_URL from '../../../Helpers/BASE_URL';

import Aux from '../../../hoc/Aux/Aux';

class WarningBanner extends Component {
  render() {
    return (
      <Aux>
        <div className={classes.WarningBannerWrapper}>
          You have {this.props.freeTrailCount} days left on your free trail
        </div>
      </Aux>
    );
  }
}

export default withErrorHandler(WarningBanner, axios);
