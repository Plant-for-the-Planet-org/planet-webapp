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

// Cypress.Commands.add("BasicDonation",() => {
//     cy.visit(`localhost:3000`)
//     cy.SearchProject('yucatan')
// })

Cypress.Commands.add('BasicDonation', () => {
    cy.visit('localhost:3000/yucatan')
    cy.wait(5000)
    cy.get('[data-test-id="donateButton"]').click()
    cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
})

Cypress.Commands.add('spainDonation', () => {
    cy.visit('localhost:3000/yucatan')
    cy.wait(5000)
    cy.get('[data-test-id="donateButton"]').click()
    cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Spain{enter}", "82449")
})

Cypress.Commands.add('contactForm', (firstName, lastName, email, address, city, country, zipCode) => {
    cy.get('[data-test-id="treeDonateContinue"]').click().then(() => {
        cy.get('[data-test-id="firstName"]').type(firstName)
        cy.get('[data-test-id="lastName"]').type(lastName)
        cy.get('[data-test-id="email"]').type(email)
        // any known address will trigger a dropdown of suggestions which only get away with a tab key,
        // but Cypress does not support {tab} yet, so we use an unknown address to test here:
        cy.get('[data-test-id="address"]').type(address);
        cy.get('[data-test-id="city"]').clear().type(city)
        cy.get('[data-test-id="country"]').clear().type(country);
        cy.get('[data-test-id="zipCode"]').clear().type(zipCode)
        cy.get('[data-test-id="continueToPayment"]').click()
    })
})

Cypress.Commands.add('cardPayment', (cardNumber, cardExpiry, cardCvc) => {
    cy.get('[data-test-id="cardElement"]').within(() => {
        cy.fillElementsInput('cardNumber', cardNumber);
        cy.fillElementsInput('cardExpiry', cardExpiry); // MMYY
        cy.fillElementsInput('cardCvc', cardCvc);
    });
    cy.get('[data-test-id="test-donateButton"]').click()
        .then(() => {
            cy.wait(15000).then(() => {
                // cy.get('#test-source-authorize-3ds').click()
                cy.get('[data-test-id="test-thankYou"]').should('exist')
            })

        })
}) 

Cypress.Commands.add('giftDonation', () => {
    cy.visit('localhost:3000/yucatan')
    cy.wait(5000)
    cy.get('[data-test-id="donateButton"]').click()
    cy.get('[data-test-id="giftToggle"]').click()
    cy.get('[data-test-id="recipientName"]').type("Max")
    cy.get('[data-test-id="recipientEmail"]').type("max@gmail.com")
    cy.get('[data-test-id="recipientMessage"]').type("Wish you luck")
    cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
})


Cypress.Commands.add('customTreeDonation', () => {
    cy.visit('localhost:3000/yucatan')
    cy.wait(5000)
    cy.get('[data-test-id="donateButton"]').click()
    cy.get('[data-test-id="downArrow"]').click()
    cy.contains("Germany").click()
    cy.get('[data-test-id="SelCurrencyModalOk"]').click()
    cy.get('[data-test-id="customTreeInput"]').click().type("15")
    cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
})

Cypress.Commands.add("multipleDonation", () => {
    cy.visit('localhost:3000/yucatan')
    cy.wait(5000)
    cy.get('[data-test-id="donateButton"]').click()
    cy.get('[data-test-id="selectTreeCount"]').eq(3).should("have.text", "150").click()
    cy.contactForm("Peter", "Payer", "peter.payer@gmail.com", "Unbekannt 1", "Uffing am Staffelsee", "Germany{enter}", "82449")
})

Cypress.Commands.add('paymentError', (cardNumber, cardExpiry, cardCvc) => {
    cy.get('[data-test-id="cardElement"]').within(() => {
        cy.fillElementsInput('cardNumber', cardNumber);
        cy.fillElementsInput('cardExpiry', cardExpiry); // MMYY
        cy.fillElementsInput('cardCvc', cardCvc);
    });
    cy.get('[data-test-id="test-donateButton"]').click()
        .then(() => {
            cy.wait(8000).then(() => {
                // cy.get('#test-source-authorize-3ds').click()
                cy.get('[data-test-id="paymentError"]')
            })

        })
})  