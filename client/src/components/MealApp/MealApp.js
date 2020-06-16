import React, { Component } from 'react';
import classes from './MealApp.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../Helpers/localStorage';
import BASE_URL from '../../Helpers/BASE_URL';

import Aux from '../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

class MealApp extends Component {
  state = {
    isLoading: false,
    isAdmin: false,
    isError: false,
    isSuccess: false,
    showAddMessage: 'Add a Link',
    errorMessage: null,
    successMessage: null,
    saveButtonEnabled: false,
    deliverooUrl: null,
    justEatUrl: null,
    uberEatsUrl: null,
    downloadButtonVisable: false,
    showQRImage: false,
    QRCode: null,
  };

  componentDidMount() {
    if (helpers.getAdminStatus()) {
      this.setState({ isAdmin: helpers.getAdminStatus() });
    }
  }

  newUrlInputHandler = (key, e) => {
    switch (key) {
      case 'deliveroo':
        const regExpDel = /deliveroo.co.uk/g;
        let testStringDel = e.target.value;
        if (regExpDel.test(testStringDel)) {
          this.setState({
            deliverooUrl: e.target.value,
            isSuccess: true,
            successMessage: `URL correct`,
            saveButtonEnabled: true,
          });
        } else {
          this.setState({ isError: true, errorMessage: `URL isn't correct` });
        }
        break;
      case 'justEat':
        const regExpJust = /just-eat.co.uk/g;
        let testStringJust = e.target.value;
        if (regExpJust.test(testStringJust)) {
          this.setState({
            justEatUrl: e.target.value,
            isSuccess: true,
            successMessage: `URL correct`,
            saveButtonEnabled: true,
          });
        } else {
          this.setState({ isError: true, errorMessage: `URL isn't correct` });
        }
        break;
      case 'uberEats':
        const regExpUber = /ubereats.com/g;
        let testStringUber = e.target.value;
        if (regExpUber.test(testStringUber)) {
          this.setState({
            uberEatsUrl: e.target.value,
            isSuccess: true,
            successMessage: `URL correct`,
            saveButtonEnabled: true,
          });
        } else {
          this.setState({ isError: true, errorMessage: `URL isn't correct` });
        }
        break;
      default:
        break;
    }
  };

