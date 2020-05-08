'use strict';

const mongoose = require('mongoose');

const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');
const Menu = mongoose.model('Menu');

/**
 * Create a new Restaurant
 * POST
 * {
 *  restaurantName: 'string',
 *  user: 'user object of restaurant user',
 *  menus: 'blank array',
 *  isActive: true
 * }
 */

exports.create_new_restaurant = (req, res) => {
  /**
   * Pseudo flow
   * Check if requester is admin,
   * if yes, they can make a new restaurant in db
   * takes post data and
   */
};
