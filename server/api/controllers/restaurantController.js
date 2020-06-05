'use strict';
const mongoose = require('mongoose');
const middleware = require('../../middlewares/middleware');
const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');
const Menu = mongoose.model('Menu');
const _ = require('lodash');
const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const QRCode = require('qrcode');

AWS.config.update({ region: 'eu-west-2' });
const s3 = new AWS.S3({
  accessKeyId: process.env.BUCKET_ID,
  secretAccessKey: process.env.BUCKET_SECRET,
});

/**
 * Gets all the restaurants in the DB
 * ADMIN PROCEDURE
 * GET
 * param: requesterId
 */
exports.view_all_restaurants = async (req, res) => {
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
  if (isAdminCheck) {
    Restaurant.find({}, (err, restaurants) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error getting all restaurants',
          data: err,
        });
      }
      if (!restaurants || restaurants === null) {
        res.status(400).json({
          success: false,
          message: 'Error getting all restaurants',
          data: err,
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'All restaurants found',
          data: restaurants,
        });
      }
    });
  }
};

/**
 * Create a new Restaurant
 * ADMIN PROCEDURE
 * POST
 * {
 *  restaurantName: 'string',
 *  userId: 'user Id of restaurant user/owner',
 *  menus: 'blank array',
 *  isActive: true
 * }
 */
exports.create_new_restaurant = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantName = req.body.restaurantName;
  const userId = req.body.userId;
  const currentMenu = new Menu();
  const oldMenus = [];
  const isActive = req.body.isActive;

  if (!requesterId || requesterId === null) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Paramters',
      data: null,
    });
  }

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
    if (user === undefined || user === null) {
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
  if (isAdminCheck === undefined || !isAdminCheck) {
    res.status(400).json({
      success: false,
      message: 'Error user',
      data: null,
    });
  }
  if (isAdminCheck) {
    let userObj;
    await User.findById(userId, (err, user) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error finding user while making new restaurant',
          data: err,
        });
      }
      if (user) {
        userObj = _.pick(user.toObject(), [
          'name',
          'email',
          '_id',
          'userActive',
        ]);
      }
    });

    let newRestaurant = new Restaurant({
      restaurantName: restaurantName,
      user: userObj,
      currentMenu: currentMenu,
      oldMenus: oldMenus,
      isActive: isActive,
      deliverooObject: { data: null },
      justEatModel: { data: null },
      uberEatsModel: { data: null },
    });

    newRestaurant.save(newRestaurant, (err, restaurant) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error creating new restaurant',
          data: err,
        });
      } else {
        res.status(201).json({
          success: true,
          message: 'Restaurant created',
          data: restaurant,
        });
      }
    });
  }
};

/**
 * Change user who is assigned to the resturant
 * ADMIN PROCEDURE
 * POST
 * {
 *  restaurantId: 'string',
 *  newUserId: 'string'
 * }
 */
exports.change_user_assigned_to_restaurant = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;
  const newUserId = req.body.newUserId;

  if (!requesterId || requesterId === null) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Paramters',
      data: null,
    });
  }

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
    if (user === undefined || user === null) {
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
  if (isAdminCheck === undefined || !isAdminCheck) {
    res.status(400).json({
      success: false,
      message: 'Error user',
      data: null,
    });
  }
  if (isAdminCheck) {
    let newUser;
    await User.findById(newUserId, (err, user) => {
      if (!user) {
        res.status(400).json({
          success: false,
          message:
            'Error finding user while changing users assigned to restaurant',
          data: err,
        });
      }
      if (user) {
        newUser = _.pick(user.toObject(), [
          'name',
          'email',
          '_id',
          'userActive',
        ]);
      }
    });

    await User.findByIdAndUpdate(
      newUserId,
      { $set: { restaurantId: restaurantId } },
      (err, user) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Error updating user assigned to restaurant',
            data: err,
          });
        }
      }
    );

    Restaurant.updateOne(
      { _id: restaurantId },
      { $set: { user: newUser } },
      (err, updatedRestaurant) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Error updating user assigned to restaurant',
            data: err,
          });
        } else {
          res.status(201).json({
            success: true,
            message: 'Restaurant updated',
            data: updatedRestaurant,
          });
        }
      }
    );
  }
};

/**
 * Change the isActive status of a resturant
 * ADMIN PROCEDURE
 * POST
 * {
 *  restaurantId: 'string',
 *  newStatus: boolean
 * }
 */
