'use strict';
const mongoose = require('mongoose');
const middleware = require('../../middlewares/middleware');
const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');
const Menu = mongoose.model('Menu');
const fetch = require('node-fetch');
const _ = require('lodash');
const QRCode = require('qrcode');

exports.add_deliveroo_link_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.body.restaurantId;
  const deliverooLink = req.body.deliverooLink;

  let tokenValid;
  await middleware
    .checkToken(token)
    .then((promiseResponse) => {
      if (promiseResponse.success) {
        tokenValid = true;
      }
    })
    .catch((promiseError) => {
      if (promiseError) {
        return res.status(500).json({
          success: false,
          message: 'Bad Token',
          data: null,
        });
      }
    });
  if (tokenValid) {
    let restaurantUser;
    await Restaurant.findById(restaurantId, (err, restaurant) => {
      if (restaurant.user._id) {
        restaurantUser = true;
      } else {
        res.status(400).json({
          success: false,
          message: 'User not authorised for this action',
          data: err,
        });
      }
    });
    if (restaurantUser) {
      const createShortLink = await fetch(
        'https://api-ssl.bitly.com/v4/shorten',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.BITLY_TOKEN}`,
            'content-type': 'application/json',
          },
          body: [JSON.stringify({ long_url: deliverooLink })],
        }
      );
      const shortenedLink = await createShortLink.json();
      const qrCode = await generateQRCode(deliverooLink);
      let newMenu = new Menu({
        menuPdfLink: deliverooLink,
        shortUrlLink: shortenedLink.link,
        qrCodeBase64: qrCode,
      });
      newMenu.save((err, menu) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Error creating new menu',
            data: err,
          });
        }
      });
      Restaurant.findByIdAndUpdate(
        restaurantId,
        { $set: { deliverooObject: newMenu } },
        (err, restaurant) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'Error adding new menu to restaurant',
              data: err,
            });
          } else {
            res.status(201).json({
              success: true,
              message: 'Menu updated successfully',
              data: restaurant,
            });
          }
        }
      );
    }
  }
};

/**
 * Generates a QR Code from a url string
 * @param {string} url
 */
const generateQRCode = async (url) => {
  return QRCode.toDataURL(url)
    .then((url) => {
      return url;
    })
    .catch((err) => {
      return err;
    });
};
