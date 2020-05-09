'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');

let middleware = require('../../middlewares/middleware');

const Restaurant = mongoose.model('Restaurant');
const User = mongoose.model('User');
const Menu = mongoose.model('Menu');

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
    });

    newRestaurant.save(newRestaurant, (err, restaurant) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: 'Error creating new restaurant',
          data: err,
        });
      }
      res.status(201).json({
        success: true,
        message: 'Restaurant created',
        data: restaurant,
      });
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
        }
        res.status(201).json({
          success: true,
          message: 'Restaurant updated',
          data: updatedRestaurant,
        });
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
        }
        res.status(201).json({
          success: true,
          message: 'Restaurant isActive status updated',
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
 * {
 *  restaurantId: 'string',
 *  menu: Object
 * }
 */
exports.add_menu_to_restaurant_restaurant_user = async (req, res) => {
  const token = req.params.token;
  const restaurantId = req.body.restaurantId;
  const menu = req.body.menu;

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
      let newMenu = new Menu({
        menuPdfLink: menu.menuPdfLink,
        shortUrlLink: menu.shortUrlLink,
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
              message: 'Menu added to current menu on restaurant',
              data: null,
            });
          }
        );
      });
    }
  }
};

/**
 * Adds a new menu to the array of menus as an admin
 * ADMIN PROCEDURE
 * POST
 * {
 *  restaurantId: 'string',
 *  menu: Object
 * }
 */
exports.add_menu_to_restaurant_restaurant_admin = async (req, res) => {
  const requesterId = req.params.requesterId;
  const restaurantId = req.body.restaurantId;
  const menu = req.body.menu;

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
    let newMenu = new Menu({
      menuPdfLink: menu.menuPdfLink,
      shortUrlLink: menu.shortUrlLink,
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
            message: 'Menu added to current menu on restaurant',
            data: null,
          });
        }
      );
    });
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
