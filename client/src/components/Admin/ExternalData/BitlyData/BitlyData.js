import React, { Component } from 'react';
import classes from './BitlyData.module.scss';
import axios from '../../../../axios-connector';
import withErrorHandler from '../../../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../../../Helpers/localStorage';
import timeDateHelpers from '../../../../Helpers/timeAndDate';
import BASE_URL from '../../../../Helpers/BASE_URL';

import Aux from '../../../../hoc/Aux/Aux';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '@material-ui/core/Button';

class BitlyData extends Component {
  state = {
    isLoading: false,
    isError: false,
    isErrorMessage: '',
    chosenRestaurantId: null,
    currentMenuVisable: false,
    currentMenuData: null,
    deliverooVisable: false,
    deliverooData: null,
    justEatVisable: false,
    justEatData: null,
    uberEatsVisable: false,
    uberEatsData: null,
  };

  restaurantIdHandler = (e) => {
    this.setState({ chosenRestaurantId: e.target.value });
  };

  clickHandler = (buttonType) => {
    switch (buttonType) {
      case 'allData':
        this.getBitlyData();
        break;
      case 'currentMenuData':
        if (!this.state.currentMenuVisable) {
          this.setState({ currentMenuVisable: true });
        } else {
          this.setState({ currentMenuVisable: false });
        }
        break;
      case 'deliverooData':
        if (!this.state.deliverooVisable) {
          this.setState({ deliverooVisable: true });
        } else {
          this.setState({ deliverooVisable: false });
        }
        break;
      case 'justEatButton':
        if (!this.state.justEatVisable) {
          this.setState({ justEatVisable: true });
        } else {
          this.setState({ justEatVisable: false });
        }
        break;
      case 'uberEatsButton':
        if (!this.state.uberEatsVisable) {
          this.setState({ uberEatsVisable: true });
        } else {
          this.setState({ uberEatsVisable: false });
        }
        break;
      default:
        break;
    }
  };

  getBitlyData = () => {
    this.setState({ isLoading: true });
    const data = {
      requesterId: helpers.getUserId(),
      restaurantId: this.state.chosenRestaurantId,
    };
    axios
      .post(`${BASE_URL}api/external-data/get-bitly-link-data`, data)
      .then((response) => {
        if (response.data.success) {
          this.setState({
            isLoading: false,
            currentMenuData: response.data.data[0],
            deliverooData: response.data.data[1],
            justEatData: response.data.data[2],
            uberEatsData: response.data.data[3],
          });
        }
      })
      .catch((err) => {
        this.setState({
          isError: true,
          isErrorMessage: 'Error retreving click data',
        });
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
        {this.state.isError ? <span>{this.state.isErrorMessage}</span> : null}
        <ul>
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Get Restaurant Link Data</h4>
              <input
                placeholder={'Restaurant ID'}
                type="text"
                onChange={this.restaurantIdHandler}
              ></input>
              <Button
                color="primary"
                variant="contained"
                disabled={!this.state.chosenRestaurantId}
                onClick={() => this.clickHandler('allData')}
              >
                Get All Data
              </Button>
            </div>
          </li>
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Current Menu Data</h4>

              <Button
                color="primary"
                variant="contained"
                disabled={!this.state.currentMenuData}
                onClick={() => this.clickHandler('currentMenuData')}
              >
                {this.state.currentMenuVisable ? 'Hide Data' : 'Show Data'}
              </Button>
            </div>
            {this.state.currentMenuVisable ? (
              <div className={classes.SingleOption}>
                <span>
                  {' '}
                  Date of Request -
                  {timeDateHelpers.formatDate(
                    this.state.currentMenuData.unit_reference
                  )}
                </span>
                {this.state.currentMenuData.link_clicks.map((item) => (
                  <div>
                    <div>Date - {timeDateHelpers.formatDate(item.date)}</div>
                    <div>Clicks - {item.clicks}</div>
                    <hr />
                  </div>
                ))}
              </div>
            ) : null}
          </li>
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Deliveroo Data</h4>
              <Button
                color="primary"
                variant="contained"
                disabled={!this.state.deliverooData}
                onClick={() => this.clickHandler('deliverooData')}
              >
                {this.state.deliverooVisable ? 'Hide Data' : 'Show Data'}
              </Button>
            </div>
            {this.state.deliverooVisable ? (
              <div className={classes.SingleOption}>
                <span>
                  {' '}
                  Date of Request -
                  {timeDateHelpers.formatDate(
                    this.state.deliverooData.unit_reference
                  )}
                </span>
                {this.state.deliverooData.link_clicks.map((item) => (
                  <div>
                    <div>Date - {timeDateHelpers.formatDate(item.date)}</div>
                    <div>Clicks - {item.clicks}</div>
                    <hr />
                  </div>
                ))}
              </div>
            ) : null}
          </li>
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Just Eat Data</h4>
              <Button
                color="primary"
                variant="contained"
                disabled={!this.state.justEatData}
                onClick={() => this.clickHandler('justEatButton')}
              >
                {this.state.justEatVisable ? 'Hide Data' : 'Show Data'}
              </Button>
            </div>
            {this.state.justEatVisable ? (
              <div className={classes.SingleOption}>
                <span>
                  {' '}
                  Date of Request -
                  {timeDateHelpers.formatDate(
                    this.state.justEatData.unit_reference
                  )}
                </span>
                {this.state.justEatData.link_clicks.map((item) => (
                  <div>
                    <div>Date - {timeDateHelpers.formatDate(item.date)}</div>
                    <div>Clicks - {item.clicks}</div>
                    <hr />
                  </div>
                ))}
              </div>
            ) : null}
          </li>
          <li className={classes.SingleOption}>
            <div className={classes.SingleOptionHeader}>
              <h4>Uber Eats Data</h4>
              <Button
                color="primary"
                variant="contained"
                disabled={!this.state.uberEatsData}
                onClick={() => this.clickHandler('uberEatsButton')}
              >
                {this.state.uberEatsVisable ? 'Hide Data' : 'Show Data'}
              </Button>
            </div>
            {this.state.uberEatsVisable ? (
              <div className={classes.SingleOption}>
                <span>
                  {' '}
                  Date of Request -
                  {timeDateHelpers.formatDate(
                    this.state.uberEatsData.unit_reference
                  )}
                </span>
                {this.state.uberEatsData.link_clicks.map((item) => (
                  <div>
                    <div>Date - {timeDateHelpers.formatDate(item.date)}</div>
                    <div>Clicks - {item.clicks}</div>
                    <hr />
                  </div>
                ))}
              </div>
            ) : null}
          </li>
        </ul>
      </Aux>
    );
  }
}

export default withErrorHandler(BitlyData, axios);
