// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// const { contains } = require("cypress/types/jquery")

Cypress.Commands.add('BasicDonation', () => {
  cy.visit(Cypress.env('TEST_SERVER') + '/yucatan');
  cy.skipIntroVideo();
  cy.wait(15000); // wait a little longer for tests running on 'npm run dev' instances
  cy.get('[data-test-id="donateButton"]').click();
  cy.contactForm(
    'Peter',
    'Payer',
    'peter.payer@gmail.com',
    'Unbekannt 1',
    'Uffing am Staffelsee',
    'Germany{enter}',
    '82449'
  );
});

Cypress.Commands.add('spainDonation', () => {
  cy.visit(Cypress.env('TEST_SERVER') + '/yucatan');
  cy.skipIntroVideo();
  cy.wait(5000);
  cy.get('[data-test-id="donateButton"]').click();
  cy.contactForm(
    'Peter',
    'Payer',
    'peter.payer@gmail.com',
    'Unbekannt 1',
    'Uffing am Staffelsee',
    'Spain{enter}',
    '82449'
  );
});

Cypress.Commands.add(
  'contactForm',
  (firstName, lastName, email, address, city, country, zipCode) => {
    cy.get('[data-test-id="treeDonateContinue"]')
      .click()
      .then(() => {
        cy.get('[data-test-id="firstName"]').type(firstName);
        cy.get('[data-test-id="lastName"]').type(lastName);
        cy.get('[data-test-id="email"]').type(email);
        // any known address will trigger a dropdown of suggestions which only get away with a tab key,
        // but Cypress does not support {tab} yet, so we use an unknown address to test here:
        cy.get('[data-test-id="address"]').type(address);
        cy.get('[data-test-id="city"]').clear().type(city);
        cy.get('[data-test-id="country"]').clear().type(country);
        cy.get('[data-test-id="zipCode"]').clear().type(zipCode);
        cy.get('[data-test-id="continueToPayment"]').click();
      });
  }
);

Cypress.Commands.add('cardPayment', (cardNumber, cardExpiry, cardCvc) => {
  cy.get('[data-test-id="cardElement"]').within(() => {
    cy.fillElementsInput('cardNumber', cardNumber);
    cy.fillElementsInput('cardExpiry', cardExpiry); // MMYY
    cy.fillElementsInput('cardCvc', cardCvc);
  });
  cy.get('[data-test-id="test-donateButton"]')
    .click()
    .then(() => {
      cy.wait(15000).then(() => {
        // cy.get('#test-source-authorize-3ds').click()
        cy.get('[data-test-id="test-thankYou"]').should('exist');
      });
    });
});

Cypress.Commands.add('giftDonation', () => {
  cy.visit(Cypress.env('TEST_SERVER') + '/yucatan');
  cy.skipIntroVideo();
  cy.wait(5000);
  cy.get('[data-test-id="donateButton"]').click();
  cy.get('[data-test-id="giftToggle"]').click();
  cy.get('[data-test-id="recipientName"]').type('Max');
  cy.get('[data-test-id="recipientEmail"]').type('max@gmail.com');
  cy.get('[data-test-id="recipientMessage"]').type('Wish you luck');
  cy.contactForm(
    'Peter',
    'Payer',
    'peter.payer@gmail.com',
    'Unbekannt 1',
    'Uffing am Staffelsee',
    'Germany{enter}',
    '82449'
  );
});

Cypress.Commands.add('customTreeDonation', () => {
  cy.visit(Cypress.env('TEST_SERVER') + '/yucatan');
  cy.skipIntroVideo();
  cy.wait(5000);
  cy.get('[data-test-id="donateButton"]').click();
  cy.get('[data-test-id="downArrow"]').click();
  cy.contains('Germany').click();
  cy.get('[data-test-id="SelCurrencyModalOk"]').click();
  cy.get('[data-test-id="customTreeInput"]').click().type('15');
  cy.contactForm(
    'Peter',
    'Payer',
    'peter.payer@gmail.com',
    'Unbekannt 1',
    'Uffing am Staffelsee',
    'Germany{enter}',
    '82449'
  );
});

Cypress.Commands.add('multipleDonation', () => {
  cy.visit(Cypress.env('TEST_SERVER') + '/yucatan');
  cy.skipIntroVideo();
  cy.wait(5000);
  cy.get('[data-test-id="donateButton"]').click();
  cy.get('[data-test-id="selectTreeCount"]')
    .eq(3)
    .should('have.text', '150')
    .click();
  cy.contactForm(
    'Peter',
    'Payer',
    'peter.payer@gmail.com',
    'Unbekannt 1',
    'Uffing am Staffelsee',
    'Germany{enter}',
    '82449'
  );
});

