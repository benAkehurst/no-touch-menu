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
        <main>About</main>
        <Footer></Footer>
      </Aux>
    );
  }
}

export default About;
