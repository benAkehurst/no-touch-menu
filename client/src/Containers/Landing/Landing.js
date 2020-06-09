import React, { Component } from 'react';
import classes from './Landing.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import Aux from '../../hoc/Aux/Aux';
import ContactForm from '../../components/ContactForm/ContactForm';
import BetaRequest from '../../components/ContactForm/BetaRequest/BetaRequest';
import Banner from '../../components/UI/Banner/Banner';

class Landing extends Component {
  // google analytics

  render() {
    return (
      <Aux>
        <Banner
          siteName={'No Touch Menu'}
          showUserButtons={false}
          showLogo={false}
          showLoginButton={true}
        ></Banner>
        <main className={classes.PageWrapper}>
          <section className={classes.TopSection}>
            <div className={classes.TopSectionWrapper}>
              <span className={classes.Header}>
                Digitise your menus instantly
              </span>
              <span className={classes.Subheader}>
                No Touch Menu makes it easy to get your menu into the hands of
                your customers - without them having to touch the menu.
              </span>
              <div className={classes.BetaRequest}>
                <BetaRequest></BetaRequest>
                No Spam. Ever.
              </div>
            </div>
          </section>
          <section className={classes.BottomSection}>
            <ContactForm heading={'Contact Us'}></ContactForm>
          </section>
        </main>
      </Aux>
    );
  }
}

export default withErrorHandler(Landing, axios);
