'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenuSchema = new Schema(
  {
    menuPdfLink: {
      type: String,
    },
    linkToTrack: {
      type: String,
    },
    shortUrlLink: {
      type: String,
    },
    qrCodeBase64: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Menu', MenuSchema);
