import React, { Component } from 'react';
import classes from './Restaurant.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../Helpers/localStorage';
import timeDateHelpers from '../../Helpers/timeAndDate';
import BASE_URL from '../../Helpers/BASE_URL';

import Aux from '../../hoc/Aux/Aux';
import MealApp from '../../components/MealApp/MealApp';
import Button from '@material-ui/core/Button';
import Banner from '../../components/UI/Banner/Banner';
import Spinner from '../../components/UI/Spinner/Spinner';
import Uploader from '../../components/Uploader/Uploader';

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

  uploadNewMenu = () => {
    console.log('menu upload clicked');
  };

  viewQrCode = () => {
    let qrUri = '';
    axios
      .get(
        `${BASE_URL}/menus/view-current-menu-qrcode-user/${helpers.getUserToken()}/${helpers.getRestaurantId()}`
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
        <section className={classes.RestaurantOption}>
          {this.state.restaurantData.restaurantLogo ? (
            <Aux>
              <h4>Current Logo:</h4>
              <img
                alt="restaurant logo"
                src={this.state.restaurantData.restaurantLogo}
                style={{ width: '250px', height: '150px' }}
              />
            </Aux>
          ) : null}
          <Uploader
            title={'Upload New Restaurant Logo'}
            uploadType={'newLogo'}
          ></Uploader>
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
          <Uploader title={'Upload New Menu'} uploadType={'newMenu'}></Uploader>
        </section>
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
            {this.renderRestaurantOptions()}
          </section>
          <section className={classes.MenuContainer}>
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
