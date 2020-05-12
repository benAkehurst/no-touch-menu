'use strict';

const mongoose = require('mongoose');

const User = mongoose.model('User');
const Restaurant = mongoose.model('Restaurant');
const Menu = mongoose.model('Menu');

const generateQrCode = require('../../middlewares/qrCode');

exports.generate_qr_code = (req, res) => {
  console.log(generateQrCode.createQrCode());
};
