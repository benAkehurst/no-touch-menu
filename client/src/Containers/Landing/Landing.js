import React, { Component } from 'react';
import classes from './Landing.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import ReactPlayer from 'react-player';

import Aux from '../../hoc/Aux/Aux';
import ContactForm from '../../components/ContactForm/ContactForm';
import BetaRequest from '../../components/ContactForm/BetaRequest/BetaRequest';
import Banner from '../../components/UI/Banner/Banner';
import Footer from '../../components/UI/Footer/Footer';

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
          showFaq={true}
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
              <a
                href={'https://www.youtube.com/watch?v=ZJYRu4dy_0M'}
                className={classes.ExplainerVideoLink}
              >
                Click Here to see a demo!
              </a>
              <ReactPlayer
                className={classes.ExplainerVideo}
                url="https://www.youtube.com/watch?v=ZJYRu4dy_0M"
              ></ReactPlayer>
              <span className={classes.SubheaderTwo}>
                To get access, please enter your email below and we'll be in
                touch with you to give you access to your account!
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
        <footer>
          <Footer></Footer>
        </footer>
      </Aux>
    );
  }
}

export default withErrorHandler(Landing, axios);
