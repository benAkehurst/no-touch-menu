'use strict';
const mongoose = require('mongoose');
const middleware = require('../../middlewares/middleware');
const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');
const Menu = mongoose.model('Menu');
const fetch = require('node-fetch');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const axios = require('axios');

/**
 * Adds a mealApp link to menu to the restaurant
 * USER PROCEDURE
 * POST
 * param: token
 * {
 *  restaurantId: 'string',
 *  service: 'string',
 *  serviceLink: 'string'
 *
 * }
 */
exports.add_link_mealApp_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.body.restaurantId;
  const service = req.body.service;
  const serviceLink = req.body.serviceLink;

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
        return res.status(400).json({
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
        res.status(401).json({
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
          body: [JSON.stringify({ long_url: serviceLink })],
        }
      );
      const shortenedLink = await createShortLink.json();
      const qrCode = await generateQRCode(serviceLink);
      let newMenu = new Menu({
        menuPdfLink: serviceLink,
        shortUrlLink: shortenedLink.link,
        qrCodeBase64: qrCode,
      });
      newMenu.save((err, menu) => {
        if (err) {
          res.status(404).json({
            success: false,
            message: 'Error saving Deliveroo Object',
            data: err,
          });
        }
      });
      switch (service) {
        case 'deliveroo':
          Restaurant.findByIdAndUpdate(
            restaurantId,
            { $set: { deliverooObject: newMenu } },
            (err, restaurant) => {
              if (err) {
                res.status(404).json({
                  success: false,
                  message: 'Error adding Deliveroo Data',
                  data: err,
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: 'Deliveroo data added successfully',
                  data: restaurant,
                });
              }
            }
          );
          break;
        case 'justEat':
          Restaurant.findByIdAndUpdate(
            restaurantId,
            { $set: { justEatModel: newMenu } },
            (err, restaurant) => {
              if (err) {
                res.status(404).json({
                  success: false,
                  message: 'Error adding Just Eat Data',
                  data: err,
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: 'Just Eat data added successfully',
                  data: restaurant,
                });
              }
            }
          );
          break;
        case 'uberEats':
          Restaurant.findByIdAndUpdate(
            restaurantId,
            { $set: { uberEatsModel: newMenu } },
            (err, restaurant) => {
              if (err) {
                res.status(404).json({
                  success: false,
                  message: 'Error adding Uber Eats Data',
                  data: err,
                });
              } else {
                res.status(200).json({
                  success: true,
                  message: 'Uber Eats data added successfully',
                  data: restaurant,
                });
              }
            }
          );
          break;
        default:
          break;
      }
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
 *  service: 'string',
 *  serviceLink: 'string'
 * }
 */
exports.add_link_mealApp_admin = async (req, res) => {
  const requesterId = req.body.requesterId;
  const restaurantId = req.body.restaurantId;
  const service = req.body.service;
  const serviceLink = req.body.serviceLink;

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
        body: [JSON.stringify({ long_url: serviceLink })],
      }
    );
    const shortenedLink = await createShortLink.json();
    const qrCode = await generateQRCode(serviceLink);
    let newMenu = new Menu({
      menuPdfLink: serviceLink,
      shortUrlLink: shortenedLink.link,
      qrCodeBase64: qrCode,
    });
    newMenu.save((err, menu) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: 'Error saving new menu Object',
          data: err,
        });
      }
    });
    switch (service) {
      case 'deliveroo':
        Restaurant.findByIdAndUpdate(
          restaurantId,
          { $set: { deliverooObject: newMenu } },
          (err, restaurant) => {
            if (err) {
              res.status(404).json({
                success: false,
                message: 'Error adding deliveroo Data',
                data: err,
              });
            } else {
              res.status(200).json({
                success: true,
                message: 'Deliveroo data added successfully',
                data: restaurant,
              });
            }
          }
        );
        break;
      case 'justEat':
        Restaurant.findByIdAndUpdate(
          restaurantId,
          { $set: { justEatModel: newMenu } },
          (err, restaurant) => {
            if (err) {
              res.status(404).json({
                success: false,
                message: 'Error adding just eat Data',
                data: err,
              });
            } else {
              res.status(200).json({
                success: true,
                message: 'just eat data added successfully',
                data: restaurant,
              });
            }
          }
        );
        break;
      case 'uberEats':
        Restaurant.findByIdAndUpdate(
          restaurantId,
          { $set: { uberEatsModel: newMenu } },
          (err, restaurant) => {
            if (err) {
              res.status(404).json({
                success: false,
                message: 'Error adding uber eats Data',
                data: err,
              });
            } else {
              res.status(200).json({
                success: true,
                message: 'uber eats data added successfully',
                data: restaurant,
              });
            }
          }
        );
        break;
      default:
        break;
    }
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
          message: 'Error finding restaurant',
          data: err,
        });
      }
      if (!restaurant) {
        res.status(500).json({
          success: false,
          message: 'Error finding restaurant',
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
      // RESTAURANT LOGO
      .image(logo, 200, 10, { fit: [250, 150] })
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
      .image(
        currentRestaurant.currentMenu.qrCodeBase64,
        (doc.page.width - 200) / 2
      );
    // Finalize making PDF file
    doc.end();
  }
};

/**
 * Gets deliverro menu as pdf
 * ADMIN PROCEDURE
 * GET
 * param: requesterId
 * param: restaurantId
 */
exports.get_deliveroo_PDF_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.params.restaurantId;

  if (!requesterId || requesterId === null) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Paramters',
      data: null,
    });
  }

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Error getting user',
        data: err,
      });
    }
    if (user === undefined || user === null) {
      return false;
    }
    if (user.isAdmin) {
      isAdminCheck = user.isAdmin;
    }
  });
  if (isAdminCheck === undefined || !isAdminCheck) {
    res.status(500).json({
      success: false,
      message: 'Error user',
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

  if (isAdminCheck) {
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
      .image(
        currentRestaurant.currentMenu.qrCodeBase64,
        (doc.page.width - 200) / 2
      );
    // Finalize making PDF file
    doc.end();
  }
};

/**
 * Gets justEat menu as pdf
 * USER PROCEDURE
 * GET
 * param: token
 * param: requesterId
 */
exports.get_justEat_PDF_user = async (req, res) => {
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
      'Content-Disposition': 'attachment; filename=JUSTEAT_QR_CODE_MENU.pdf',
    });
    const font = 'Helvetica-Bold';
    const explainerText = 'Scan the QR code below to see us on Deliveroo! ';
    const url = currentRestaurant.justEatModel.shortUrlLink;
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
      .image(
        currentRestaurant.currentMenu.qrCodeBase64,
        (doc.page.width - 200) / 2
      );
    // Finalize making PDF file
    doc.end();
  }
};

