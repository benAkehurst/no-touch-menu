'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
  {
    restaurantName: {
      type: String,
    },
    user: {
      type: Object,
    },
    menus: {
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
