'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');

const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');
const Menu = mongoose.model('Menu');

/**
 * Create a new Restaurant
 * ADMIN PROCEDURE
 * POST
 * {
 *  restaurantName: 'string',
 *  userId: 'user Id of restaurant user/owner',
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

/**
 * Change user who is assigned to the resturant
 * ADMIN PROCEDURE
 * POST
 * {
 *  restaurantId: 'string',
 *  newUserId: 'string'
 * }
 */
exports.change_user_assigned_to_restaurant = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;
  const newUserId = req.body.newUserId;

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
    let newUser;
    await User.findById(newUserId, (err, user) => {
      if (!user) {
        res.status(400).json({
          success: false,
          message:
            'Error finding user while changing users assigned to restaurant',
          data: err,
        });
      }
      if (user) {
        newUser = _.pick(user.toObject(), [
          'name',
          'email',
          '_id',
          'userActive',
        ]);
      }
    });

    Restaurant.updateOne(
      { _id: restaurantId },
      { $set: { user: newUser } },
      (err, updatedRestaurant) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Error updating user assigned to restaurant',
            data: err,
          });
        }
        res.status(201).json({
          success: true,
          message: 'Restaurant updated',
          data: updatedRestaurant,
        });
      }
    );
  }
};

/**
 * Change the isActive status of a resturant
 * ADMIN PROCEDURE
 * POST
 * {
 *  restaurantId: 'string',
 *  newStatus: boolean
 * }
 */
exports.change_restaurant_isActive_status = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;
  const newStatus = req.body.newStatus;

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
    Restaurant.updateOne(
      { _id: restaurantId },
      { $set: { isActive: newStatus } },
      (err, updatedRestaurant) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Error updating isActive status restaurant',
            data: err,
          });
        }
        res.status(201).json({
          success: true,
          message: 'Restaurant isActive status updated',
          data: updatedRestaurant,
        });
      }
    );
  }
};
