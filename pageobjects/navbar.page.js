class Navbar {
  get signInLink() {
    return $('[data-test="nav-sign-in"]');
  }
  get userMenuDropdown() {
    return $('[data-test="nav-menu"]');
  }
  get myAccountOption() {
    return $('[data-test="nav-my-account"]');
  }
  get homeLink() {
    return $('[data-test="nav-home"]');
  }
  get cartBadge() {
    return $('[data-test="cart-quantity"]');
  }
  get myFavoritesOption() {
    return $('[data-test="nav-my-favorites"]');
  }

  async goToLogin() {
    await this.signInLink.waitForDisplayed();
    await this.signInLink.click();
  }

  async goToMyAccount() {
    await this.userMenuDropdown.waitForDisplayed();
    await this.userMenuDropdown.click();
    await this.myAccountOption.waitForDisplayed();
    await this.myAccountOption.click();
  }

  async getCartQuantity() {
    await this.cartBadge.waitForDisplayed();
    return this.cartBadge.getText();
  }

  async goToCart() {
    await this.cartBadge.waitForDisplayed();
    await this.cartBadge.click();
  }

  async goToMyFavorites() {
    await this.userMenuDropdown.waitForDisplayed();
    await this.userMenuDropdown.click();

    await this.myFavoritesOption.waitForDisplayed();
    await this.myFavoritesOption.click();
  }
}
export default new Navbar();
