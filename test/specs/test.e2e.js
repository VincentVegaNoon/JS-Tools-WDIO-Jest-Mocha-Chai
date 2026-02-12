describe("Practical Tas", () => {
  let assert;
  let expectChai;
  let should;

  const baseUrl = "https://practicesoftwaretesting.com";
  let userEmail = `testuser_${Date.now()}@example.com`;
  const password = "Testp3232ass123!";

  before(async () => {
    const chai = await import("chai");
    assert = chai.assert;
    expectChai = chai.expect;
    should = chai.should();
  });

  beforeEach(async () => {
    await browser.url(baseUrl);
    await browser.maximizeWindow();
  });

  it("1. Search for a product", async () => {
    const searchInput = await $('[data-test="search-query"]');
    const searchBtn = await $('[data-test="search-submit"]');

    await searchInput.setValue("Claw Hammer");
    await searchBtn.click();

    await browser.waitUntil(
      async () => {
        const text = await $(".card-title").getText();
        return text.includes("Claw Hammer");
      },
      {
        timeout: 5000,
        timeoutMsg: "Claw Hammer not found",
      },
    );
  });

  it("6. New user registration", async () => {
    await $('[data-test="nav-sign-in"]').click();
    await $('[data-test="register-link"]').click();

    await $("#first_name").setValue("Jan");
    await $("#last_name").setValue("Kowalski");
    await $("#dob").setValue("1990-01-01");
    await $("#street").setValue("Testowa");
    await $("#postal_code").setValue("00-000");
    await $("#city").setValue("Warszawa");
    await $("#state").setValue("Mazowieckie");
    await $("#country").selectByVisibleText("Poland");
    await $("#phone").setValue("123456789");
    await $("#email").setValue(userEmail);
    await $("#password").setValue(password);
    await $('[data-test="register-submit"]').click();

    await browser.waitUntil(
      async () => {
        const url = await browser.getUrl();
        return url.includes("/auth/login");
      },
      {
        timeout: 5000,
        timeoutMsg: "Didn't redirect to login page after 5s",
      },
    );
    const url = await browser.getUrl();

    assert.include(url, "auth/login", "URL should contain auth/login after registration");
  });

  it("2. Successful login", async () => {
    await $('[data-test="nav-sign-in"]').click();
    await $("#email").setValue(userEmail);
    await $("#password").setValue(password);
    await $('[data-test="login-submit"]').click();

    const myAccountHeader = await $('h1[data-test="page-title"]');
    await myAccountHeader.waitForDisplayed();

    const headerText = await myAccountHeader.getText();

    headerText.should.equal("My account");
  });

  it("3. Filter and sort products", async () => {
    const categoryLabel = await $("label=Hand Tools");
    await categoryLabel.waitForDisplayed();
    await categoryLabel.click();
    const sortDropdown = await $('select[data-test="sort"]');
    await sortDropdown.selectByVisibleText("Name (A - Z)");

    await browser.pause(1000);

    const products = await $$(".card-title");

    const originalNames = await products.map((element) => element.getText());

    const sortedInJs = [...originalNames].sort();

    assert.isAbove(products.length, 0, "Should display some products");
    assert.deepEqual(originalNames, sortedInJs, "Products are not sorted alphabetically!");
  });

  it("4. Add product to shopping cart", async () => {
    await $('[data-test="search-query"]').setValue("Claw Hammer");
    await $('[data-test="search-submit"]').click();
    const clawHammerItem = await $("h5=Claw Hammer");
    await clawHammerItem.waitForDisplayed();
    await clawHammerItem.click();

    await $('[data-test="add-to-cart"]').click();
    const cartBadge = await $('[data-test="cart-quantity"]');
    await cartBadge.waitForDisplayed();
    const count = await cartBadge.getText();

    expectChai(count).to.equal("1");
  });

  it("5. Successful checkout", async () => {
    const signInLink = await $('[data-test="nav-sign-in"]');
    if (await signInLink.isDisplayed()) {
      await signInLink.click();
      await $("#email").setValue(userEmail);
      await $("#password").setValue(password);
      await $('[data-test="login-submit"]').click();
      await $('h1[data-test="page-title"]').waitForDisplayed();
    }

    const cartBadge = await $('[data-test="cart-quantity"]');

    if (!(await cartBadge.isExisting())) {
      console.log("Cart is empty");

      await browser.url(baseUrl);
      await $(".card-img-top").click();

      const addBtn = await $('[data-test="add-to-cart"]');
      await addBtn.waitForDisplayed();
      await addBtn.click();

      await cartBadge.waitForDisplayed();
    }

    await $('[data-test="nav-cart"]').click();

    //Checkout
    await $('[data-test="proceed-1"]').waitForClickable();
    await $('[data-test="proceed-1"]').click();

    await $('[data-test="proceed-2"]').waitForClickable();
    await $('[data-test="proceed-2"]').click();

    await $('[data-test="proceed-3"]').waitForClickable();
    await $('[data-test="proceed-3"]').click();

    const paymentDropdown = await $('select[data-test="payment-method"]');
    await paymentDropdown.selectByVisibleText("Cash on Delivery");

    await $('[data-test="finish"]').waitForClickable();
    await $('[data-test="finish"]').click();

    const successMessage = await $('[data-test="payment-success-message"]');
    await successMessage.waitForDisplayed();
    const messageText = await successMessage.getText();
    messageText.should.equal("Payment was successful");
  });

  it("7. Profile: should display user details", async () => {
    const signInLink = await $('[data-test="nav-sign-in"]');

    if (await signInLink.isDisplayed()) {
      await signInLink.click();
      await $("#email").setValue(userEmail);
      await $("#password").setValue(password);
      await $('[data-test="login-submit"]').click();

      await browser.waitUntil(async () => {
        const title = await $('h1[data-test="page-title"]').getText();
        return title === "My account";
      });
    }

    const userMenuDropdown = await $('[data-test="nav-menu"]');
    await userMenuDropdown.waitForDisplayed();
    await userMenuDropdown.click();

    const myAccountOption = await $('[data-test="nav-my-account"]');
    await myAccountOption.waitForDisplayed();
    await myAccountOption.click();

    const profileLink = await $('[data-test="nav-profile"]');
    await profileLink.waitForDisplayed();
    await profileLink.click();

    const emailField = await $("#email");
    await emailField.waitForDisplayed();

    await browser.waitUntil(
      async () => {
        const val = await emailField.getValue();
        return val !== "";
      },
      { timeout: 5000, timeoutMsg: "Profile data did not load (empty email)" },
    );

    const emailValue = await emailField.getValue();

    assert.equal(emailValue, userEmail, "Email in profile should match registration email");
  });

  it("8. Favorites: should add item to favorites", async () => {
    await $('[data-test="nav-home"]').click();

    await $('[data-test="search-query"]').setValue("Sheet Sander");
    await $('[data-test="search-submit"]').click();

    const product = await $("h5=Sheet Sander");
    await product.waitForDisplayed();
    await product.click();

    const addToFavoritesBtn = await $('[data-test="add-to-favorites"]');

    await addToFavoritesBtn.waitForDisplayed();
    await addToFavoritesBtn.click();

    const userMenu = await $('[data-test="nav-menu"]');
    await userMenu.waitForDisplayed();
    await userMenu.click();

    const myFavoritesOption = await $('[data-test="nav-my-favorites"]');
    await myFavoritesOption.waitForDisplayed();
    await myFavoritesOption.click();

    const favoriteItem = await $("h5=Sheet Sander");
    await favoriteItem.waitForDisplayed();

    const isPresent = await favoriteItem.isDisplayed();

    expectChai(isPresent).to.be.true;
  });
});
