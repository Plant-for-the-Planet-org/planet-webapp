/// <reference types="cypress" />
import cy from 'cypress';

describe('Donations', () => {
  it('Basic Donations', () => {
    cy.BasicDonation();
    cy.cardPayment('4242424242424242', '424', '242');
  });

  it('Gift Donation', () => {
    cy.giftDonation();
    cy.cardPayment('4242424242424242', '424', '242');
  });

  // This test does not work in all enviroments as language is auto detected
  // and "Germany" cannot be found in other languages then English.
  //
  // This also fails for other reasons:
  //  `cy.click()` failed because the center of this element is hidden from view
  /*
    it("Change currency and custom tree donation", () => {
        cy.customTreeDonation()
        cy.cardPayment("4242424242424242", "424", "242")
    })
    */

  it('Multiple Donations', () => {
    cy.multipleDonation();
    cy.cardPayment('4242424242424242', '424', '242');
  });

  //  International Cards
  it('Testing with Germany Visa', () => {
    cy.BasicDonation();
    cy.cardPayment('4000002760000016', '424', '242');
  });

  it('Testing with Spain Visa', () => {
    cy.spainDonation();
    cy.cardPayment('4000007240000007', '424', '242');
  });

  // error testing
  it('Testing with Charge declined error', () => {
    cy.BasicDonation();
    cy.paymentError('4000000000000002', '424', '242');
  });
  it('Testing with Insufficient funds error', () => {
    cy.BasicDonation();
    cy.paymentError('4000000000009995', '424', '242');
  });
  it('Testing with CVC fails', () => {
    cy.BasicDonation();
    cy.paymentError('4000000000000101', '424', '242');
  });

  it('Gift Removal using Search bar', () => {
    cy.giftRemove();
    cy.cardPayment('4242424242424242', '424', '242');
  });
});
