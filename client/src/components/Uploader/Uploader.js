import React, { Component } from 'react';
import classes from './Uploader.module.scss';
import axios from '../../axios-connector';
import BASE_URL from '../../Helpers/BASE_URL';
import helpers from '../../Helpers/localStorage';

import Spinner from '../UI/Spinner/Spinner';

class Uploader extends Component {
  constructor(props) {
    super(props);

    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      isLoading: false,
      isError: false,
      updatedMenuFile: null,
      isSuccess: false,
      successMessage: null,
    };
  }

  onFileChange(e) {
    this.setState({ updatedMenuFile: e.target.files[0] });
  }

  onSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('menuFile', this.state.updatedMenuFile);
    formData.append('restaurantId', helpers.getRestaurantId());
    this.setState({ isLoading: true });
    axios
      .post(
        `${BASE_URL}/restaurant/add-menu-to-restaurant-user/${helpers.getUserToken()}`,
        formData
      )
      .then((res) => {
        console.log(res);
        this.setState({
          isLoading: false,
          isSuccess: true,
          successMessage: res.data.message,
        });
      });
  }

  render() {
    return (
      <div className="container">
        <h3>{this.props.title}</h3>

        <div className="col-md-4 offset-md-4">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input type="file" onChange={this.onFileChange} />
            </div>
            <div className="form-group">
              <button className="btn btn-primary" type="submit">
                Upload
              </button>
            </div>
          </form>
          {this.state.isLoading ? <Spinner size="Large" /> : null}
          {this.state.isSuccess ? <p>{this.state.successMessage}</p> : null}
        </div>
      </div>
    );
  }
}

export default Uploader;
