const helpers = {
  addUserToken: function addUserToken(token) {
    window.localStorage.setItem('token', token);
    return true;
  },
  addUserId: function addUserId(id) {
    window.localStorage.setItem('userId', id);
    return true;
  },
  addRestaurantId: function addRestaurantId(id) {
    window.localStorage.setItem('restaurantId', id);
    return true;
  },
  addAdminStatus: function addAdminStatus(id) {
    window.localStorage.setItem('isAdmin', id);
    return true;
  },
  getUserToken: function getUserToken() {
    return window.localStorage.getItem('token') || null;
  },
  getUserId: function getUserId() {
    return window.localStorage.getItem('userId') || null;
  },
  getRestaurantId: function getRestaurantId() {
    return window.localStorage.getItem('restaurantId') || null;
  },
  getAdminStatus: function getAdminStatus() {
    return window.localStorage.getItem('isAdmin') || null;
  },
  clearStorage: function clearStorage() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('restaurantId');
    window.localStorage.removeItem('isAdmin');
    return true;
  },
};

export default helpers;
