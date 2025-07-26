import { LoginPage } from './page-objects/LoginPage';
import { ShopPage } from './page-objects/ShopPage';
import { CartPage } from './page-objects/CartPage';

const loginPage = new LoginPage();
const shopPage = new ShopPage();
const cartPage = new CartPage();

Cypress.Commands.add('loginAsCustomer', (username = Cypress.env('username'), password = Cypress.env('password')) => {
  cy.visit('/my-account/');
  loginPage.login(username, password);
  cy.url().should('not.include', '/my-account/');
});

Cypress.Commands.add('addProductToCart', (productName) => {
  shopPage.addProductToCart(productName);
});

Cypress.Commands.add('getProductPrice', (productName, priceType = 'wholesale') => {
  return shopPage.getProductPrice(productName, priceType);
});

Cypress.Commands.add('getCartItemPrice', (productName) => {
  return cartPage.getCartItemPrice(productName);
});

Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.window().its('document.readyState').should('equal', 'complete');
});

Cypress.Commands.add('clearCart', () => {
  cy.visit('/cart/');
  cy.wait(2000);
  
  cy.get('body').then($body => {
    // Check if cart is already empty
    const emptyCartTexts = [
      'Your cart is currently empty',
      'cart is currently empty',
      'No products in the cart',
      'Cart is empty'
    ];
    
    const bodyText = $body.text();
    const isAlreadyEmpty = emptyCartTexts.some(text => bodyText.includes(text));
    
    if (isAlreadyEmpty) {
      cy.log('Cart is already empty - no action needed');
      return;
    }
    
    // Check if cart has items
    const cartItemSelectors = [
      '.wc-block-cart-items__row', 
      'tr.wc-block-cart-items__row',
      '.wc-block-cart-item__product'
    ];
    
    const hasItems = cartItemSelectors.some(selector => $body.find(selector).length > 0);
    
    if (hasItems) {
      cy.log('Cart has items - clearing cart');
      
      // Remove all items
      const removeSelectors = [
        '.wc-block-cart-item__remove-link',
        'button.wc-block-cart-item__remove-link',
        '[aria-label*="Remove"][aria-label*="from cart"]',
        'button[aria-label*="Remove"]'
      ];
      
      removeSelectors.forEach(selector => {
        cy.get('body').then($body => {
          if ($body.find(selector).length > 0) {
            cy.get(selector).each($removeBtn => {
              cy.wrap($removeBtn).click({ force: true });
              cy.wait(1500);
            });
          }
        });
      });
      
      // Wait for cart to be empty
      cy.get('body', { timeout: 15000 }).should($body => {
        const bodyText = $body.text();
        const isEmpty = emptyCartTexts.some(text => bodyText.includes(text)) || 
                       $body.find('.wc-block-cart-items__row').length === 0;
        expect(isEmpty).to.be.true;
      });
      
      cy.log('Cart cleared successfully');
    } else {
      cy.log('No cart items found to remove');
    }
  });
});