exports.change_restaurant_isActive_status = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;
  const newStatus = req.body.newStatus;

  if (!requesterId || requesterId === null) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Paramters',
      data: null,
    });
  }

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
    if (user === undefined || user === null) {
      return false;
    }
    if (!user.isAdmin) {
      res.status(400).json({
        success: false,
        message: 'User not authorised for this action',
        data: err,
      });
      return false;
    }
    if (user.isAdmin) {
      return (isAdminCheck = user.isAdmin);
    }
  });
  if (isAdminCheck === undefined || !isAdminCheck) {
    res.status(400).json({
      success: false,
      message: 'Error user',
      data: null,
    });
  }
  if (isAdminCheck) {
    Restaurant.updateOne(
      { _id: restaurantId },
      { $set: { isActive: newStatus } },
      (err, updatedRestaurant) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Error updating isActive status restaurant',
            data: err,
          });
        } else {
          res.status(201).json({
            success: true,
            message: 'Restaurant isActive status updated',
            data: updatedRestaurant,
          });
        }
      }
    );
  }
};

/**
 * Change name of restaurant
 * ADMIN PROCEDURE
 * POST
 * {
 *  restaurantId: 'string',
 *  newRestaurantName: 'string'
 * }
 */
exports.edit_restaurant_name_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;
  const newRestaurantName = req.body.newRestaurantName;

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
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

  if (isAdminCheck) {
    Restaurant.findByIdAndUpdate(
      restaurantId,
      { restaurantName: newRestaurantName },
      (err, updatedRestaurant) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Error updating restaurant name',
            data: err,
          });
        }
        res.status(200).json({
          success: true,
          message: 'Restaurant name updated',
          data: updatedRestaurant,
        });
      }
    );
  }
};

/**
 * Change name of restaurant
 * USER PROCEDURE
 * POST
 * {
 *  restaurantId: 'string',
 *  newRestaurantName: 'string'
 * }
 */
exports.edit_restaurant_name_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.body.restaurantId;
  const newRestaurantName = req.body.newRestaurantName;

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
    Restaurant.findByIdAndUpdate(
      restaurantId,
      { restaurantName: newRestaurantName },
      (err, updatedRestaurant) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Error updating restaurant name',
            data: err,
          });
        }
        res.status(200).json({
          success: true,
          message: 'Restaurant name updated',
          data: updatedRestaurant,
        });
      }
    );
  }
};

/**
 * Adds a new menu to the array of menus
 * USER PROCEDURE
 * POST
 * Needs to be a form:
 * Form Field - restaurantId
 * Form Field - menuFile
 */
exports.add_menu_to_restaurant_restaurant_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.body.restaurantId;
  const menuFile = req.files.menuFile;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files were uploaded, try again.',
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
      let pdfS3Url = await uploadFile(
        menuFile,
        restaurantId,
        'menus',
        'application/pdf'
      )
        .then((error) => {
          res.status(400).json({
            success: false,
            message: 'Error uploading file to AWS',
            data: error,
          });
        })
        .catch((response) => {
          return response;
        });
      if (pdfS3Url) {
        const createShortLink = await fetch(
          'https://api-ssl.bitly.com/v4/shorten',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.BITLY_TOKEN}`,
              'content-type': 'application/json',
            },
            body: [JSON.stringify({ long_url: pdfS3Url })],
          }
        );
        const shortenedLink = await createShortLink.json();
        const qrCode = await generateQRCode(shortenedLink.link);
        let newMenu = new Menu({
          menuPdfLink: pdfS3Url,
          linkToTrack: shortenedLink.link,
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
          Restaurant.findById(restaurantId, (err, restaurant) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'Error adding new menu to restaurant',
                data: err,
              });
            }
            if (restaurant) {
              Restaurant.findByIdAndUpdate(
                restaurantId,
                {
                  $push: { oldMenus: restaurant.currentMenu },
                },
                (err, success) => {
                  if (err) {
                    res.status(400).json({
                      success: false,
                      message: 'Error adding old menu to old menus',
                      data: err,
                    });
                  }
                }
              );
            }
          });
          Restaurant.findByIdAndUpdate(
            restaurantId,
            { $set: { currentMenu: menu } },
            (err, restaurant) => {
              if (err) {
                res.status(400).json({
                  success: false,
                  message: 'Error adding new menu to restaurant',
                  data: err,
                });
              }
              res.status(201).json({
                success: true,
                message: 'Menu updated successfully',
                data: null,
              });
            }
          );
        });
      }
    }
  }
};

/**
 * Adds a new menu to the array of menus as an admin
 * ADMIN PROCEDURE
 * POST
 * Needs to be a form:
 * Form Field - restaurantId
 * Form Field - menuFile
 */
exports.add_menu_to_restaurant_restaurant_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;
  const menuFile = req.files.menuFile;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files were uploaded, try again.',
      data: null,
    });
  }

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
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

  if (isAdminCheck) {
    let pdfS3Url = await uploadFile(
      menuFile,
      restaurantId,
      'menus',
      'application/pdf'
    )
      .then((error) => {
        res.status(400).json({
          success: false,
          message: 'Error uploading file to AWS',
          data: error,
        });
      })
      .catch((response) => {
        return response;
      });
    if (pdfS3Url) {
      const createShortLink = await fetch(
        'https://api-ssl.bitly.com/v4/shorten',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.BITLY_TOKEN}`,
            'content-type': 'application/json',
          },
          body: [JSON.stringify({ long_url: pdfS3Url })],
        }
      );
      const shortenedLink = await createShortLink.json();
      const qrCode = await generateQRCode(shortenedLink.link);
      let newMenu = await new Menu({
        menuPdfLink: pdfS3Url,
        linkToTrack: shortenedLink.link,
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
        Restaurant.findById(restaurantId, (err, restaurant) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'Error adding new menu to restaurant',
              data: err,
            });
          }
          if (restaurant) {
            Restaurant.findByIdAndUpdate(
              restaurantId,
              {
                $push: { oldMenus: restaurant.currentMenu },
              },
              (err, success) => {
                if (err) {
                  res.status(400).json({
                    success: false,
                    message: 'Error adding old menu to old menus',
                    data: err,
                  });
                }
              }
            );
          }
        });
        Restaurant.findByIdAndUpdate(
          restaurantId,
          { $set: { currentMenu: menu } },
          (err, restaurant) => {
            if (err) {
              res.status(400).json({
                success: false,
                message: 'Error adding new menu to restaurant',
                data: err,
              });
            }
            res.status(201).json({
              success: true,
              message: 'Menu updated successfully',
              data: null,
            });
          }
        );
      });
    }
  }
};

