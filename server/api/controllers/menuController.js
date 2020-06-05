'use strict';
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const middleware = require('../../middlewares/middleware');
const User = mongoose.model('User');
const Menu = mongoose.model('Menu');
const Restaurant = mongoose.model('Restaurant');
const axios = require('axios');

/**
 * Gets all the menus in the DB
 * ADMIN PROCEDURE
 * GET
 * param: requesterId
 */
exports.view_all_menus = async (req, res) => {
  const requesterId = req.params.requesterId;

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
  if (isAdminCheck === undefined) {
    res.status(400).json({
      success: false,
      message: 'Error user',
      data: null,
    });
  }
  if (isAdminCheck) {
    Menu.find({}, (err, menus) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error getting all menus',
          data: err,
        });
      }
      if (!menus || menus === null) {
        res.status(400).json({
          success: false,
          message: 'Error getting all menus',
          data: err,
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'All menus found',
          data: menus,
        });
      }
    });
  }
};

/**
 * Gets current menus on restaurant in the DB
 * USER PROCEDURE
 * GET
 * param: token
 * param: requesterId
 */
exports.view_current_menu_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.params.restaurantId;

  if (!token || token === null || !restaurantId || restaurantId === null) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Paramters',
      data: null,
    });
  }

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
    Restaurant.findById(restaurantId, (err, restaurant) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error getting all menus',
          data: err,
        });
      }
      if (!restaurant || restaurant === null) {
        res.status(400).json({
          success: false,
          message: 'Error getting all menus',
          data: err,
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Current menu found',
          data: restaurant.currentMenu,
        });
      }
    });
  }
};

/**
 * Gets current menus on restaurant in the DB
 * ADMIN PROCEDURE
 * POST
 * param: requesterId
 * body: restaurantId
 */
exports.view_current_menu_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;
  if (
    !requesterId ||
    requesterId === null ||
    !restaurantId ||
    restaurantId === null
  ) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Paramters',
      data: null,
    });
  }

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'Error getting user',
        data: err,
      });
    }
    if (user === null) {
      return false;
    }
    if (user.isAdmin) {
      isAdminCheck = user.isAdmin;
    }
  });
  if (isAdminCheck === undefined) {
    res.status(400).json({
      success: false,
      message: 'Error user',
      data: null,
    });
  }
  if (isAdminCheck) {
    Restaurant.findById(restaurantId, (err, restaurant) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error getting all menus',
          data: err,
        });
      }
      if (!restaurant || restaurant === null) {
        res.status(400).json({
          success: false,
          message: 'Error getting all menus',
          data: err,
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Current menu found',
          data: restaurant.currentMenu,
        });
      }
    });
  }
};

/**
 * Gets current menu qr code
 * USER PROCEDURE
 * GET
 * param: token
 * param: requesterId
 */
exports.view_current_menu_qrcode_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.params.restaurantId;

  if (!token || token === null || !restaurantId || restaurantId === null) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Paramters',
      data: null,
    });
  }

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
    Restaurant.findById(restaurantId, (err, restaurant) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error getting all menus',
          data: err,
        });
      }
      if (!restaurant) {
        res.status(400).json({
          success: false,
          message: 'Error getting all menus',
          data: err,
        });
      }
      res.status(200).json({
        success: true,
        message: 'Current menu found',
        data: restaurant.currentMenu.qrCodeBase64,
      });
    });
  }
};

/**
 * Gets current menu qr code
 * ADMIN PROCEDURE
 * POST
 * param: requesterId
 * body: restaurantId
 */
exports.view_current_menu_qrcode_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;

  if (
    !requesterId ||
    requesterId === null ||
    !restaurantId ||
    restaurantId === null
  ) {
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
  if (isAdminCheck === undefined) {
    res.status(400).json({
      success: false,
      message: 'Error user',
      data: null,
    });
  }
  if (isAdminCheck) {
    Restaurant.findById(restaurantId, (err, restaurant) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error getting all menus',
          data: err,
        });
      }
      if (!restaurant) {
        res.status(400).json({
          success: false,
          message: 'Error getting all menus',
          data: err,
        });
      }
      res.status(200).json({
        success: true,
        message: 'Current menu found',
        data: restaurant.currentMenu.qrCodeBase64,
      });
    });
  }
};

