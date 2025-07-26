export class LoginPage {
  constructor() {
    this.selectors = {
      usernameInput: '#username',
      passwordInput: '#password',
      loginButton: 'button[name="login"]',
      errorMessage: '.woocommerce-error'
    };
  }

  visit() {
    cy.visit('/my-account/');
    return this;
  }

  login(username, password) {
    cy.get(this.selectors.usernameInput).clear().type(username);
    cy.get(this.selectors.passwordInput).clear().type(password);
    cy.get(this.selectors.loginButton).click();
    return this;
  }

  verifyLoginError(expectedMessage) {
    cy.get(this.selectors.errorMessage).should('contain.text', expectedMessage);
    return this;
  }
}