Cypress.Commands.add('paymentError', (cardNumber, cardExpiry, cardCvc) => {
  cy.get('[data-test-id="cardElement"]').within(() => {
    cy.fillElementsInput('cardNumber', cardNumber);
    cy.fillElementsInput('cardExpiry', cardExpiry); // MMYY
    cy.fillElementsInput('cardCvc', cardCvc);
  });
  cy.get('[data-test-id="test-donateButton"]')
    .click()
    .then(() => {
      cy.wait(8000).then(() => {
        // cy.get('#test-source-authorize-3ds').click()
        cy.get('[data-test-id="paymentError"]');
      });
    });
});

// skip intro video if button found
Cypress.Commands.add('skipIntroVideo', () => {
  cy.get('body');
  cy.get('[data-test-id="skipLandingVideo"]').click;
});

Cypress.Commands.add('giftRemove', () => {
  cy.visit(Cypress.env('TEST_SERVER'));
  cy.skipIntroVideo();
  cy.visit(Cypress.env('TEST_SERVER') + '/s/sagar-aryal')
    .wait(10000)
    .then(() => {
      cy.get('[data-test-id="searchIcon"]').type('yucatan restoration');
      cy.get('#ProjSnippetDonate_proj_WZkyugryh35sMmZMmXCwq7YY').click();
      cy.get('#singleGiftRemoveId').click();
      cy.contactForm(
        'Peter',
        'Payer',
        'peter.payer@gmail.com',
        'Unbekannt 1',
        'Uffing am Staffelsee',
        'Germany{enter}',
        '82449'
      );
    });
});

Cypress.Commands.add('addProjects', () => {
  cy.visit(Cypress.env('TEST_SERVER') + '/profile/projects/add-project');
  cy.get('#username').type('test-tpo@plant-for-the-planet.org{enter}');
  cy.get('#password').type(Cypress.env('TEST_ACCOUNT_PASSWORD') + '{enter}');

  // OTP disabled on staging by Sagar
  //cy.request(Cypress.env('TEST_MFA_URL')).then((response) => {
  //    cy.get('#code').type(response.body.token + "{enter}")
  //})
  cy.wait(5000);
});

Cypress.Commands.add('projectDetails', () => {
  //define a variable consisting alphabets in small and capital letter
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

  //specify the length for the new string
  const lenString = 4;
  let randomstring = '';

  //loop to select a new character in each iteration
  for (let i = 0; i < lenString; i++) {
    const rnum = Math.floor(Math.random() * characters.length);
    randomstring += characters.substring(rnum, rnum + 1);
    console.log(`randomstring`, randomstring);
  }

  //display the generated string
  // document.getElementById("slug").innerHTML = randomstring;
  cy.visit(Cypress.env('TEST_SERVER') + '/profile/projects/add-project');
  cy.wait(20000);
  cy.get('[data-test-id="projectName"]').type('Peter Farm');
  cy.get('[data-test-id="slug"]').type(randomstring);
  cy.get('[data-test-id="classification"]').click();
  cy.contains('Natural Regeneration').click();
  cy.get('[data-test-id="target"]').type('800');
  cy.get('[data-test-id="website"]').type('peterfarm.com');
  cy.get('[data-test-id="aboutProject"]').type("It's Peter's farm");
  cy.get('[data-test-id="receiveDonations"]').click();
  cy.get('[data-test-id="treeCost"]').type('100');
  cy.get('[data-test-id="latitude"]').type('17.37541191565851');
  cy.get('[data-test-id="longitude"]').type('18.65069921623075');
  cy.get('[data-test-id="visitorAssistance"]').click();
  cy.get('[data-test-id="publishProject"]').click();
  cy.get('[data-test-id="basicDetailsCont"]').click();
  cy.wait(5000);
  cy.get('[data-test-id="projMediaCont"]').click();
  cy.wait(5000);
  cy.get('[data-test-id="plantingDensity"]').type('100');
  cy.get('[data-test-id="employeeCount"]').type('20');
  cy.get('[data-test-id="detailAnalysisCont"]').click();
  cy.wait(5000);
  cy.get('[data-test-id="siteName"]').type(randomstring);
  cy.get('[data-test-id="siteStatus"]').click();
  cy.contains('Planted').click();
  cy.get('[data-test-id="projSitesCont"]').click();
  cy.wait(5000);
  cy.get('[data-test-id="projSpendingCont"]').click();
  cy.wait(5000);
  cy.get('[data-test-id="submitReview"]').click();
  cy.contains('Logout').click();
});
