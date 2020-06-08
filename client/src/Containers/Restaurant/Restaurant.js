import React, { Component } from 'react';
import classes from './Restaurant.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../Helpers/localStorage';
import timeDateHelpers from '../../Helpers/timeAndDate';
import BASE_URL from '../../Helpers/BASE_URL';

import Aux from '../../hoc/Aux/Aux';
import RestaurantOptions from '../../components/Restaurant/RestaurantOptions/RestaurantOptions';
import MenuOptions from '../../components/Restaurant/MenuOptions/MenuOptions';
import MealApp from '../../components/MealApp/MealApp';
import Button from '@material-ui/core/Button';
import Banner from '../../components/UI/Banner/Banner';
import Spinner from '../../components/UI/Spinner/Spinner';

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
      .get(`${BASE_URL}api/auth/check-token-valid/${token}`)
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
      .get(`${BASE_URL}api/restaurant/get-single-restaurant/${restaurantId}`)
      .then((res) => {
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
      `${BASE_URL}api/menus/get-menu-pdf-user/${helpers.getUserToken()}/${helpers.getRestaurantId()}`
    );
  };

  uploadNewMenu = () => {
    console.log('menu upload clicked');
  };

  viewQrCode = () => {
    let qrUri = '';
    axios
      .get(
        `${BASE_URL}api/menus/view-current-menu-qrcode-user/${helpers.getUserToken()}/${helpers.getRestaurantId()}`
      )
      .then((res) => {
        if (res.data.data) {
          qrUri = res.data.data;
          this.setState({ qrcodeData: res.data.data, qrCodeShowing: true });
          document.querySelector('#qrCodeImage').src = qrUri;
        }
      })
      .catch((err) => this.setState({ isError: true, errorMessage: err }));
  };

  removeCurrentMenu = () => {
    this.setState({ isLoading: true });
    const data = {
      restaurantId: helpers.getRestaurantId(),
      userId: helpers.getUserId(),
    };
    axios
      .post(
        `/restaurant/remove-menu-from-restaurant-user/${helpers.getUserToken()}`,
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

  clickHandler = (clickType) => {
    switch (clickType) {
      case 'updateRestaurantName':
        this.updateRestaurantName();
        break;
      case 'downloadMenu':
        this.downloadMenu();
        break;
      case 'uploadNewMenu':
        this.uploadNewMenu();
        break;
      case 'removeCurrentMenu':
        this.removeCurrentMenu();
        break;
      default:
        break;
    }
  };

  renderRestaurantOptions = () => {
    return (
      <div className={classes.RestaurantOptions}>
        <section className={classes.RestaurantOption}>
          <h3>Update Restaurant Name</h3>
          <div className={classes.FormInputWrapper}>
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
        <section className={classes.MenuCards}>
          {this.state.restaurantData.currentMenu ? (
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
              <Button
                onClick={() => this.clickHandler('removeCurrentMenu')}
                color="primary"
                variant="contained"
              >
                Remove Current Menu
              </Button>
            </section>
          ) : (
            <p>Please upload a menu!</p>
          )}
          <section className={classes.MenuCardRepeater}>
            <h3>Old Menus</h3>
            {this.state.restaurantData.oldMenus.map((menu) => {
              return (
                <div
                  className={classes.MeanCardRepeaded}
                  key={`${menu}_${Math.random()}`}
                >
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
        <div className={classes.RestaurantOptionContainer}>
          <section className={classes.OptionsContainer}>
            <h2>Restaurant Options</h2>
            <RestaurantOptions
              data={this.state.restaurantData}
            ></RestaurantOptions>
            {this.renderRestaurantOptions()}
          </section>
          <section className={classes.MenuContainer}>
            <h2>Menu Options</h2>
            <MenuOptions></MenuOptions>
            {this.renderMenuOptions()}
          </section>
        </div>
        <h2>Meal Apps Options</h2>
        <div className={classes.MealAppsContainer}>
          {this.state.restaurantData.deliverooObject ? (
            <MealApp
              title={'Deliveroo'}
              deliveryAppColor={'deliveroo'}
              inputPlaceholder={'Deliveroo URL'}
              restaurantId={this.state.restaurantData._id}
              showAddMessage={this.state.restaurantData.deliverooObject.data}
              menuAppLink={
                this.state.restaurantData.deliverooObject.menuPdfLink
                  ? this.state.restaurantData.deliverooObject.menuPdfLink
                  : null
              }
            />
          ) : null}
          {this.state.restaurantData.justEatModel ? (
            <MealApp
              title={'JustEat'}
              deliveryAppColor={'justEat'}
              inputPlaceholder={'Just Eat URL'}
              restaurantId={this.state.restaurantData._id}
              showAddMessage={this.state.restaurantData.justEatModel.data}
              menuAppLink={
                this.state.restaurantData.justEatModel.menuPdfLink
                  ? this.state.restaurantData.justEatModel.menuPdfLink
                  : null
              }
            />
          ) : null}
          {this.state.restaurantData.uberEatsModel ? (
            <MealApp
              title={'Uber Eats'}
              deliveryAppColor={'uberEats'}
              inputPlaceholder={'Uber Eats URL'}
              restaurantId={this.state.restaurantData._id}
              showAddMessage={this.state.restaurantData.uberEatsModel.data}
              menuAppLink={
                this.state.restaurantData.uberEatsModel.menuPdfLink
                  ? this.state.restaurantData.uberEatsModel.menuPdfLink
                  : null
              }
            />
          ) : null}
        </div>
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
    const banner = (
      <Banner
        siteName={
          this.state.restaurantData
            ? this.state.restaurantData.restaurantName
            : 'Loading Restaurant'
        }
        showLogo={false}
        showUserButtons={true}
      ></Banner>
    );
    return (
      <Aux>
        {banner}
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
