import React, { Component } from 'react';
import classes from './Uploader.module.scss';
import axios from '../../axios-connector';
import BASE_URL from '../../Helpers/BASE_URL';
import helpers from '../../Helpers/localStorage';

import Aux from '../../hoc/Aux/Aux';
import Spinner from '../UI/Spinner/Spinner';

class Uploader extends Component {
  constructor(props) {
    super(props);

    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      isLoading: false,
      isError: false,
      errorMessage: '',
      uploadedFile: null,
      correctFileType: false,
      isSuccess: false,
      successMessage: null,
    };
  }

  onFileChange(e) {
    if (this.checkMimeType(e)) {
      this.setState({
        uploadedFile: e.target.files[0],
        isError: false,
        errorMessage: '',
      });
    } else {
      this.setState({ isError: true, errorMessage: 'Wrong file type' });
    }
  }

  checkMimeType = (event) => {
    let files = event.target.files;
    let err = '';
    const types = ['image/png', 'image/jpeg', 'application/pdf'];
    for (var x = 0; x < files.length; x++) {
      if (types.every((type) => files[x].type !== type)) {
        err += files[x].type + ' is not a supported format\n';
      }
    }
    if (err !== '') {
      event.target.value = null;
      this.setState({ correctFileType: false });
      return false;
    }
    this.setState({ correctFileType: true });
    return true;
  };

  onSubmit(e) {
    e.preventDefault();
    const formData = new FormData();

    switch (this.props.uploadType) {
      case 'newMenu':
        formData.append('menuFile', this.state.uploadedFile);
        formData.append('restaurantId', helpers.getRestaurantId());
        this.setState({ isLoading: true });
        axios
          .post(
            `${BASE_URL}api/restaurant/add-menu-to-restaurant-user/${helpers.getUserToken()}`,
            formData
          )
          .then((res) => {
            this.setState({
              isLoading: false,
              isSuccess: true,
              successMessage: res.data.message,
            });
          })
          .catch((err) => {
            this.setState({
              isLoading: false,
              isSuccess: false,
              successMessage: err,
            });
          });
        break;
      case 'newLogo':
        formData.append('logoFile', this.state.uploadedFile);
        formData.append('restaurantId', helpers.getRestaurantId());
        this.setState({ isLoading: true });
        axios
          .post(
            `${BASE_URL}api/restaurant/upload-restaurant-logo-user/${helpers.getUserToken()}`,
            formData
          )
          .then((res) => {
            this.setState({
              isLoading: false,
              isSuccess: true,
              successMessage: res.data.message,
            });
          })
          .catch((err) => {
            this.setState({
              isLoading: false,
              isSuccess: false,
              successMessage: err,
            });
          });
        break;
      case 'newLogoAdmin':
        formData.append('logoFile', this.state.uploadedFile);
        formData.append('restaurantId', this.props.restaurantId);
        this.setState({ isLoading: true });
        axios
          .post(
            `${BASE_URL}api/restaurant/upload-restaurant-logo/${this.props.requesterId}`,
            formData
          )
          .then((res) => {
            this.setState({
              isLoading: false,
              isSuccess: true,
              successMessage: res.data.message,
            });
          })
          .catch((err) => {
            this.setState({
              isLoading: false,
              isSuccess: false,
              successMessage: err,
            });
          });
        break;
      case 'newMenuAdmin':
        formData.append('menuFile', this.state.uploadedFile);
        formData.append('restaurantId', this.props.restaurantId);
        this.setState({ isLoading: true });
        axios
          .post(
            `${BASE_URL}api/restaurant/add-menu-to-restaurant-admin/${this.props.requesterId}`,
            formData
          )
          .then((res) => {
            this.setState({
              isLoading: false,
              isSuccess: true,
              successMessage: res.data.message,
            });
          })
          .catch((err) => {
            this.setState({
              isLoading: false,
              isSuccess: false,
              successMessage: err,
            });
          });
        break;
      default:
        break;
    }
  }

  closeMessage = () => {
    this.setState({
      isSuccess: false,
      isError: false,
      errorMessage: '',
      uploadedFile: null,
    });
  };

  messageContainer = (key) => {
    return (
      <Aux>
        <div onClick={() => this.closeMessage()}>
          <span className={classes.closeButton}>
            <span>
              {key === 'success' ? (
                <p className={classes.Success}>{this.state.successMessage}</p>
              ) : (
                <p className={classes.Error}>{this.state.errorMessage}</p>
              )}
            </span>
          </span>
        </div>
      </Aux>
    );
  };

  render() {
    return (
      <div className="container">
        <h3>{this.props.title}</h3>

        <div className="col-md-4 offset-md-4">
          <form onSubmit={this.onSubmit} className={classes.UploadForm}>
            <div className="form-group">
              <input
                type="file"
                onChange={this.onFileChange}
                className={classes.fileButton}
              />
            </div>
            <div className="form-group">
              <button
                className={classes.submitButton}
                disabled={
                  !this.state.uploadedFile && !this.state.correctFileType
                }
                type="submit"
              >
                Upload
              </button>
            </div>
          </form>
          {this.state.isLoading ? <Spinner size="Large" /> : null}
          {this.state.isSuccess
            ? this.messageContainer('success')
            : this.messageContainer('error')}
        </div>
      </div>
    );
  }
}

export default Uploader;