/**
 * Allows a user to see all the menus on a restaurant
 * USER PROCEDURE
 * POST
 * {
 *  restaurantId: 'string'
 *  userId: 'string'
 * }
 */
exports.get_all_menus_from_restaurant_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.body.restaurantId;

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
      Restaurant.findById(restaurantId, (err, restaurant) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Error finding restaurant',
            data: err,
          });
        }
        let restaurantData = _.pick(restaurant.toObject(), [
          'currentMenu',
          'oldMenus',
        ]);
        res.status(200).json({
          success: true,
          message: 'Restaurant menus found',
          data: restaurantData,
        });
      });
    }
  }
};

/**
 * Allows a user to see all the menus on a restaurant
 * ADMIN PROCEDURE
 * POST
 * {
 *  restaurantId: 'string'
 * }
 */
exports.get_all_menus_from_restaurant_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
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

  if (isAdminCheck) {
    Restaurant.findById(restaurantId, (err, restaurant) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error finding restaurant menus',
          data: err,
        });
      }
      let restaurantData = _.pick(restaurant.toObject(), [
        'currentMenu',
        'oldMenus',
      ]);
      res.status(200).json({
        success: true,
        message: 'Restaurant menus found',
        data: restaurantData,
      });
    });
  }
};

/**
 * Allows a user to remove the current menu
 * USER PROCEDURE
 * POST
 * {
 *  restaurantId: 'string'
 *  userId: 'string'
 * }
 */
exports.remove_menu_from_restaurant_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.body.restaurantId;

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
      Restaurant.findByIdAndUpdate(
        restaurantId,
        { $set: { currentMenu: {} } },
        (err, success) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'Error finding restaurant menus',
              data: err,
            });
          }
          res.status(200).json({
            success: true,
            message: 'Menu deleted',
            data: null,
          });
        }
      );
    }
  }
};

/**
 * Allows an admin to remove a menu
 * ADMIN PROCEDURE
 * POST
 * {
 *  restaurantId: 'string'
 * }
 */
exports.remove_menu_from_restaurant_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
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

  if (isAdminCheck) {
    Restaurant.findByIdAndUpdate(
      restaurantId,
      { $set: { currentMenu: {} } },
      (err, success) => {
        if (err) {
          res.status(400).json({
            success: false,
            message: 'Error finding restaurant menus',
            data: err,
          });
        }
        res.status(200).json({
          success: true,
          message: 'Menu deleted',
          data: null,
        });
      }
    );
  }
};

