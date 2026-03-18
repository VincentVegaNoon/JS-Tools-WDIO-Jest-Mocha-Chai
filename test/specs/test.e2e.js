import { expect as expectChai, assert } from "chai";
import * as chai from "chai";
chai.should();
import HomePage from "../../pageobjects/home.page.js";
import Navbar from "../../pageobjects/navbar.page.js";
import LoginPage from "../../pageobjects/login.page.js";
import RegisterPage from "../../pageobjects/register.page.js";
import ProductPage from "../../pageobjects/product.page.js";
import CartPage from "../../pageobjects/cart.page.js";
import CheckoutPage from "../../pageobjects/checkout.page.js";
import ProfilePage from "../../pageobjects/profile.page.js";
import FavoritesPage from "../../pageobjects/favorites.page.js";

describe("ToolShop User Journey", () => {
  before(async () => {
    await HomePage.open();
  });

  it("1. Search for a product", async () => {
    const searchQuery = "Hammer";
    await HomePage.searchForProduct(searchQuery);
    const results = await HomePage.getVisibleProductNames();

    expectChai(results.length).to.be.above(0, "Should find atleast one product");
    expectChai(results[0]).to.include(searchQuery);
  });
  it("6. New user registration", async () => {
    await Navbar.goToLogin();
    await LoginPage.goToRegistration();
    // const uniqueEmail = `jan.kowalski_${Date.now()}@example.com`;

    await RegisterPage.registerUser({
      firstName: "Jan",
      lastName: "Kowalski",
      dob: "1990-01-01",
      address: "Prosta 1",
      postcode: "00-001",
      city: "Warszawa",
      state: "Mazowieckie",
      country: "Poland",
      phone: "123456789",
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD,
    });

    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl();
        return url.includes("login");
      },
      {
        timeout: 5000,
        timeoutMsg: "After registration user was not redirected to login page",
      },
    );

    const currentUrl = await browser.getUrl();
    assert.include(currentUrl, "login", "URL should contain 'login' after registration");
  });
  it("2. Successful login", async () => {
    await Navbar.goToLogin();
    await LoginPage.login(process.env.TEST_USER_EMAIL, process.env.TEST_USER_PASSWORD);
    await LoginPage.pageTitle.waitForDisplayed({
      timeout: 5000,
      timeoutMsg: "After login, account page was not displayed",
    });
    const titleText = await LoginPage.pageTitle.getText();
    titleText.should.equal("My account");
  });
  it("3. Filter and sort products", async () => {
    await HomePage.open();
    await HomePage.filterByCategory("Hand Tools");
    await HomePage.sortByText("Name (A - Z)");

    const originalNames = await HomePage.getVisibleProductNames();

    const sortedInJs = [...originalNames].sort();

    assert.isAbove(originalNames.length, 0, "Should display some products");
    assert.deepEqual(originalNames, sortedInJs, "Products are not sorted alphabetically!");
  });
  it("4. Add product to shopping cart", async () => {
    const productName = "Claw Hammer";
    await HomePage.open();
    await HomePage.searchForProduct(productName);
    await HomePage.openProductDetails(productName);
    await ProductPage.addToCart();
    const count = await Navbar.getCartQuantity();
    expectChai(count).to.equal("1");
  });
  it("5. Successful checkout", async () => {
    await Navbar.goToCart();
    await CartPage.proceedToCheckout();
    await CheckoutPage.completeCheckout("Cash on Delivery");
    const confirmationText = await CheckoutPage.getSuccessMessageText();
    expectChai(confirmationText).to.include("Payment was successful");
  });
  it("7. Profile: should display user details", async () => {
    await Navbar.goToMyAccount();
    await ProfilePage.openProfileTab();

    const emailValue = await ProfilePage.getSavedEmail();
    assert.equal(emailValue, process.env.TEST_USER_EMAIL, "Email in profile should match the logged in user email");
  });
  it("8. Favorites: should add item to favorites", async () => {
    const productName = "Sheet Sander";
    await HomePage.open();

    await HomePage.searchForProduct(productName);

    await HomePage.openProductDetails(productName);

    await ProductPage.addToFavorites();

    await Navbar.goToMyFavorites();

    const isPresent = await FavoritesPage.isProductInFavorites(productName);

    expectChai(isPresent).to.be.true;
  });
});