/**
 * Gets justEat menu as pdf
 * ADMIN PROCEDURE
 * GET
 * param: requesterId
 * param: restaurantId
 */
exports.get_justEat_PDF_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.params.restaurantId;

  if (!requesterId || requesterId === null) {
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
    if (user === undefined || user === null) {
      return false;
    }
    if (user.isAdmin) {
      isAdminCheck = user.isAdmin;
    }
  });
  if (isAdminCheck === undefined || !isAdminCheck) {
    res.status(400).json({
      success: false,
      message: 'Error user',
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

  if (isAdminCheck) {
    // Config Elements
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': 'attachment; filename=JUSTEAT_QR_CODE_MENU.pdf',
    });
    const font = 'Helvetica-Bold';
    const explainerText = 'Scan the QR code below to see us on Deliveroo! ';
    const url = currentRestaurant.justEatModel.shortUrlLink;
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
      .image(
        currentRestaurant.currentMenu.qrCodeBase64,
        (doc.page.width - 200) / 2
      );
    // Finalize making PDF file
    doc.end();
  }
};

/**
 * Gets uberEats menu as pdf
 * USER PROCEDURE
 * GET
 * param: token
 * param: requesterId
 */
exports.get_uberEats_PDF_user = async (req, res) => {
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
      'Content-Disposition': 'attachment; filename=UBEREATS_QR_CODE_MENU.pdf',
    });
    const font = 'Helvetica-Bold';
    const explainerText = 'Scan the QR code below to see us on Deliveroo! ';
    const url = currentRestaurant.uberEatsModel.shortUrlLink;
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
      .image(
        currentRestaurant.currentMenu.qrCodeBase64,
        (doc.page.width - 200) / 2
      );
    // Finalize making PDF file
    doc.end();
  }
};

/**
 * Gets uberEats menu as pdf
 * ADMIN PROCEDURE
 * GET
 * param: requesterId
 * param: restaurantId
 */
exports.get_uberEats_PDF_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.params.restaurantId;

  if (!requesterId || requesterId === null) {
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
    if (user === undefined || user === null) {
      return false;
    }
    if (user.isAdmin) {
      isAdminCheck = user.isAdmin;
    }
  });
  if (isAdminCheck === undefined || !isAdminCheck) {
    res.status(400).json({
      success: false,
      message: 'Error user',
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

  if (isAdminCheck) {
    // Config Elements
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': 'attachment; filename=JUSTEAT_QR_CODE_MENU.pdf',
    });
    const font = 'Helvetica-Bold';
    const explainerText = 'Scan the QR code below to see us on Deliveroo! ';
    const url = currentRestaurant.uberEatsModel.shortUrlLink;
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
      .image(
        currentRestaurant.currentMenu.qrCodeBase64,
        (doc.page.width - 200) / 2
      );
    // Finalize making PDF file
    doc.end();
  }
};

/**
 * Gets current menu qr code
 * USER PROCEDURE
 * GET
 * param: token
 * param: requesterId
 */
