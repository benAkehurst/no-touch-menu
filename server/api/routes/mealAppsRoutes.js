'use strict';
module.exports = (app) => {
  const mealAppsContorller = require('../controllers/mealAppsContorller');
  app
    .route('/api/mealApps/add_deliveroo_link_user/:token')
    .post(mealAppsContorller.add_deliveroo_link_user);
  app
    .route('/api/mealApps/add_deliveroo_link_admin')
    .post(mealAppsContorller.add_deliveroo_link_admin);
};
