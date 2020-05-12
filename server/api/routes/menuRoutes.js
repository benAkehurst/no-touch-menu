'use strict';

module.exports = (app) => {
  const menuController = require('../controllers/menuController');

  app
    .route('/api/menus/view-all-menus/:requesterId')
    .get(menuController.view_all_menus);
  app
    .route('/api/menus/view-current-menu-user/:token/:restaurantId')
    .get(menuController.view_current_menu_user);
  app
    .route('/api/menus/view-current-menu-admin/:requesterId')
    .post(menuController.view_current_menu_admin);
};
