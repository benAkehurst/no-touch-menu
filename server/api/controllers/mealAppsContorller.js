'use strict';
const mongoose = require('mongoose');
const middleware = require('../../middlewares/middleware');
const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');
const Menu = mongoose.model('Menu');
const fetch = require('node-fetch');
const _ = require('lodash');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');

/**
 * Adds a deliveroo menu to the restaurant
 * USER PROCEDURE
 * POST
 * param: token
 * {
 *  restaurantId: 'string',
 *  deliverooLink: 'string'
 * }
 */
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
            message: 'Error saving Deliveroo Object',
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
              message: 'Error adding Deliveroo Data',
              data: err,
            });
          } else {
            res.status(201).json({
              success: true,
              message: 'Deliveroo data added successfully',
              data: restaurant,
            });
          }
        }
      );
    }
  }
};

/**
 * Adds a deliveroo menu to the restaurant
 * USER PROCEDURE
 * POST
 * {
 *  requesterId: 'string',
 *  restaurantId: 'string',
 *  deliverooLink: 'string'
 * }
 */
exports.add_deliveroo_link_admin = async (req, res) => {
  const requesterId = req.body.requesterId;
  const restaurantId = req.body.restaurantId;
  const deliverooLink = req.body.deliverooLink;

  if (!requesterId || requesterId === null) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Paramters',
      data: null,
    });
  }
  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
    if (user === null) {
      return false;
    }
    if (user.isAdmin) {
      isAdminCheck = user.isAdmin;
    }
  });

  if (isAdminCheck) {
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
          message: 'Error saving Deliveroo Object',
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
            message: 'Error adding Deliveroo Data',
            data: err,
          });
        } else {
          res.status(201).json({
            success: true,
            message: 'Deliveroo data added successfully',
            data: restaurant,
          });
        }
      }
    );
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authorized',
      data: null,
    });
  }
};

/**
 * Gets deliverro menu as pdf
 * USER PROCEDURE
 * GET
 * param: token
 * param: requesterId
 */
exports.get_deliveroo_PDF_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.params.restaurantId;

  if (!token || token === null || !restaurantId || restaurantId === null) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Paramters',
      data: null,
    });
  }

  let currentRestaurant = await Restaurant.findById(
    restaurantId,
    (err, restaurant) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: 'Error finding restaurent',
          data: err,
        });
      }
      if (!restaurant) {
        res.status(400).json({
          success: false,
          message: 'Error finding restaurent',
          data: err,
        });
      }
      return restaurant;
    }
  );

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
    // Config Elements
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': 'attachment; filename=DELIVEROO_QR_CODE_MENU.pdf',
    });
    const font = 'Helvetica-Bold';
    const explainerText = 'Scan the QR code below to see us on Deliveroo! ';
    const url = currentRestaurant.deliverooObject.shortUrlLink;
    const urlNoProtocol = url.replace(/^https?\:\/\//i, '');
    const subText = `Or ${urlNoProtocol} if the QR code doesn't scan!`;

    // Create a document
    const doc = new PDFDocument();
    doc.pipe(res);
    // Creating PDF File
    doc
      // RESTAURANT NAME
      .font(font)
      .fontSize(42)
      .text(currentRestaurant.restaurantName, {
        align: 'center',
        valign: 'center',
        height: 200,
        width: 465,
      })
      // QR EXPLAINER TEXT
      .font(font)
      .fontSize(36)
      .text(explainerText, {
        align: 'center',
        valign: 'center',
        height: 100,
        width: 465,
      })
      // SUB EXPLAINER TEXT
      .font(font)
      .fontSize(30)
      .text(subText, {
        align: 'center',
        valign: 'center',
        height: 100,
        width: 465,
      })
      // QR CODE
      .image(currentRestaurant.deliverooObject.qrCodeBase64, {
        width: 400,
        height: 400,
      });
    // Finalize making PDF file
    doc.end();
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
