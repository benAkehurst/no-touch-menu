import React from 'react';
import classes from './WarningBanner.module.scss';
import Aux from '../../../hoc/Aux/Aux';

const warningBanner = (props) => (
  <Aux>
    <div className={classes.WarningBannerWrapper}>
      You have {props.freeTrailCount} days left on your free trail
    </div>
  </Aux>
);

export default warningBanner;
