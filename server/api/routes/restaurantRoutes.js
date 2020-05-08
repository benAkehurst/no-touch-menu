'use strict';
module.exports = (app) => {
  const restaurantController = require('../controllers/restaurantController');

  app
    .route('/api/restaurant/create-new-restaurant/:requesterId')
    .post(restaurantController.create_new_restaurant);
};
