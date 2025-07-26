export class ShopPage {
  constructor() {
    this.selectors = {
      productItem: '.product',
      productTitle: '.woocommerce-loop-product__title',
      wholesalePrice: '.wholesale_price_container ins .woocommerce-Price-amount',
      regularPrice: '.original-computed-price del .woocommerce-Price-amount',
      addToCartButton: '.add_to_cart_button'
    };
  }

  visit() {
    cy.visit('/shop/');
    cy.waitForPageLoad();
    return this;
  }

  getProductByName(productName) {
    return cy.contains(this.selectors.productItem, productName);

  }

  addProductToCart(productName) {
    this.getProductByName(productName)
        .find(this.selectors.addToCartButton)
        .click();
        return this;
  }

  getProductPrice(productName, priceType = 'wholesale') {
    const priceSelectors = {
      wholesale: this.selectors.wholesalePrice,
      regular: this.selectors.regularPrice
    };

    return this.getProductByName(productName)
      .find(priceSelectors[priceType])
      .invoke('text')
      .then(text => text.replace(/[^\d.]/g, ''));
  }

  verifyWholesalePrice(productName, expectedPrice) {
    this.getProductByName(productName)
        .find(this.selectors.wholesalePrice)
        .should('contain.text', expectedPrice);
    return this;
  }
}
