import React, { Component } from 'react';
import classes from './Admin.module.scss';
import axios from '../../axios-connector';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import helpers from '../../Helpers/localStorage';
import BASE_URL from '../../Helpers/BASE_URL';

import Aux from '../../hoc/Aux/Aux';
import Button from '@material-ui/core/Button';
import Banner from '../../components/UI/Banner/Banner';
import Spinner from '../../components/UI/Spinner/Spinner';
import Uploader from '../../components/Uploader/Uploader';
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
    if (helpers.getUserId() === null) {
      this.props.history.push({ pathName: '/auth' });
    }
    axios
      .get(`${BASE_URL}/admin/check-if-admin/${helpers.getUserId()}`)
      .then((res) => {
        if (res.data.data.success) {
          this.setState({ isLoading: false, isAuthorised: true });
        }
      })
      .catch((err) => {
        helpers.clearStorage();
        this.props.history.push({ pathName: '/auth' });
      });
  }

  render() {
    return (
      <Aux>
        <Banner siteName={'Admin Options'}></Banner>
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
            <User />
            <ul>
              <li>Get All Users</li>
              <li>Change User Admin Role</li>
              <li>Change User Status</li>
              <li>Get Single User</li>
              <li>Delete Single User</li>
              <li>Create New User</li>
              <li>Reset Password</li>
              <li>Check User Valid</li>
              <li></li>
            </ul>
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
            <Restaurant />
            <ul>
              <li>View All Restaurants</li>
              <li>Get Single Restaurant</li>
              <li>Create New Restaurant</li>
              <li>Change User Assigned To Restaurant</li>
              <li>Change Restaurant isActive Status</li>
              <li>Edit Restaurant Name</li>
              <li>Delete Restaurant</li>
              <li>Upload Restaurant Logo</li>
              <li></li>
            </ul>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography className={classes.heading}>Menu Options</Typography>
            </ExpansionPanelSummary>
            <Menu />
            <ul>
              <li>View All Menus</li>
              <li>View Current Menu</li>
              <li>View Current Menu QR Code</li>
              <li>Get Menu as PDF</li>
              <li>Add Menu to Restaurant</li>
              <li>Get All Menus</li>
              <li>Remove Menu From Restaurant</li>
              <li></li>
            </ul>
          </ExpansionPanel>
        </main>
      </Aux>
    );
  }
}

export default withErrorHandler(Admin, axios);
