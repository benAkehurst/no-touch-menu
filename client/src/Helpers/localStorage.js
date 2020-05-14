export function addUserToken(token) {
  window.localStorage.setItem('token', token);
  return true;
}

export function addUserId(id) {
  window.localStorage.setItem('userId', id);
  return true;
}

export function addRestaurantId(id) {
  window.localStorage.setItem('restaurantId', id);
  return true;
}

export function addAdminStatus(id) {
  window.localStorage.setItem('isAdmin');
  return true;
}

export function getUserToken() {
  return window.localStorage.getItem('token') || null;
}

export function getUserId() {
  return window.localStorage.getItem('userId') || null;
}

export function getRestaurantId() {
  return window.localStorage.getItem('restaurantId') || null;
}

export function getAdminStatus() {
  return window.localStorage.getItem('isAdmin') || null;
}

export function clearStorage() {
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('userId');
  window.localStorage.removeItem('restaurantId');
  window.localStorage.removeItem('isAdmin');
  return true;
}
