import Page from "./page.js";

class ProfilePage extends Page {
  get navProfileTab() {
    return $('[data-test="nav-profile"]');
  }
  get inputEmail() {
    return $("#email");
  }

  async openProfileTab() {
    await this.navProfileTab.waitForDisplayed();
    await this.navProfileTab.click();
  }

  async getSavedEmail() {
    await this.inputEmail.waitForDisplayed();

    await browser.waitUntil(
      async () => {
        const val = await this.inputEmail.getValue();
        return val !== "";
      },
      { timeout: 5000, timeoutMsg: "Profile data did not load (empty email)" },
    );

    return this.inputEmail.getValue();
  }
}

export default new ProfilePage();
