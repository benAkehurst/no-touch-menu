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
  state = {};
  render() {
    return (
      <Aux>
        <div>
          <h1>Meal Apps</h1>
          <h2>{this.props.title}</h2>
        </div>
      </Aux>
    );
  }
}

export default MealApp;
