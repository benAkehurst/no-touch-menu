'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuSchema = new Schema(
  {
    menuPdfLink: {
      type: String,
    },
    shortUrlLink: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Menu', MenuSchema);
