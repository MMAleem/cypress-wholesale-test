export class CartPage {
  constructor() {
    this.selectors = {
      cartItem: '.wc-block-cart-items__row',
      itemName: '.wc-block-components-product-name',
      itemPrice: '.wc-block-cart-item__total .wc-block-components-product-price__value',
      cartTotal: '.wc-block-components-totals-footer-item .wc-block-formatted-money-amount'
    };
  }

  visit() {
    cy.visit('/cart/');
    cy.waitForPageLoad();
    return this;
  }

  getCartItemByName(productName) {
    return cy.get(this.selectors.cartItem)
             .contains(this.selectors.itemName, productName)
             .parents(this.selectors.cartItem);
  }

  getCartItemPrice(productName) {
    return this.getCartItemByName(productName)
               .find(this.selectors.itemPrice)
               .invoke('text')
               .then(text => text.replace(/[^\d.]/g, ''));
  }

  verifyCartTotal(expectedTotal) {
    cy.get(this.selectors.cartTotal)
      .should('contain.text', expectedTotal);
    return this;
  }
}
