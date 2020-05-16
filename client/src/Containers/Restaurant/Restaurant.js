import React, { PureComponent, Component } from 'react';
import classes from './Restaurant.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../Helpers/localStorage';
import BASE_URL from '../../Helpers/BASE_URL';

import Aux from '../../hoc/Aux/Aux';
import Banner from '../../components/UI/Banner/Banner';
import Spinner from '../../components/UI/Spinner/Spinner';

class Restaurant extends Component {
  state = {
    isLoading: false,
    isError: false,
    errorMessage: null,
    isLoggedIn: null,
    restaurantData: null,
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
    return <h2>Restaurant Options</h2>;
  };

  renderMenuOptions = () => {
    return <h2>Menu Options</h2>;
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
