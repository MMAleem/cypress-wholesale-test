import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { LoginPage } from '../../page-objects/LoginPage';
import { ShopPage } from '../../page-objects/ShopPage';
import { CartPage } from '../../page-objects/CartPage';

const loginPage = new LoginPage();
const shopPage = new ShopPage();
const cartPage = new CartPage();

Given('user visits the login page', () => {
  loginPage.visit();
});

Given('user browse URL', () => {
  cy.visit('/');
});

When('Login with credentials', () => {
  const username = Cypress.env('username');
  const password = Cypress.env('password');
  loginPage.login(username, password);
  cy.clearCart();
});

Then('user should be logged in successfully', () => {
  cy.url().should('not.include', '/my-account/');
});

When('go to shop page', () => {
  shopPage.visit();
});

When('Check the wholesale price on product name {string}', (productName) => {
  cy.getProductPrice(productName, 'wholesale').as('wholesalePrice');
});

When('Now add a {string} product to the cart', (productName) => {
  cy.addProductToCart(productName);
});

When('verify cart price', () => {
  cartPage.visit();
});

Then('check if the wholesale price match with cart price', () => {
  cy.get('@wholesalePrice').then(wholesalePrice => {
    cy.visit('/cart/');
    cy.getCartItemPrice('Album').then(cartPrice => {
      expect(cartPrice).to.equal(wholesalePrice);
    });
  });
});

Then('check if the both the prices matches with the expected wholesale price', () => {
  const expectedWholesalePrice = '15';
  
  cy.get('@wholesalePrice').then(displayedWholesalePrice => {
    expect(displayedWholesalePrice).to.equal(expectedWholesalePrice);
  });
  
  cy.visit('/cart/');
  cy.getCartItemPrice('Album').then(cartPrice => {
    expect(cartPrice).to.equal(expectedWholesalePrice);
  });
});