import React, { Component } from 'react';
import classes from './ContactForm.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import BASE_URL from '../../Helpers/BASE_URL';

import Aux from '../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Spinner from '../UI/Spinner/Spinner';

class ContactForm extends Component {
  state = {
    isLoading: false,
    isError: false,
    errorMessage: '',
    isSuccess: false,
    successMessage: '',
    name: '',
    email: '',
    message: '',
    buttonIsDisabled: true,
  };

  onNameChange(event) {
    let s = true;
    if (
      this.state.email.length &&
      this.state.message.length &&
      event.target.value.length
    ) {
      s = false;
    }
    this.setState({ name: event.target.value, buttonIsDisabled: s });
  }

  onEmailChange(event) {
    let s = true;
    if (
      this.state.name.length &&
      this.state.message.length &&
      event.target.value.length
    ) {
      s = false;
    }
    this.setState({ email: event.target.value, buttonIsDisabled: s });
  }

  onMessageChange(event) {
    let s = true;
    if (
      this.state.name.length &&
      this.state.email.length &&
      event.target.value.length
    ) {
      s = false;
    }
    this.setState({ message: event.target.value, buttonIsDisabled: s });
  }

  resetForm() {
    this.contactFormRef.reset();
    this.setState({ name: '', email: '', message: '' });
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
      name: this.state.name,
      email: this.state.email,
      message: this.state.message,
    };
    axios
      .post(`${BASE_URL}api/contact/landing-page-form`, data)
      .then((response) => {
        if (response.data.success === true) {
          this.setState({
            isLoading: false,
            isSuccess: true,
            successMessage: 'Message Sent Successfully',
          });
          this.resetForm();
        } else {
          this.setState({
            isLoading: false,
            isError: true,
            errorMessage: 'Something went wrong sending message.',
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
        Submit
      </Button>
    );
    return (
      <Aux>
        <h3>{this.props.heading}</h3>
        {this.state.isLoading ? spinner : null}
        {this.state.isError ? errorMessage : null}
        {this.state.isSuccess ? successMessage : null}
        <form
          id="contact-form"
          ref={(el) => (this.contactFormRef = el)}
          className={classes.ContactForm}
          onSubmit={this.handleSubmit.bind(this)}
          method="POST"
        >
          <div className={classes.FormGroup}>
            <label htmlFor="name" className={classes.Label}>
              Name
            </label>
            <input
              type="text"
              className={[classes.Input, classes.InputElement].join(' ')}
              placeholder="Your Name"
              onChange={(event) => this.onNameChange(event)}
            />
          </div>
          <div className={classes.FormGroup}>
            <label htmlFor="exampleInputEmail1" className={classes.Label}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Your Email"
              className={[classes.Input, classes.InputElement].join(' ')}
              aria-describedby="emailHelp"
              onChange={(event) => this.onEmailChange(event)}
            />
          </div>
          <div className={classes.FormGroup}>
            <label htmlFor="message" className={classes.Label}>
              Message
            </label>
            <textarea
              className={[classes.Input, classes.InputElement].join(' ')}
              rows="5"
              placeholder="Your Message"
              onChange={(event) => this.onMessageChange(event)}
            ></textarea>
          </div>
          {!this.state.buttonIsDisabled ? button : null}
        </form>
      </Aux>
    );
  }
}

export default withErrorHandler(ContactForm, axios);
