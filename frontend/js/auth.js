/**
 * auth.js - login, session, and token management
 */

const Auth = {
  // Store token after login
  setToken(token) {
    localStorage.setItem('identify-token', token);
  },

  getToken() {
    return localStorage.getItem('identify-token');
  },

  removeToken() {
    localStorage.removeItem('identify-token');
    localStorage.removeItem('identify-user');
  },

  setUser(user) {
    localStorage.setItem('identify-user', JSON.stringify(user));
  },

  getUser() {
    const u = localStorage.getItem('identify-user');
    return u ? JSON.parse(u) : null;
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  logout() {
    this.removeToken();
    window.location.href = 'index.html';
  },
};

window.Auth = Auth;