  saveLinkButtonHandler = (key) => {
    if (this.state.isAdmin) {
      switch (key) {
        case 'deliveroo':
          let deliverooData = {
            restaurantId: helpers.getRestaurantId(),
            service: this.props.deliveryAppColor,
            serviceLink: this.state.deliverooUrl,
          };
          this.setState({ isLoading: true });
          axios
            .post(
              `api/mealApps/add-link-mealApp-user/${helpers.getUserToken()}`,
              deliverooData
            )
            .then((res) => {
              if (res.status === 200) {
                this.setState({
                  isLoading: false,
                  isSuccess: true,
                  successMessage: res.data.message,
                  isError: false,
                  errorMessage: '',
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
            service: this.props.deliveryAppColor,
            serviceLink: this.state.justEatUrl,
          };
          this.setState({ isLoading: true });
          axios
            .post(
              `api/mealApps/add-link-mealApp-user/${helpers.getUserToken()}`,
              justEatData
            )
            .then((res) => {
              if (res.status === 200) {
                this.setState({
                  isLoading: false,
                  isSuccess: true,
                  successMessage: res.data.message,
                  isError: false,
                  errorMessage: '',
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
            service: this.props.deliveryAppColor,
            serviceLink: this.state.uberEatsUrl,
          };
          this.setState({ isLoading: true });
          axios
            .post(
              `api/mealApps/add-link-mealApp-user/${helpers.getUserToken()}`,
              uberEatsData
            )
            .then((res) => {
              if (res.status === 200) {
                this.setState({
                  isLoading: false,
                  isSuccess: true,
                  successMessage: res.data.message,
                  isError: false,
                  errorMessage: '',
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
            service: this.props.deliveryAppColor,
            serviceLink: this.state.deliverooUrl,
          };
          this.setState({ isLoading: true });
          axios
            .post(`/mealApps/add-link-mealApp-admin`, deliverooData)
            .then((res) => {
              if (res.status === 200) {
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
            service: this.props.deliveryAppColor,
            serviceLink: this.state.justEatUrl,
          };
          this.setState({ isLoading: true });
          axios
            .post(`/mealApps/add-link-mealApp-admin`, justEatData)
            .then((res) => {
              if (res.status === 200) {
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
            service: this.props.deliveryAppColor,
            serviceLink: this.state.uberEatsUrl,
          };
          this.setState({ isLoading: true });
          axios
            .post(`/mealApps/add-link-mealApp-admin`, uberEatsData)
            .then((res) => {
              if (res.status === 200) {
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

  downloadMealAppPDF = (key) => {
    window.open(
      `${BASE_URL}api/mealApps/get-${key}-PDF-user/${helpers.getUserToken()}/${
        this.props.restaurantId
      }`
    );
  };

  downloadMealAppPDFAdmin = (key) => {
    window.open(
      `${BASE_URL}api/mealApps/get-${key}-PDF-admin/${helpers.getUserId()}/${
        this.props.restaurantId
      }`
    );
  };

  viewQrCode = () => {
    axios
      .get(
        `${BASE_URL}api/mealApps/get-takeaway-qrcode-user/${helpers.getUserToken()}/${
          this.props.restaurantId
        }/${this.props.deliveryAppColor}`
      )
      .then((res) => {
        if (res.data.data) {
          this.setState({
            isLoading: false,
            showQRImage: true,
            QRCode: res.data.data,
          });
        }
      })
      .catch((err) => this.setState({ isError: true, errorMessage: err }));
  };

  removeMealAppObject = () => {
    if (!this.state.isAdmin) {
      let data = {
        restaurantId: helpers.getRestaurantId(),
        service: this.props.deliveryAppColor,
      };
      this.setState({ isLoading: true });
      axios
        .post(
          `/mealApps/remove-meal-app-object-admin/${helpers.getUserId()}`,
          data
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
    } else {
      let data = {
        restaurantId: helpers.getRestaurantId(),
        service: this.props.deliveryAppColor,
      };
      this.setState({ isLoading: true });
      axios
        .post(
          `/mealApps/remove-meal-app-object-user/${helpers.getUserToken()}`,
          data
        )
        .then((res) => {
          if (res.status === 200) {
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
    }
  };

  render() {
    const spinner = <Spinner size={'large'} />;
    const saveMenuInput = (
      <input
        placeholder={
          this.props.inputPlaceholder
            ? this.props.inputPlaceholder
            : this.props.menuAppLink
        }
        type="text"
        onChange={(e) =>
          this.newUrlInputHandler(this.props.deliveryAppColor, e)
        }
      />
    );
    const saveMenuButton = (
      <Button
        variant="contained"
        color="default"
        onClick={() => this.saveLinkButtonHandler(this.props.deliveryAppColor)}
        disabled={!this.state.saveButtonEnabled}
      >
        Save {this.props.title} Menu
      </Button>
    );
    const downloadPDFButton = (
      <Button
        variant="contained"
        onClick={
          this.state.isAdmin
            ? () => this.downloadMealAppPDF(this.props.deliveryAppColor)
            : () =>
                this.downloadMealAppPDFAdmin(
                  this.props.deliveryAppColor,
                  this.state.restaurantId
                )
        }
      >
        Download {this.props.title} PDF
      </Button>
    );
    const viewQRCodeButton = (
      <Button variant="contained" onClick={this.viewQrCode}>
        Veiw {this.props.title} QR Code
      </Button>
    );
    const removeLinkButton = (
      <Button variant="contained" onClick={() => this.removeMealAppObject()}>
        Remove Link
      </Button>
    );
    const qrCodeImageEl = (
      <img id="qrCodeImage" src={this.state.QRCode} alt="Menu QR Code" />
    );
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
          {this.state.isSuccess ? this.state.successMessage : null}
          {this.state.isError ? this.state.errorMessage : null}
          {this.props.showAddMessage ? (
            <span>{this.state.showAddMessage}</span>
          ) : null}
          <h3>Add Link to your page:</h3>
          <div className={classes.CardItem}>
            <div className={classes.FormInputWrapper}>{saveMenuInput}</div>
            {saveMenuButton}
          </div>
          <div className={classes.CardItem}>Options</div>
          {this.props.showAddMessage !== null ? downloadPDFButton : null}
          {this.props.showAddMessage !== null ? viewQRCodeButton : null}
          {this.state.showQRImage ? qrCodeImageEl : null}
          {this.props.showAddMessage !== null ? removeLinkButton : null}
        </div>
      </Aux>
    );
  }
}

export default withErrorHandler(MealApp, axios);
