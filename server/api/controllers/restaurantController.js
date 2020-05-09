'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');

const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');
const Menu = mongoose.model('Menu');

/**
 * Create a new Restaurant
 * POST
 * {
 *  restaurantName: 'string',
 *  userId: 'user object of restaurant user',
 *  menus: 'blank array',
 *  isActive: true
 * }
 */
exports.create_new_restaurant = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantName = req.body.restaurantName;
  const userId = req.body.userId;
  const menus = [];
  const isActive = req.body.isActive;

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
    let userObj;
    await User.findById(userId, (err, user) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error finding user while making new restaurant',
          data: err,
        });
      }
      if (user) {
        userObj = _.pick(user.toObject(), [
          'name',
          'email',
          '_id',
          'userActive',
        ]);
      }
    });

    let newRestaurant = new Restaurant({
      restaurantName: restaurantName,
      user: userObj,
      menus: menus,
      isActive: isActive,
    });

    newRestaurant.save(newRestaurant, (err, restaurant) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error creating new restaurant',
          data: err,
        });
      }
      res.status(201).json({
        success: true,
        message: 'Restaurant created',
        data: restaurant,
      });
    });
  }
};
