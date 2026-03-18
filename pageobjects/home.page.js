import Page from "./page.js";

class HomePage extends Page {
  get searchInput() {
    return $('[data-test="search-query"]');
  }
  get searchButton() {
    return $('[data-test="search-submit"]');
  }
  get productTitles() {
    return $$(".card-title");
  }
  get firstProduct() {
    return $(".card-title");
  }
  get sortDropdown() {
    return $('select[data-test="sort"]');
  }

  async waitForListToUpdate(action) {
    await this.firstProduct.waitForDisplayed();
    const oldText = await this.firstProduct.getText();

    await action();

    await browser.waitUntil(async () => (await this.firstProduct.getText()) !== oldText, {
      timeout: 3000,
      timeoutMsg: "Lista produktów nie odświeżyła się po akcji",
    });
  }

  async searchForProduct(productName) {
    await this.searchInput.waitForDisplayed();
    await this.searchInput.setValue(productName);
    await this.searchButton.click();

    await browser.waitUntil(
      async () => {
        if (!(await this.firstProduct.isDisplayed())) return false;

        const text = await this.firstProduct.getText();

        return text.includes(productName);
      },
      {
        timeout: 10000,
        timeoutMsg: `Results for "${productName}" didnt load after 10 seconds`,
      },
    );
  }

  async getVisibleProductNames() {
    await this.firstProduct.waitForDisplayed();

    const titles = await this.productTitles.map((element) => element.getText());
    return titles;
  }

  async filterByCategory(categoryName) {
    await this.waitForListToUpdate(async () => {
      const categoryLabel = await $(`label=${categoryName}`);
      await categoryLabel.waitForDisplayed();
      await categoryLabel.click();
    });
  }

  async sortByText(visibleText) {
    await this.waitForListToUpdate(async () => {
      await this.sortDropdown.waitForDisplayed();
      await this.sortDropdown.selectByVisibleText(visibleText);
    });
  }
  async openProductDetails(productName) {
    const productTitle = await $(`h5=${productName}`);
    await productTitle.waitForDisplayed();
    await productTitle.click();
  }

  open() {
    return super.open("");
  }
}

export default new HomePage();