/**
 * As an admin, if a restaurant is isActive = false, it will be deleted
 * ADMIN PROCEDURE
 * POST
 * {
 *  restaurantId: 'string'
 * }
 */
exports.delete_restaurant = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
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

  if (isAdminCheck) {
    Restaurant.findById(restaurantId, (err, restaurant) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error deleting restaurant - no restaurant found',
          data: err,
        });
      }
      if (restaurant.isActive) {
        res.status(400).json({
          success: false,
          message: 'Error deleting restaurant - restaurant is active',
          data: err,
        });
      }
      if (!restaurant.isActive) {
        Restaurant.findByIdAndDelete(restaurantId, (err, success) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'Error deleting restaurant',
              data: err,
            });
          } else if (success) {
            res.status(200).json({
              success: true,
              message: 'Restaurant deleted',
              data: null,
            });
          }
        });
      }
    });
  }
};

/**
 * Adds a logo to the restaurant model
 * ADMIN PROCEDURE
 * POST
 * Needs to be a form:
 * Form Field - restaurantId
 * Form Field - logoFile
 */
exports.upload_restaurant_logo_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;
  const logoFile = req.files.logoFile;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files were uploaded, try again.',
      data: null,
    });
  }

  let isAdminCheck;
  await User.findById(requesterId, (err, user) => {
    if (user === undefined || user === null) {
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
  if (isAdminCheck === undefined || !isAdminCheck) {
    res.status(400).json({
      success: false,
      message: 'Error user',
      data: null,
    });
  }
  if (isAdminCheck) {
    let imageS3Upload = await uploadFile(
      logoFile,
      restaurantId,
      'images',
      'image/jpg'
    )
      .then((error) => {
        res.status(400).json({
          success: false,
          message: 'Error uploading file to AWS',
          data: error,
        });
      })
      .catch((response) => {
        return response;
      });
    if (imageS3Upload) {
      Restaurant.findByIdAndUpdate(
        restaurantId,
        { restaurantLogo: imageS3Upload },
        (err, success) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'Error saving logo to restaurant model',
              data: err,
            });
          } else if (success) {
            res.status(201).json({
              success: true,
              message: 'Logo added to restaurant successfully',
              data: success,
            });
          }
        }
      );
    }
  }
};

/**
 * Adds a logo to the restaurant model
 * ADMIN PROCEDURE
 * POST
 * Needs to be a form:
 * Form Field - restaurantId
 * Form Field - logoFile
 */
exports.upload_restaurant_logo_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.body.restaurantId;
  const logoFile = req.files.logoFile;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files were uploaded, try again.',
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
    let imageS3Upload = await uploadFile(
      logoFile,
      restaurantId,
      'images',
      'image/jpg'
    )
      .then((error) => {
        res.status(400).json({
          success: false,
          message: 'Error uploading file to AWS',
          data: error,
        });
      })
      .catch((response) => {
        return response;
      });
    if (imageS3Upload) {
      Restaurant.findByIdAndUpdate(
        restaurantId,
        { restaurantLogo: imageS3Upload },
        (err, success) => {
          if (err) {
            res.status(400).json({
              success: false,
              message: 'Error saving logo to restaurant model',
              data: err,
            });
          }
          if (success) {
            res.status(201).json({
              success: true,
              message: 'Logo added to restaurant successfully',
              data: success,
            });
          }
        }
      );
    }
  }
};

/**
 * Gets a single restaurant
 * GET
 * params: restaurantId
 */
exports.get_single_restaurant = async (req, res) => {
  const restaurantId = req.params.restaurantId;
  if (!restaurantId || restaurantId === null) {
    res.status(400).json({
      success: false,
      message: 'Error finding restaurant',
      data: err,
    });
  }
  Restaurant.findById(restaurantId, (err, restaurant) => {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'Error finding restaurant',
        data: err,
      });
    } else if (!restaurant) {
      res.status(400).json({
        success: false,
        message: 'Error finding restaurant',
        data: err,
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Restaurant Found successfully',
        data: restaurant,
      });
    }
  });
};

/**
 * Used to upload files to S3 Buckets
 * @param {file} file
 * @param {string} restaurantId
 * @param {string} subfolder
 * @param {string} contenttype
 */
const uploadFile = async (file, restaurantId, subfolder, contenttype) => {
  const params = {
    Bucket: `${process.env.BUCKET_NAME}/${subfolder}`,
    Key: `${restaurantId}_${file.name}`,
    Body: file.data,
    ContentType: `${contenttype}`,
    ACL: 'public-read',
  };
  return new Promise((reject, resolve) => {
    s3.upload(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data.Location);
    });
  });
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
