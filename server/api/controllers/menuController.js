'use strict';

const mongoose = require('mongoose');

const User = mongoose.model('User');
const Menu = mongoose.model('Menu');

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
