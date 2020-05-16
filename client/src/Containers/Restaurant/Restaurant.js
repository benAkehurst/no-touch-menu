import React, { PureComponent, Component } from 'react';
import classes from './Restaurant.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../Helpers/localStorage';
import BASE_URL from '../../Helpers/BASE_URL';

import Aux from '../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Banner from '../../components/UI/Banner/Banner';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import Card from '../../components/Card/Card';

class Restaurant extends Component {
  state = {
    isLoading: false,
    isError: false,
    errorMessage: null,
    isLoggedIn: null,
    restaurantData: null,
    updatedRestaurantName: null,
    updatedLogoFile: null,
    updatedMenuFile: null,
  };

  componentDidMount() {
    this.checkTokenValid();
  }

  checkTokenValid = () => {
    const token = helpers.getUserToken();
    if (!token) {
      this.props.history.push({ pathname: '/auth' });
    }
    this.setState({ isLoading: true });
    axios
      .get(`${BASE_URL}/auth/check-token-valid/${token}`)
      .then((res) => {
        if (res.status === 200) {
          this.setState({ isLoggedIn: true });
          this.fetchResaurantData();
        }
      })
      .catch((err) => {
        helpers.clearStorage();
        this.props.history.push({ pathname: '/auth' });
      });
  };

  fetchResaurantData = () => {
    const restaurantId = helpers.getRestaurantId();
    this.setState({ isLoading: true });
    axios
      .get(`${BASE_URL}/restaurant/get-single-restaurant/${restaurantId}`)
      .then((res) => {
        console.log(res.data.data);
        this.setState({ isLoading: false, restaurantData: res.data.data });
      })
      .catch((err) => {
        this.setState({ isLoading: false, isError: true, errorMessage: err });
      });
  };

  renderRestaurantOptions = () => {
    return (
      <div className={classes.RestaurantOptions}>
        <h2>Restaurant Options</h2>
        <section className={classes.RestaurantOption}>
          <h3>Restaurant Information</h3>
          <div className={classes.RestaurantInformation}>
            <div className={classes.RestaurantSingleInfo}>
              <h4>Restaurant Name</h4>
              <p>{this.state.restaurantData.restaurantName}</p>
            </div>
            <div className={classes.RestaurantSingleInfo}>
              <h4>Main User</h4>
              <p>{this.state.restaurantData.user.name}</p>
            </div>
            <div className={classes.RestaurantSingleInfo}>
              <h4>Created On</h4>
              <p>{this.formatDate(this.state.restaurantData.createdAt)}</p>
            </div>
          </div>
        </section>
        <section className={classes.RestaurantOption}>
          <h3>Update Restaurant Name</h3>
          <div className={classes.RestaurantChangeName}>
            <input
              placeholder={this.state.restaurantData.restaurantName}
              type="text"
            ></input>
            <Button color="primary" variant="contained">
              Submit
            </Button>
          </div>
        </section>
        <section className={classes.RestaurantOption}>
          <h3>Update Restaurant Logo</h3>
          <div className={classes.RestaurantChangeName}>
            <input type="file"></input>
            <Button color="primary" variant="contained">
              Submit
            </Button>
          </div>
        </section>
      </div>
    );
  };

  renderMenuOptions = () => {
    return (
      <div className={classes.MenuOptions}>
        <h2>Menu Options</h2>
        <section className={classes.MenuOption}>
          <Button color="primary" variant="contained">
            Download PDF Menu
          </Button>
        </section>
        <section className={classes.MenuOption}>
          <Button color="primary" variant="contained">
            Download QR Code
          </Button>
        </section>
        <section className={classes.MenuCards}>
          <div className={classes.MenuCard}>
            <h3>Current Menu</h3>
            <Card></Card>
          </div>
          <div className={classes.MenuCard}>
            <h3>Old Menus</h3>
            <Card></Card>
          </div>
        </section>
        <section className={classes.MenuOption}>
          <h3>Upload New Menu</h3>
          <Card />
        </section>
      </div>
    );
  };

  renderRestaurantPage = () => {
    return (
      <main className={classes.RestaurantContainer}>
        <section className={classes.OptionsContainer}>
          {this.renderRestaurantOptions()}
        </section>
        <section className={classes.MenuContainer}>
          {this.renderMenuOptions()}
        </section>
      </main>
    );
  };

  loadingMessage = () => {
    return <div>Loading restaurant data</div>;
  };

  formatDate = (createdOn) => {
    let date = new Date(createdOn);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();
    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    return `${dt}/${month}/${year}`;
  };

  render() {
    return (
      <Aux>
        <Banner
          siteName={
            this.state.restaurantData
              ? this.state.restaurantData.restaurantName
              : 'Loading Restaurant'
          }
          showLogo={false}
          showUserButtons={true}
        ></Banner>
        {this.state.isLoading ? <Spinner size={'large'} /> : null}
        {this.state.restaurantData
          ? this.renderRestaurantPage()
          : this.loadingMessage()}
      </Aux>
    );
  }
}

export default withErrorHandler(Restaurant, axios);
