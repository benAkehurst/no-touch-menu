import React, { Component } from 'react';
import classes from './Faq.module.scss';
import Aux from '../../hoc/Aux/Aux';
import Banner from '../../components/UI/Banner/Banner';
import Footer from '../../components/UI/Footer/Footer';

class Faq extends Component {
  render() {
    return (
      <Aux>
        <Banner
          siteName={'No Touch Menu'}
          showUserButtons={false}
          showLogo={false}
          showLoginButton={false}
        ></Banner>
        <main className={classes.FaqWrapper}>
          <ul>
            <li>
              <h3>What is No Touch Menu?</h3>
              <p>
                No Touch Menu allows you to allow you customers to see your menu
                on their own phones, by simply scanning a QR Code.
              </p>
            </li>
            <li>
              <h3>How can a QR Code help us?</h3>
              <p>
                A QR means that you don't need to hand out menus to customer's,
                spend all your time cleaning menus, change your menu daily and
                allow users to see what you have to offer at a safe social
                distance.
              </p>
            </li>
            <li>
              <h3>How do QR Codes work?</h3>
              <p>
                Just open the camera app on your phone, point it at the QR code,
                and then tap the link that appears. Your phone will open its web
                browser on your menu page. It's as simple as that.
              </p>
            </li>
            <li>
              <h3>How does this help my restaurant?</h3>
              <ol>
                <li>
                  <strong>
                    You can limit the spread of germs and keep your employees
                    and customers safe.
                  </strong>
                </li>
                <li>
                  <strong>
                    You don't require expensive software or technology upgrades.
                    Just sign up and get going in a few minutes.
                  </strong>
                </li>
                <li>
                  <strong>
                    Saves you from the cost and inconvenience of printing menus.
                  </strong>
                </li>
                <li>
                  <strong>
                    Saves you from the cost and inconvenience of constantly
                    cleaning menus.
                  </strong>
                </li>
                <li>
                  <strong>
                    Same QR code works even if you change your menu every week.
                    The QR code always points to your latest menu online
                  </strong>
                </li>
              </ol>
            </li>
            <li>
              <h3>How much does it cost?</h3>
              <p>No Touch Menu is FREE for all users!</p>
            </li>
            <li>
              <h3>Do I need my own website?</h3>
              <p>
                The QR code opens a link that we create for your menu. You do
                not need an existing website to adopt No Touch Menu.
              </p>
            </li>
            <li>
              <h3>What can I upload?</h3>
              <p>You can upload your menu in PDF format.</p>
            </li>
            <li>
              <h3>What else can I do?</h3>
              <p>You can also link customers to your restaurant on:</p>
              <ul>
                <li>Deliveroo</li>
                <li>Just Eat</li>
                <li>Uber Eats</li>
              </ul>
            </li>
          </ul>
        </main>
        <Footer></Footer>
      </Aux>
    );
  }
}

export default Faq;
