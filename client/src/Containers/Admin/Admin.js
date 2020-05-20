import React, { Component } from 'react';
import classes from './Admin.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../Helpers/localStorage';
import BASE_URL from '../../Helpers/BASE_URL';

import Aux from '../../hoc/Aux/Aux';
import Banner from '../../components/UI/Banner/Banner';
import Spinner from '../../components/UI/Spinner/Spinner';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import User from '../../components/Admin/User/User';
import Restaurant from '../../components/Admin/Restaurant/Restaurant';
import Menu from '../../components/Admin/Menu/Menu';

class Admin extends Component {
  state = {
    isAdmin: false,
    isLoading: false,
    isError: false,
    isAuthorised: false,
    selectedUserId: 'Select a User',
    selectedRestaurantId: 'Select a Restaurant',
  };

  componentDidMount() {
    this.setState({ isLoading: true });
    if (
      helpers.getUserId() === null ||
      !helpers.getUserId() ||
      helpers.getUserId() === undefined
    ) {
      helpers.clearStorage();
      this.props.history.push({ pathName: '/auth' });
    }
    axios
      .get(`${BASE_URL}/admin/check-if-admin/${helpers.getUserId()}`)
      .then((res) => {
        if (res.data.success) {
          this.setState({ isLoading: false, isAuthorised: true });
        }
      })
      .catch((err) => {
        helpers.clearStorage();
        this.props.history.push({ pathName: '/auth' });
      });
  }

  setUserId = (id) => {
    this.setState({ selectedUserId: id });
  };

  render() {
    return (
      <Aux>
        <Banner siteName={'Admin Options'}></Banner>
        {this.state.isLoading ? (
          <div className={classes.LoadingBg}>
            <Spinner size={'large'} />
          </div>
        ) : null}
        <main className={classes.AdminWrapper}>
          <div className={classes.SelectedItems}>
            <p>User Id: {this.state.selectedUserId}</p>
            <p>Restaurant Id: {this.state.selectedRestaurantId}</p>
          </div>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>User Options</Typography>
            </ExpansionPanelSummary>
            <User
              userId={this.state.selectedUserId}
              restaurantId={this.state.selectedRestaurantId}
              userIdClick={this.setUserId}
            />
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>
                Restaurant Options
              </Typography>
            </ExpansionPanelSummary>
            <Restaurant
              userId={this.state.selectedUserId}
              restaurantId={this.state.selectedRestaurantId}
              userIdClick={this.setUserId}
            />
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>Menu Options</Typography>
            </ExpansionPanelSummary>
            <Menu
              userId={this.state.selectedUserId}
              restaurantId={this.state.selectedRestaurantId}
              userIdClick={this.setUserId}
            />
          </ExpansionPanel>
        </main>
      </Aux>
    );
  }
}

export default withErrorHandler(Admin, axios);
