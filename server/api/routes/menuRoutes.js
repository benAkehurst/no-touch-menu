'use strict';

module.exports = (app) => {
  const menuController = require('../controllers/menuController');

  app
    .route('/api/menus/view-all-menus/:requesterId')
    .get(menuController.view_all_menus);
};
