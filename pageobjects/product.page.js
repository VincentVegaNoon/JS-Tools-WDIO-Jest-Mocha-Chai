import { $ } from "@wdio/globals";
import Page from "./page.js";

class ProductPage extends Page {
  get btnAddToCart() {
    return $('[data-test="add-to-cart"]');
  }
  get btnAddToFavorites() {
    return $('[data-test="add-to-favorites"]');
  }

  async addToCart() {
    await this.btnAddToCart.waitForDisplayed();
    await this.btnAddToCart.click();
  }
  async addToFavorites() {
    await this.btnAddToFavorites.waitForDisplayed();
    await this.btnAddToFavorites.click();
  }
}

export default new ProductPage();
