import React, { Component } from 'react';
import classes from './BetaRequest.module.scss';
import axios from '../../../axios-connector';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import BASE_URL from '../../../Helpers/BASE_URL';

import Aux from '../../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Spinner from '../../UI/Spinner/Spinner';

class BetaRequest extends Component {
  state = {
    isLoading: false,
    isError: false,
    errorMessage: '',
    isSuccess: false,
    successMessage: '',
    email: '',
    buttonIsDisabled: true,
  };

  onEmailChange(event) {
    let s = true;
    if (event.target.value.length) {
      s = false;
    }
    this.setState({ email: event.target.value, buttonIsDisabled: s });
  }

  resetForm() {
    this.contactFormRef.reset();
    this.setState({ email: '' });
  }

  clearError = () => {
    this.setState({
      isError: false,
      errorMessage: '',
      isSuccess: false,
      successMessage: '',
    });
    this.resetForm();
  };

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    const data = {
      email: this.state.email,
    };
    axios
      .post(`${BASE_URL}api/contact/landing-page-email-form`, data)
      .then((response) => {
        if (response.data.success === true) {
          this.setState({
            isLoading: false,
            isSuccess: true,
            successMessage: `Request Sent Successfully, we'll be in touch!`,
          });
          this.resetForm();
        } else {
          this.setState({
            isLoading: false,
            isError: true,
            errorMessage: 'Something went wrong sending request.',
          });
        }
      });
  }

  render() {
    const spinner = (
      <div className={classes.LoadingBg}>
        <Spinner size={'large'} />
      </div>
    );
    const errorMessage = (
      <h4 onClick={() => this.clearError()} className={classes.ErrorMessage}>
        {this.state.errorMessage}
      </h4>
    );
    const successMessage = (
      <h4 onClick={() => this.clearError()} className={classes.SuccessMessage}>
        {this.state.successMessage}
      </h4>
    );
    const button = (
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.SubmitButton}
        disabled={this.state.buttonIsDisabled}
      >
        Request Access
      </Button>
    );
    return (
      <Aux>
        {this.state.isLoading ? spinner : null}
        {this.state.isError ? errorMessage : null}
        {this.state.isSuccess ? successMessage : null}
        <form
          ref={(el) => (this.contactFormRef = el)}
          className={classes.ContactForm}
          onSubmit={this.handleSubmit.bind(this)}
          method="POST"
        >
          <input
            type="email"
            placeholder="Your Email"
            className={[classes.Input, classes.InputElement].join(' ')}
            aria-describedby="emailHelp"
            onChange={(event) => this.onEmailChange(event)}
          />
          {button}
        </form>
      </Aux>
    );
  }
}

export default withErrorHandler(BetaRequest, axios);
