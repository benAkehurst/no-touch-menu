'use strict';
module.exports = (app) => {
  const mealAppsContorller = require('../controllers/mealAppsContorller');
  app.route('/api/mealApps/ping').get(mealAppsContorller.ping);
};
