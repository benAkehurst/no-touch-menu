import React, { Component } from 'react';
import classes from './About.module.scss';
import Aux from '../../hoc/Aux/Aux';
import Banner from '../../components/UI/Banner/Banner';
import Footer from '../../components/UI/Footer/Footer';

class About extends Component {
  render() {
    return (
      <Aux>
        <Banner
          siteName={'No Touch Menu'}
          showUserButtons={false}
          showLogo={false}
          showLoginButton={false}
        ></Banner>
        <main className={classes.AboutWrapper}>
          <p>
            Hi! I'm Ben, a web developer based in London and I built this app
            over the last few weeks to help restaurants and cafes with the issue
            facing all of us with Covid-19.
          </p>
          <p>
            If you want to talk to me about your restaurant or cafe, then please
            email me at ben@notouchmenu.app or use the contact form on the home
            page.
          </p>
          <p>
            If you would like direct access to the app, please put your email
            into the 'Request Access' box on the home page and we'll send you
            instructions on how to join the site.
          </p>
        </main>
        <Footer></Footer>
      </Aux>
    );
  }
}

export default About;
