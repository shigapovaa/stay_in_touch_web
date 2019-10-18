import {
  decorate, observable, action, computed,
} from 'mobx';

class AuthStore {
  token = null;

  userData = null;

  setToken = (token) => {
    this.token = token;
  }

  resetToken = () => {
    this.token = null;
  }

  setUserData = ({
    firstName, lastName, email, username, id, photoUrl,
  }) => {
    this.userData = {
      username,
      email,
      firstName,
      lastName,
      id,
      photoUrl,
    };
  }

  resetUserData = () => { this.userData = null; }

  get isAuth() {
    return !!this.token;
  }
}

decorate(AuthStore, {
  token: observable,
  userData: observable,
  setToken: action,
  setUserData: action,
  resetToken: action,
  resetUserData: action,
  isAuth: computed,
});

const authStore = new AuthStore();

export default authStore;
