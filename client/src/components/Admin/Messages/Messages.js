import React, { Component } from 'react';
import classes from './Messages.module.scss';
import axios from '../../../axios-connector';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import BASE_URL from '../../../Helpers/BASE_URL';

import Aux from '../../../hoc/Aux/Aux';
import Message from '../Messages/Message/Message';
import Spinner from '../../../components/UI/Spinner/Spinner';

class Messages extends Component {
  state = {
    isLoading: false,
    isError: false,
    errorMessage: null,
    isSuccess: false,
    successMessage: null,
    allMessages: [],
    unreadMessages: [],
    betaRequests: [],
    contactForm: [],
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

  changeReadStatusHandler = (messageId) => {
    this.setState({ isLoading: true });
    axios
      .put(`${BASE_URL}api/communications/update-message-read/${messageId}`)
      .then((res) => {
        if (res.status === 200) {
          this.setState({ isLoading: false });
        }
      })
      .catch((err) => {
        this.setState({
          isLoading: false,
          isError: true,
          errorMessage: 'Failed to update message read',
        });
      });
  };

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
          <section className={classes.MessagesSection}>
            <h4>Unread Messages</h4>
            {this.state.unreadMessages.length
              ? this.state.unreadMessages.map((message) => {
                  return (
                    <div className={classes.SingleMessage} key={message._id}>
                      <Message
                        messageType={message.source}
                        name={message.name}
                        email={message.email}
                        message={message.message}
                        token={message.accessToken}
                        hasRead={message.hasRead}
                        id={message._id}
                        clicked={this.changeReadStatusHandler}
                      ></Message>
                    </div>
                  );
                })
              : null}
          </section>
          <div className={classes.MessagesWrapper}>
            <h4>All messages</h4>
            <section className={classes.MessagesSection}>
              <h4>Beta Requests</h4>
              {this.state.betaRequests.length
                ? this.state.betaRequests.map((message) => {
                    return (
                      <div className={classes.SingleMessage} key={message._id}>
                        <Message
                          messageType={message.source}
                          name={message.name}
                          email={message.email}
                          message={message.message}
                          token={message.accessToken}
                          hasRead={message.hasRead}
                          id={message._id}
                          clicked={this.changeReadStatusHandler}
                        ></Message>
                      </div>
                    );
                  })
                : null}
            </section>
            <section className={classes.MessagesSection}>
              <h4>Contact Form</h4>
              {this.state.contactForm.length
                ? this.state.contactForm.map((message) => {
                    return (
                      <div className={classes.SingleMessage} key={message._id}>
                        <Message
                          messageType={message.source}
                          name={message.name}
                          email={message.email}
                          message={message.message}
                          token={message.accessToken}
                          hasRead={message.hasRead}
                          id={message._id}
                          clicked={this.changeReadStatusHandler}
                        ></Message>
                      </div>
                    );
                  })
                : null}
            </section>
          </div>
        </div>
      </Aux>
    );
  }
}

export default withErrorHandler(Messages, axios);
