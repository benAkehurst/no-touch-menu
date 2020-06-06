'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Restaurant = mongoose.model('Restaurant');
const fetch = require('node-fetch');

/**
 * Gets the amount of clicks on a bit.ly link
 * ADMIN PROCEDURE
 * POST
 * {
 *  requesterId: 'string',
 *  restaurantId: 'string'
 * }
 */
exports.get_bitly_link_data = async (req, res) => {
  const requesterId = req.body.requesterId;
  const restaurantId = req.body.restaurantId;

  if (!requesterId || requesterId === null) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Paramters',
      data: null,
    });
  }
  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
    if (user === null) {
      return false;
    }
    if (user.isAdmin) {
      isAdminCheck = user.isAdmin;
    }
  });

  if (isAdminCheck) {
    // find restaurant
    let restaurant = await Restaurant.findById(restaurantId, (err, data) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: 'Restaurant not found',
          data: null,
        });
      } else {
        return data;
      }
    });
    let bitlyLinks = [];
    if (restaurant.currentMenu.linkToTrack) {
      bitlyLinks.push(restaurant.currentMenu.linkToTrack);
    }
    if (restaurant.deliverooObject.linkToTrack) {
      bitlyLinks.push(restaurant.deliverooObject.linkToTrack);
    }
    if (restaurant.justEatModel.linkToTrack) {
      bitlyLinks.push(restaurant.justEatModel.linkToTrack);
    }
    if (restaurant.uberEatsModel.linkToTrack) {
      bitlyLinks.push(restaurant.uberEatsModel.linkToTrack);
    }
    console.log(bitlyLinks);
    // get current menu bitly link
    // get deliveroo / justeat / uber eats links
    // loop though and call bitly api for data
    // package into json and return to client
    res.status(200).json({
      success: true,
      message: 'Data aggregated',
      data: null,
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authorized',
      data: null,
    });
  }
};
