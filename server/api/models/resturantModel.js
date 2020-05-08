'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./userModel');

const ResturantSchema = new Schema(
  {
    user: {
      type: User,
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

module.exports = mongoose.model('Resturant', ResturantSchema);
