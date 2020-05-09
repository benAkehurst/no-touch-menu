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
  app
    .route('/api/restaurant/add-menu-to-restaurant-user/:token')
    .post(restaurantController.add_menu_to_restaurant_restaurant_user);
  app
    .route('/api/restaurant/add-menu-to-restaurant-admin/:requesterId')
    .post(restaurantController.add_menu_to_restaurant_restaurant_admin);
  app
    .route('/api/restaurant/get-all-menus-user/:token')
    .post(restaurantController.get_all_menus_from_restaurant_user);
  app
    .route('/api/restaurant/get-all-menus-admin/:requesterId')
    .post(restaurantController.get_all_menus_from_restaurant_admin);
  app
    .route('/api/restaurant/remove-menu-from-restaurant-user/:token')
    .post(restaurantController.remove_menu_from_restaurant_user);
  app
    .route('/api/restaurant/remove-menu-from-restaurant-admin/:requesterId')
    .post(restaurantController.remove_menu_from_restaurant_admin);
  app
    .route('/api/restaurant/delete-restaurant/:requesterId')
    .post(restaurantController.delete_restaurant);
};
