'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
  {
    restaurantName: {
      type: String,
    },
    restaurantLogo: {
      type: String,
    },
    user: {
      type: Object,
    },
    currentMenu: {
      type: Object,
    },
    oldMenus: {
      type: Array,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', RestaurantSchema);
