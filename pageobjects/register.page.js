import Page from "./page.js";

class RegisterPage extends Page {
  get inputFirstName() {
    return $("#first_name");
  }
  get inputLastName() {
    return $("#last_name");
  }
  get inputDob() {
    return $("#dob");
  }
  get inputAddress() {
    return $("#street");
  }
  get inputPostcode() {
    return $("#postal_code");
  }
  get inputCity() {
    return $("#city");
  }
  get inputState() {
    return $("#state");
  }
  get selectCountry() {
    return $("#country");
  }
  get inputPhone() {
    return $("#phone");
  }
  get inputEmail() {
    return $("#email");
  }
  get inputPassword() {
    return $("#password");
  }
  get btnSubmit() {
    return $('[data-test="register-submit"]');
  }

  async registerUser(userData) {
    await this.inputFirstName.waitForDisplayed();

    await this.inputFirstName.setValue(userData.firstName);
    await this.inputLastName.setValue(userData.lastName);
    await this.inputDob.setValue(userData.dob);
    await this.inputAddress.setValue(userData.address);
    await this.inputPostcode.setValue(userData.postcode);
    await this.inputCity.setValue(userData.city);
    await this.inputState.setValue(userData.state);

    await this.selectCountry.selectByVisibleText(userData.country);

    await this.inputPhone.setValue(userData.phone);
    await this.inputEmail.setValue(userData.email);
    await this.inputPassword.setValue(userData.password);

    await this.btnSubmit.waitForClickable();
    await this.btnSubmit.click();
  }

  open() {
    return super.open("/auth/register");
  }
}

export default new RegisterPage();
