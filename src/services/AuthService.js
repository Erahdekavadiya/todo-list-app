// AuthService.js
const AuthService = {
  login(username, password) {
    if (username === 'demo' && password === 'demo@123') {
        localStorage.setItem('loggedIn', 'true');
        return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem('loggedIn');
  },
  isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
  },
};

export default AuthService;
