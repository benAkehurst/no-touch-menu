import React, { Component } from 'react';
import classes from './Landing.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import data from './data.json';

import Aux from '../../hoc/Aux/Aux';
import ContactForm from '../../components/ContactForm/ContactForm';
import Banner from '../../components/UI/Banner/Banner';
import Button from '@material-ui/core/Button';

class Landing extends Component {
  // google analytics

  // send email

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
            <p>{data[0].main_text}</p>
          </section>
          <section className={classes.MidSection}>
            <p>{data[1].main_text}</p>
          </section>
          <section className={classes.BottomSection}>
            <ContactForm heading={'Contact Us'}></ContactForm>
          </section>
        </main>
        {/* top section
          tag line
        */}
        {/* mid section
          sales text
        */}
        {/* bottom section
          about me
          contact us form
        */}
      </Aux>
    );
  }
}

export default withErrorHandler(Landing, axios);
