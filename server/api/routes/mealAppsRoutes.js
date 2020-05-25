'use strict';
module.exports = (app) => {
  const mealAppsContorller = require('../controllers/mealAppsContorller');
  app
    .route('/api/mealApps/add-deliveroo-link-user/:token')
    .post(mealAppsContorller.add_deliveroo_link_user);
  app
    .route('/api/mealApps/add-deliveroo-link-admin')
    .post(mealAppsContorller.add_deliveroo_link_admin);
  app
    .route('/api/mealApps/get-deliveroo-PDF-user/:token/:restaurantId')
    .get(mealAppsContorller.get_deliveroo_PDF_user);
  app
    .route('/api/mealApps/get-deliveroo-PDF-admin/:requesterId/:restaurantId')
    .get(mealAppsContorller.get_deliveroo_PDF_admin);
  app
    .route('/api/mealApps/add-justEat-link-user/:token')
    .post(mealAppsContorller.add_justEat_link_user);
  app
    .route('/api/mealApps/add-justEat-link-admin')
    .post(mealAppsContorller.add_justEat_link_admin);
  app
    .route('/api/mealApps/get-justEat-PDF-user/:token/:restaurantId')
    .get(mealAppsContorller.get_justEat_PDF_user);
  app
    .route('/api/mealApps/get-justEat-PDF-admin/:requesterId/:restaurantId')
    .get(mealAppsContorller.get_justEat_PDF_admin);
};
