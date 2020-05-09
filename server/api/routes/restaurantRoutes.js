'use strict';
module.exports = (app) => {
  const restaurantController = require('../controllers/restaurantController');

  app
    .route('/api/restaurant/create-new-restaurant/:requesterId')
    .post(restaurantController.create_new_restaurant);
  app
    .route('/api/restaurant/change-user-assigned-to-restaurant/:requesterId')
    .post(restaurantController.change_user_assigned_to_restaurant);
  app
    .route('/api/restaurant/change-restaurant-isActive-status/:requesterId')
    .post(restaurantController.change_restaurant_isActive_status);
};