exports.get_takeaway_qrcode_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.params.restaurantId;
  const service = req.params.service;

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
      switch (service) {
        case 'deliveroo':
          res.status(200).json({
            success: true,
            message: 'Current QR Code found',
            data: restaurant.deliverooObject.qrCodeBase64,
          });
          break;
        case 'justEat':
          res.status(200).json({
            success: true,
            message: 'Current QR Code found',
            data: restaurant.justEatModel.qrCodeBase64,
          });
          break;
        case 'uberEats':
          res.status(200).json({
            success: true,
            message: 'Current QR Code found',
            data: restaurant.uberEatsModel.qrCodeBase64,
          });
          break;
        default:
          break;
      }
    });
  }
};

/**
 * Gets current menu qr code
 * ADMIN PROCEDURE
 * POST
 * param: requesterId
 * body: restaurantId
 * body: service
 */
exports.get_takeaway_qrcode_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;
  const service = req.body.service;

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
      switch (service) {
        case 'deliveroo':
          res.status(200).json({
            success: true,
            message: 'Current QR Code found',
            data: restaurant.deliverooObject.qrCodeBase64,
          });
          break;
        case 'justEat':
          res.status(200).json({
            success: true,
            message: 'Current QR Code found',
            data: restaurant.justEatModel.qrCodeBase64,
          });
          break;
        case 'uberEats':
          res.status(200).json({
            success: true,
            message: 'Current QR Code found',
            data: restaurant.uberEatsModel.qrCodeBase64,
          });
          break;
        default:
          break;
      }
    });
  }
};

/**
 * Removes a meal app option on a restaurant
 * USER PROCEDURE
 * POST
 * param: token
 * body: restaurantId
 * body: service
 */
exports.remove_meal_app_object_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.body.restaurantId;
  const service = req.body.service;

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
    switch (service) {
      case 'deliveroo':
        Restaurant.findByIdAndUpdate(
          restaurantId,
          { $set: { deliverooObject: { data: null } } },
          (err, restaurant) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'Error getting restaurant',
                data: err,
              });
            }
            if (!restaurant) {
              res.status(400).json({
                success: false,
                message: 'Error getting restaurant',
                data: err,
              });
            } else {
              res.status(200).json({
                success: true,
                message: 'Deliveroo Link deleted',
                data: null,
              });
            }
          }
        );
        break;
      case 'justEat':
        Restaurant.findByIdAndUpdate(
          restaurantId,
          { $set: { justEatModel: { data: null } } },
          (err, restaurant) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'Error getting restaurant',
                data: err,
              });
            }
            if (!restaurant) {
              res.status(400).json({
                success: false,
                message: 'Error getting restaurant',
                data: err,
              });
            } else {
              res.status(200).json({
                success: true,
                message: 'Just Eat Link deleted',
                data: null,
              });
            }
          }
        );
        break;
      case 'uberEats':
        Restaurant.findByIdAndUpdate(
          restaurantId,
          { $set: { uberEatsModel: { data: null } } },
          (err, restaurant) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'Error getting restaurant',
                data: err,
              });
            }
            if (!restaurant) {
              res.status(400).json({
                success: false,
                message: 'Error getting restaurant',
                data: err,
              });
            } else {
              res.status(200).json({
                success: true,
                message: 'Uber Eats Link deleted',
                data: null,
              });
            }
          }
        );
        break;
      default:
        break;
    }
  }
};

/**
 * Removes a meal app option on a restaurant
 * ADMIN PROCEDURE
 * POST
 * param: requesterId
 * body: restaurantId
 * body: service
 */
exports.remove_meal_app_object_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;
  const service = req.body.service;

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
    switch (service) {
      case 'deliveroo':
        Restaurant.findByIdAndUpdate(
          restaurantId,
          { $set: { deliverooObject: {} } },
          (err, restaurant) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'Error getting restaurant',
                data: err,
              });
            }
            if (!restaurant) {
              res.status(400).json({
                success: false,
                message: 'Error getting restaurant',
                data: err,
              });
            } else {
              res.status(200).json({
                success: true,
                message: 'Deliveroo Link deleted',
                data: null,
              });
            }
          }
        );
        break;
      case 'justEat':
        Restaurant.findByIdAndUpdate(
          restaurantId,
          { $set: { justEatModel: {} } },
          (err, restaurant) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'Error getting restaurant',
                data: err,
              });
            }
            if (!restaurant) {
              res.status(400).json({
                success: false,
                message: 'Error getting restaurant',
                data: err,
              });
            } else {
              res.status(200).json({
                success: true,
                message: 'Just Eat Link deleted',
                data: null,
              });
            }
          }
        );
        break;
      case 'uberEats':
        Restaurant.findByIdAndUpdate(
          restaurantId,
          { $set: { uberEatsModel: {} } },
          (err, restaurant) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'Error getting restaurant',
                data: err,
              });
            }
            if (!restaurant) {
              res.status(400).json({
                success: false,
                message: 'Error getting restaurant',
                data: err,
              });
            } else {
              res.status(200).json({
                success: true,
                message: 'Uber Eats Link deleted',
                data: null,
              });
            }
          }
        );
        break;
      default:
        break;
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
