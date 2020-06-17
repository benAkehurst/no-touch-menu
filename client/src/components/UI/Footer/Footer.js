import React, { Component } from 'react';
import { withRouter } from 'react-router';
import classes from './Footer.module.scss';

import Aux from '../../../hoc/Aux/Aux';

class Footer extends Component {
  redirectToFaq = () => {
    this.props.history.push('/faq');
  };

  redirectToAbout = () => {
    this.props.history.push('/about');
  };

  redirectToPrivacy = () => {
    this.props.history.push('/privacy');
  };

  redirectToTerms = () => {
    this.props.history.push('/terms');
  };

  getCurrentYear = () => {
    return new Date().getFullYear();
  };

  render() {
    return (
      <Aux>
        <div className={classes.FooterWrapper}>
          <section>
            <ul>
              <li onClick={() => this.redirectToFaq()}>FAQ</li>
              <li onClick={() => this.redirectToAbout()}>About Us</li>
              <li onClick={() => this.redirectToPrivacy()}>Privacy Policy</li>
              <li onClick={() => this.redirectToTerms()}>Website Terms</li>
            </ul>
            <p>Copyright © {this.getCurrentYear()} No Touch Menu</p>
          </section>
        </div>
      </Aux>
    );
  }
}

export default withRouter(Footer);
