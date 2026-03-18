import Page from "./page.js";

class CartPage extends Page {
  get btnProceedToCheckout() {
    return $('[data-test="proceed-1"]');
  }

  async proceedToCheckout() {
    await this.btnProceedToCheckout.waitForDisplayed();
    await this.btnProceedToCheckout.click();
  }
}
export default new CartPage();
