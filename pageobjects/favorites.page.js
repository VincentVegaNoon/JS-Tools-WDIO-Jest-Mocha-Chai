import Page from "./page.js";

class FavoritesPage extends Page {
  async isProductInFavorites(productName) {
    const favoriteItem = await $(`h5=${productName}`);

    await favoriteItem.waitForDisplayed({
      timeout: 5000,
      timeoutMsg: `Product "${productName}" didn't displayed in Favorites`,
    });

    return favoriteItem.isDisplayed();
  }
}

export default new FavoritesPage();
