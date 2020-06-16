import React, { Component } from 'react';
import classes from './Messages.module.scss';
import axios from '../../../axios-connector';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import BASE_URL from '../../../Helpers/BASE_URL';

import Aux from '../../../hoc/Aux/Aux';
import Spinner from '../../../components/UI/Spinner/Spinner';

class Message extends Component {
  state = {
    isLoading: false,
    isError: false,
    errorMessage: null,
    isSuccess: false,
    successMessage: null,
    allMessages: null,
    unreadMessages: null,
    betaRequests: null,
    contactForm: null,
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    axios
      .get(`${BASE_URL}api/communications/get-all-messages`)
      .then((res) => {
        if (res.status === 200) {
          const allMessages = res.data.data;
          const unreadMessages = allMessages.filter(
            (message) => message.hasRead === false
          );
          const betaRequests = allMessages.filter(
            (message) => message.source === 'beta_request'
          );
          const contactForm = allMessages.filter(
            (message) => message.source === 'contact_form'
          );
          this.setState({
            isLoading: false,
            allMessages: allMessages,
            unreadMessages: unreadMessages,
            betaRequests: betaRequests,
            contactForm: contactForm,
          });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          isError: true,
          errorMessage: 'Something went wrong fetching messages',
        });
      });
  }

  render() {
    return (
      <Aux>
        {this.state.isLoading ? (
          <div className={classes.LoadingBg}>
            <Spinner size={'large'} />
          </div>
        ) : null}
        {this.state.errorMessage ? this.state.errorMessage : null}
        <div className={classes.MessagesWrapper}>
          <div>Unread Messages</div>
          <div>
            All messages
            <div>Beta Requests</div>
            <div>Contact Form</div>
          </div>
        </div>
      </Aux>
    );
  }
}

export default withErrorHandler(Message, axios);
