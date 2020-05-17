import React, { Component } from 'react';
import classes from './Restaurant.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../Helpers/localStorage';
import timeDateHelpers from '../../Helpers/timeAndDate';
import BASE_URL from '../../Helpers/BASE_URL';

import Aux from '../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Banner from '../../components/UI/Banner/Banner';
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
          this.setState({ isLoggedIn: true, isLoading: false });
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
        this.viewQrCode();
      })
      .catch((err) => {
        this.setState({ isLoading: false, isError: true, errorMessage: err });
      });
  };

  onNewNameChangeHandler = (event) => {
    this.setState({ updatedRestaurantName: event.target.value });
  };

  onNewMenuUploadChangeHandler = (event) => {
    this.setState({
      updatedMenuFile: event.target.files[0],
    });
  };

  updateRestaurantName = () => {
    this.setState({ isLoading: true });
    let data = {
      restaurantId: helpers.getRestaurantId(),
      newRestaurantName: this.state.updatedRestaurantName,
    };
    axios
      .post(
        `/restaurant/edit-restaurant-name-user/${helpers.getUserToken()}`,
        data
      )
      .then((res) => {
        this.setState({ isLoading: false });
        window.location.reload();
      })
      .catch((err) => {
        this.setState({ isLoading: false, isError: true });
      });
  };

  downloadMenu = () => {
    window.open(
      `${BASE_URL}/menus/get-menu-pdf-user/${helpers.getUserToken()}/${helpers.getRestaurantId()}`
    );
  };

  viewQrCode = () => {
    let qrUri = '';
    axios
      .get(
        `${BASE_URL}/menus/view-current-menu-qrcode-user/${helpers.getUserToken()}/${helpers.getRestaurantId()}`
      )
      .then((res) => {
        qrUri = res.data.data;
        this.setState({ qrcodeData: res.data.data, qrCodeShowing: true });
        document.querySelector('#qrCodeImage').src = qrUri;
      })
      .catch((err) => console.log(err));
  };

  clickHandler = (clickType) => {
    switch (clickType) {
      case 'updateRestaurantName':
        this.updateRestaurantName();
        break;
      case 'downloadMenu':
        this.downloadMenu();
        break;
      case 'hideQrCode':
        this.hideQrCode();
        break;
      default:
        break;
    }
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
              <h4>Created On Date</h4>
              <p>
                {timeDateHelpers.formatDate(
                  this.state.restaurantData.createdAt
                )}
              </p>
            </div>
          </div>
        </section>
        <section className={classes.RestaurantOption}>
          <h3>Update Restaurant Name</h3>
          <div className={classes.RestaurantChangeName}>
            <input
              placeholder={this.state.restaurantData.restaurantName}
              type="text"
              onChange={this.onNewNameChangeHandler}
            ></input>
            <Button
              color="primary"
              variant="contained"
              onClick={() => this.clickHandler('updateRestaurantName')}
            >
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
          <Button
            color="primary"
            variant="contained"
            onClick={() => this.clickHandler('downloadMenu')}
          >
            Download PDF Menu
          </Button>
        </section>
        <section className={classes.MenuOption}>
          <h3>Upload New Menu</h3>
        </section>
        <section className={classes.MenuCards}>
          <section className={classes.MenuCard}>
            <h3>Current Menu</h3>
            <a href={this.state.restaurantData.currentMenu.menuPdfLink}>
              Menu Link
            </a>
            <h4>Created On Date</h4>
            {timeDateHelpers.formatDate(
              this.state.restaurantData.currentMenu.createdAt
            )}
            <h4>QR Code</h4>
            <img id="qrCodeImage" src="" alt="Menu QR Code" />
          </section>
          <section className={classes.MenuCardRepeater}>
            <h3>Old Menus</h3>
            {this.state.restaurantData.oldMenus.map((menu) => {
              return (
                <div className={classes.MeanCardRepeaded}>
                  <a href={menu.menuPdfLink}>Menu Link</a>
                  <p>Created On Date:</p>
                  {timeDateHelpers.formatDate(menu.createdAt)}
                </div>
              );
            })}
          </section>
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

  displayErrorMessage = () => {
    return <div>{this.state.errorMessage}</div>;
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
        {this.state.isLoading ? (
          <div className={classes.LoadingBg}>
            <Spinner size={'large'} />
          </div>
        ) : null}
        {this.state.restaurantData
          ? this.renderRestaurantPage()
          : this.loadingMessage()}
        {this.state.errorMessage ? this.displayErrorMessage() : null}
      </Aux>
    );
  }
}

export default withErrorHandler(Restaurant, axios);
