'use strict';

const mongoose = require('mongoose');

const middleware = require('../../middlewares/middleware');

const User = mongoose.model('User');
const Menu = mongoose.model('Menu');
const Restaurant = mongoose.model('Restaurant');

/**
 * Gets all the menus in the DB
 * ADMIN PROCEDURE
 * GET
 * param: requesterId
 */
exports.view_all_menus = async (req, res) => {
  const requesterId = req.params.requesterId;

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
    if (!user.isAdmin) {
      res.status(400).json({
        success: false,
        message: 'User not authorised for this action',
        data: err,
      });
    }
    if (user.isAdmin) {
      isAdminCheck = user.isAdmin;
    }
  });

  if (isAdminCheck) {
    Menu.find({}, (err, menus) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error getting all menus',
          data: err,
        });
      }
      res.status(200).json({
        success: true,
        message: 'All menus found',
        data: menus,
      });
    });
  }
};

/**
 * Gets current menus on restaurant in the DB
 * USER PROCEDURE
 * GET
 * param: token
 * param: requesterId
 */
exports.view_current_menu_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.params.restaurantId;

  let tokenValid;
  await middleware
    .checkToken(token)
    .then((promiseResponse) => {
      if (promiseResponse.success) {
        tokenValid = true;
      }
    })
    .catch((promiseError) => {
      if (promiseError) {
        return res.status(500).json({
          success: false,
          message: 'Bad Token',
          data: null,
        });
      }
    });
  if (tokenValid) {
    Restaurant.findById(restaurantId, (err, restaurant) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error getting all menus',
          data: err,
        });
      }
      res.status(200).json({
        success: true,
        message: 'Current menu found',
        data: restaurant.currentMenu,
      });
    });
  }
};

/**
 * Gets current menus on restaurant in the DB
 * ADMIN PROCEDURE
 * POST
 * param: requesterId
 * body: restaurantId
 */
exports.view_current_menu_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
    if (!user.isAdmin) {
      res.status(400).json({
        success: false,
        message: 'User not authorised for this action',
        data: err,
      });
    }
    if (user.isAdmin) {
      isAdminCheck = user.isAdmin;
    }
  });

  if (isAdminCheck) {
    Restaurant.findById(restaurantId, (err, restaurant) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error getting all menus',
          data: err,
        });
      }
      res.status(200).json({
        success: true,
        message: 'Current menu found',
        data: restaurant.currentMenu,
      });
    });
  }
};
