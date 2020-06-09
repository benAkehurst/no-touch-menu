import React, { Component } from 'react';
import classes from './ContactForm.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../Helpers/localStorage';
import BASE_URL from '../../Helpers/BASE_URL';

import Aux from '../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Spinner from '../UI/Spinner/Spinner';

class ContactForm extends Component {
  state = {
    isLoading: false,
    isError: false,
    errorMessage: '',
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
    this.setState({ name: '', email: '', message: '' });
  }

  clearError = () => {
    this.setState({ isError: false, errorMessage: '' });
    this.contactFormRef.reset();
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
        console.log(response);
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          isError: true,
          errorMessage: 'Something went wrong sending message.',
        });
      });
  }

  render() {
    const spinner = <Spinner size={'large'} />;
    const errorMessage = (
      <h4 onClick={() => this.clearError()} className={classes.ErrorMessage}>
        {this.state.errorMessage}
      </h4>
    );
    return (
      <Aux>
        <h3>{this.props.heading}</h3>
        {this.state.isLoading ? spinner : null}
        {this.state.isError ? errorMessage : null}
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.SubmitButton}
            disabled={this.state.buttonIsDisabled}
          >
            Submit
          </Button>
        </form>
      </Aux>
    );
  }
}

export default withErrorHandler(ContactForm, axios);
