import Page from "./page.js";

class CheckoutPage extends Page {
  get btnProceedAddress() {
    return $('[data-test="proceed-2"]');
  }
  get btnProceedPayment() {
    return $('[data-test="proceed-3"]');
  }
  get paymentMethodDropdown() {
    return $('[data-test="payment-method"]');
  }
  get btnConfirmOrder() {
    return $('[data-test="finish"]');
  }
  get successMessage() {
    return $('[data-test="payment-success-message"]');
  }

  async completeCheckout(paymentMethod = "Cash on Delivery") {
    await this.btnProceedAddress.waitForDisplayed();
    await this.btnProceedAddress.click();

    await this.btnProceedPayment.waitForDisplayed();
    await this.btnProceedPayment.click();

    if (await this.paymentMethodDropdown.isExisting()) {
      await this.paymentMethodDropdown.selectByVisibleText(paymentMethod);
    }

    await this.btnConfirmOrder.waitForDisplayed();
    await this.btnConfirmOrder.click();
  }

  async getSuccessMessageText() {
    await this.successMessage.waitForDisplayed();
    return this.successMessage.getText();
  }
}
export default new CheckoutPage();