/**
 * Gets current menu as pdf
 * USER PROCEDURE
 * GET
 * param: token
 * param: restaurantId
 */
exports.get_menu_pdf_user = async (req, res) => {
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
    // TRANSFORM RESTAUTRANT LOGO
    const result = await axios.get(currentRestaurant.restaurantLogo, {
      responseType: 'arraybuffer',
    });
    const logo = new Buffer.from(result.data, 'base64');
    // Config Elements
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': 'attachment; filename=QR_CODE_MENU.pdf',
    });
    const font = 'Helvetica-Bold';
    const explainerText =
      'Scan the QR code below to view the menu on your phone! ';
    const url = currentRestaurant.currentMenu.shortUrlLink;
    const urlNoProtocol = url.replace(/^https?\:\/\//i, '');
    const subText = `Or ${urlNoProtocol} if the QR code doesn't scan!`;

    // Create a document
    const doc = new PDFDocument();
    doc.pipe(res);
    // Creating PDF File
    doc
      // RESTAURANT LOGO
      .image(logo, 200, 10, { fit: [250, 150] })
      // RESTAURANT NAME
      .font(font)
      .fontSize(42)
      .moveDown(2)
      .text(currentRestaurant.restaurantName, {
        align: 'center',
        valign: 'center',
        height: 100,
        width: 465,
      })
      // QR EXPLAINER TEXT
      .font(font)
      .fontSize(32)
      .text(explainerText, {
        align: 'center',
        valign: 'center',
        height: 150,
        width: 465,
      })
      // SUB EXPLAINER TEXT
      .font(font)
      .fontSize(32)
      .text(subText, {
        align: 'center',
        valign: 'center',
        height: 100,
        width: 465,
      })
      // QR CODE
      .image(
        currentRestaurant.currentMenu.qrCodeBase64,
        (doc.page.width - 225) / 2
      );
    // Finalize making PDF file
    doc.end();
  }
};

/**
 * Gets current menu as pdf
 * ADMIN PROCEDURE
 * POST
 * param: requesterId
 * body: restaurantId
 */
exports.get_menu_pdf_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;

  if (
    !requesterId ||
    requesterId === null ||
    !restaurantId ||
    restaurantId === null
  ) {
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
  if (isAdminCheck === undefined) {
    res.status(400).json({
      success: false,
      message: 'Error user',
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
    // TRANSFORM RESTAUTRANT LOGO
    const result = await axios.get(currentRestaurant.restaurantLogo, {
      responseType: 'arraybuffer',
    });
    const logo = new Buffer.from(result.data, 'base64');
    // Config Elements
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': 'attachment; filename=QR_CODE_MENU.pdf',
    });
    const font = 'Helvetica-Bold';
    const explainerText =
      'Scan the QR code below to view the menu on your phone! ';
    const url = currentRestaurant.currentMenu.shortUrlLink;
    const urlNoProtocol = url.replace(/^https?\:\/\//i, '');
    const subText = `Or ${urlNoProtocol} if the QR code doesn't scan!`;

    // Create a document
    const doc = new PDFDocument();
    doc.pipe(res);
    // Creating PDF File
    doc
      // RESTAURANT LOGO
      .image(logo, 200, 10, { fit: [250, 150] })
      // RESTAURANT NAME
      .font(font)
      .fontSize(42)
      .moveDown(2)
      .text(currentRestaurant.restaurantName, {
        align: 'center',
        valign: 'center',
        height: 100,
        width: 465,
      })
      // QR EXPLAINER TEXT
      .font(font)
      .fontSize(32)
      .moveDown(1)
      .text(explainerText, {
        align: 'center',
        valign: 'center',
        height: 150,
        width: 465,
      })
      // SUB EXPLAINER TEXT
      .font(font)
      .fontSize(32)
      .text(subText, {
        align: 'center',
        valign: 'center',
        height: 100,
        width: 465,
      })
      // QR CODE
      .image(
        currentRestaurant.currentMenu.qrCodeBase64,
        (doc.page.width - 225) / 2
      );
    // Finalize making PDF file
    doc.end();
  }
};
