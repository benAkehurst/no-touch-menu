'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Restaurant = mongoose.model('Restaurant');
const axios = require('axios');

/**
 * Gets the amount of clicks on a bit.ly link
 * ADMIN PROCEDURE
 * POST
 * {
 *  requesterId: 'string',
 *  restaurantId: 'string',
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
    // get current menu bitly link and get deliveroo / justeat / uber eats links
    let bitlyLinks = [];
    if (restaurant.currentMenu.linkToTrack) {
      bitlyLinks.push(removeHttps(restaurant.currentMenu.linkToTrack));
    }
    if (restaurant.deliverooObject.linkToTrack) {
      bitlyLinks.push(removeHttps(restaurant.deliverooObject.linkToTrack));
    }
    if (restaurant.justEatModel.linkToTrack) {
      bitlyLinks.push(removeHttps(restaurant.justEatModel.linkToTrack));
    }
    if (restaurant.uberEatsModel.linkToTrack) {
      bitlyLinks.push(removeHttps(restaurant.uberEatsModel.linkToTrack));
    }
    // loop though and call bitly api for data and package into json and return to client
    let currentMenu = await getBitlyData(bitlyLinks[0]);
    let deliveroo = await getBitlyData(bitlyLinks[1]);
    let justEat = await getBitlyData(bitlyLinks[2]);
    let uberEats = await getBitlyData(bitlyLinks[3]);
    let linkData = [];
    linkData.push(currentMenu);
    linkData.push(deliveroo);
    linkData.push(justEat);
    linkData.push(uberEats);
    // Return to client data
    if (linkData.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Data aggregated',
        data: linkData,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Data not aggregated',
        data: null,
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authorized',
      data: null,
    });
  }
};

function removeHttps(url) {
  let urlNoProtocol = url.replace(/^https?\:\/\//i, '');
  return urlNoProtocol;
}

const getBitlyData = async (url) => {
  return axios
    .get(`https://api-ssl.bitly.com/v4/bitlinks/${url}/clicks`, {
      headers: { Authorization: `Bearer ${process.env.BITLY_TOKEN}` },
    })
    .then((response) => {
      if (response.data) {
        return response.data;
      }
    })
    .catch((err) => {
      return err;
    });
};
