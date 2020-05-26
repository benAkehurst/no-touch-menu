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
    isAdmin: false,
    isError: false,
    isSuccess: false,
    errorMessage: null,
    successMessage: null,
    saveButtonEnabled: false,
    deliverooUrl: null,
    justEatUrl: null,
    uberEatsUrl: null,
    downloadButtonVisable: false,
  };

  componentDidMount() {
    if (helpers.getAdminStatus()) {
      this.setState({ isAdmin: helpers.getAdminStatus() });
    }
  }

  newUrlInputHandler = (key, e) => {
    switch (key) {
      case 'deliveroo':
        this.setState({
          deliverooUrl: e.target.value,
          saveButtonEnabled: true,
        });
        break;
      case 'justEat':
        this.setState({ justEatUrl: e.target.value, saveButtonEnabled: true });
        break;
      case 'uberEats':
        this.setState({ uberEatsUrl: e.target.value, saveButtonEnabled: true });
        break;
      default:
        break;
    }
  };

  saveLinkButtonHandler = (key) => {
    if (!this.state.isAdmin) {
      switch (key) {
        case 'deliveroo':
          let deliverooData = {
            restaurantId: helpers.getRestaurantId(),
            deliverooLink: this.state.deliverooUrl,
          };
          this.setState({ isLoading: true });
          axios
            .post(
              `/mealApps/add-${key}-link-user/${helpers.getUserToken()}`,
              deliverooData
            )
            .then((res) => {
              if (res.status === 201) {
                this.setState({
                  isLoading: false,
                  isSuccess: true,
                  successMessage: res.data.message,
                });
              }
            })
            .catch((err) => {
              this.setState({
                isLoading: false,
                isError: true,
                errorMessage: err.message,
              });
            });
          break;
        case 'justEat':
          let justEatData = {
            restaurantId: helpers.getRestaurantId(),
            justEatLink: this.state.justEatUrl,
          };
          this.setState({ isLoading: true });
          axios
            .post(
              `/mealApps/add-${key}-link-user/${helpers.getUserToken()}`,
              justEatData
            )
            .then((res) => {
              if (res.status === 201) {
                this.setState({
                  isLoading: false,
                  isSuccess: true,
                  successMessage: res.data.message,
                });
              }
            })
            .catch((err) => {
              this.setState({
                isLoading: false,
                isError: true,
                errorMessage: err.message,
              });
            });
          break;
        case 'uberEats':
          let uberEatsData = {
            restaurantId: helpers.getRestaurantId(),
            uberEatsLink: this.state.uberEatsUrl,
          };
          this.setState({ isLoading: true });
          axios
            .post(
              `/mealApps/add-${key}-link-user/${helpers.getUserToken()}`,
              uberEatsData
            )
            .then((res) => {
              if (res.status === 201) {
                this.setState({
                  isLoading: false,
                  isSuccess: true,
                  successMessage: res.data.message,
                });
              }
            })
            .catch((err) => {
              this.setState({
                isLoading: false,
                isError: true,
                errorMessage: err.message,
              });
            });
          break;
        default:
          break;
      }
    } else {
      switch (key) {
        case 'deliveroo':
          let deliverooData = {
            requesterId: helpers.getUserId(),
            restaurantId: helpers.getRestaurantId(),
            deliverooLink: this.state.deliverooUrl,
          };
          this.setState({ isLoading: true });
          axios
            .post(`/mealApps/add-${key}-link-admin`, deliverooData)
            .then((res) => {
              if (res.status === 201) {
                this.setState({
                  isLoading: false,
                  isSuccess: true,
                  successMessage: res.data.message,
                });
              }
            })
            .catch((err) => {
              this.setState({
                isLoading: false,
                isError: true,
                errorMessage: err.message,
              });
            });
          break;
        case 'justEat':
          let justEatData = {
            requesterId: helpers.getUserId(),
            restaurantId: helpers.getRestaurantId(),
            justEatLink: this.state.justEatUrl,
          };
          this.setState({ isLoading: true });
          axios
            .post(`/mealApps/add-${key}-link-admin`, justEatData)
            .then((res) => {
              if (res.status === 201) {
                this.setState({
                  isLoading: false,
                  isSuccess: true,
                  successMessage: res.data.message,
                });
              }
            })
            .catch((err) => {
              this.setState({
                isLoading: false,
                isError: true,
                errorMessage: err.message,
              });
            });
          break;
        case 'uberEats':
          let uberEatsData = {
            requesterId: helpers.getUserId(),
            restaurantId: helpers.getRestaurantId(),
            uberEatsLink: this.state.uberEatsUrl,
          };
          this.setState({ isLoading: true });
          axios
            .post(`/mealApps/add-${key}-link-admin`, uberEatsData)
            .then((res) => {
              if (res.status === 201) {
                this.setState({
                  isLoading: false,
                  isSuccess: true,
                  successMessage: res.data.message,
                });
              }
            })
            .catch((err) => {
              this.setState({
                isLoading: false,
                isError: true,
                errorMessage: err.message,
              });
            });
          break;
        default:
          break;
      }
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
          {this.state.isLoading ? spinner : null}
          <h2>{this.props.title}</h2>
          <h3>Add Link to your page:</h3>
          <div className={classes.CardItem}>
            <input
              placeholder={this.props.inputPlaceholder}
              type="text"
              onChange={(e) =>
                this.newUrlInputHandler(this.props.deliveryAppColor, e)
              }
            ></input>
            <Button
              variant="contained"
              color="default"
              onClick={() =>
                this.saveLinkButtonHandler(this.props.deliveryAppColor)
              }
              disabled={!this.state.saveButtonEnabled}
            >
              Save {this.props.title} Menu
            </Button>
            {this.state.isSuccess ? this.state.successMessage : null}
            {this.state.isError ? this.state.errorMessage : null}
          </div>
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
