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
      uploadedFile: null,
      isSuccess: false,
      successMessage: null,
    };
  }

  onFileChange(e) {
    this.setState({ uploadedFile: e.target.files[0] });
  }

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
            `${BASE_URL}/restaurant/add-menu-to-restaurant-user/${helpers.getUserToken()}`,
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
            `${BASE_URL}/restaurant/upload-restaurant-logo-user/${helpers.getUserToken()}`,
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

  closeSuccessMessage = () => {
    this.setState({ isSuccess: false, uploadedFile: null });
  };

  successMessageContainer = () => {
    return (
      <Aux>
        <div onClick={() => this.closeSuccessMessage()}>
          <span className={classes.closeButton}>
            X <p>{this.state.successMessage}</p>
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
                disabled={!this.state.uploadedFile}
                type="submit"
              >
                Upload
              </button>
            </div>
          </form>
          {this.state.isLoading ? <Spinner size="Large" /> : null}
          {this.state.isSuccess ? this.successMessageContainer() : null}
        </div>
      </div>
    );
  }
}

export default Uploader;
