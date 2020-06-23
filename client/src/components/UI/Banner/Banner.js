import React, { Component } from 'react';
import classes from './Banner.module.scss';
import { withRouter } from 'react-router';
import Aux from '../../../hoc/Aux/Aux';
import helpers from '../../../Helpers/localStorage';
import Button from '@material-ui/core/Button';

class Banner extends Component {
  logout = () => {
    helpers.clearStorage();
    this.props.history.push('/');
  };

  redirectToLogin = () => {
    this.props.history.push('/auth');
  };

  redirectToFaq = () => {
    this.props.history.push('/faq');
  };

  returnToLanding = () => {
    helpers.clearStorage();
    this.props.history.push('/');
  };

  showLogo = () => {
    return <div>Logo</div>;
  };

  showUserButtons = () => {
    return (
      <div>
        <Button color="inherit" onClick={() => this.logout()}>
          Logout
        </Button>
      </div>
    );
  };

  showLoginButton = () => {
    return (
      <div>
        <Button color="inherit" onClick={() => this.redirectToLogin()}>
          LOGIN TO APP
        </Button>
      </div>
    );
  };

  showFaqLink = () => {
    return (
      <div>
        <Button color="inherit" onClick={() => this.redirectToFaq()}>
          FAQ
        </Button>
      </div>
    );
  };

  render() {
    const { location } = this.props;
    return (
      <Aux>
        <nav className={classes.BannerWrapper}>
          <div className={classes.LeftSection}>
            <h6
              className={classes.PageName}
              onClick={
                location.pathname === '/admin' ||
                location.pathname === '/restaurant'
                  ? null
                  : () => this.returnToLanding()
              }
            >
              {this.props.siteName}
            </h6>
          </div>
          <div className={classes.MidSection}>
            {this.props.showLogo ? this.showLogo() : null}
          </div>
          <div className={classes.RightSection}>
            {this.props.showUserButtons ? this.showUserButtons() : null}
            {this.props.showLoginButton ? this.showLoginButton() : null}
            {this.props.showFaq ? this.showFaqLink() : null}
          </div>
        </nav>
      </Aux>
    );
  }
}

export default withRouter(Banner);
