import { $ } from "@wdio/globals";
import Page from "./page.js";

class LoginPage extends Page {
  get inputEmail() {
    return $("#email");
  }
  get inputPassword() {
    return $("#password");
  }
  get btnSubmit() {
    return $('[data-test="login-submit"]');
  }
  get pageTitle() {
    return $('h1[data-test="page-title"]');
  }
  get linkRegister() {
    return $('[data-test="register-link"]');
  }

  async login(email, password) {
    await this.inputEmail.waitForDisplayed();
    await this.inputEmail.setValue(email);
    await this.inputPassword.setValue(password);
    await this.btnSubmit.click();
  }
  async goToRegistration() {
    await this.linkRegister.waitForDisplayed();
    await this.linkRegister.click();
  }
  open() {
    return super.open("auth/login");
  }
}
export default new LoginPage();
