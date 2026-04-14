/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      shouldNotExist(selector: string, waiting: number): Chainable<void>;
      loginByEmail(email: string, password: string): Chainable<void>;
      shouldAppearToast(waiting?: number): Chainable<void>;
      auth(options?: {
        skipOnboarding?: boolean;
        skipPushes?: boolean;
      }): Chainable<void>;
      setLocalStorage(): Chainable<void>;
      shouldHeaderBeLoaded(): Chainable<void>;
      shouldMenuBeLoaded(visible: boolean = false): Chainable<void>;
      shouldTemplateBeLoaded(visible: boolean = false): Chainable<void>;
    }
  }
}

Cypress.Commands.add('shouldNotExist', (selector: string, waiting: number) => {
  cy.wait(waiting);
  cy.get('body').find(selector).should('have.length', 0);
});

Cypress.Commands.add('shouldAppearToast', (waiting: number = 3000) => {
  cy.wait(waiting);
  cy.get('.cy-main-template-toast .p-toast-message-content')
    .should('exist')
    .should('be.visible');
});

Cypress.Commands.add('loginByEmail', (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Missing login or password values in environment');
  }
  cy.get('#auth-input-email').type(email);
  cy.get('#auth-input-password').type(password);
  cy.get('#auth-input-confirm-button').click();
});

Cypress.Commands.add(
  'auth',
  (options?: { skipOnboarding?: boolean; skipPushes?: boolean }) => {
    cy.loginByEmail(Cypress.env('user_email'), Cypress.env('user_password'));
    cy.get('.initial-loading').should('exist').should('be.visible');
    cy.get('.initial-loading', { timeout: 30000 }).should('not.exist');
    cy.url().should('not.include', '/auth');

    // if (options?.skipOnboarding) {
    //   cy.get('.onb-close-button', { timeout: 20000 }).last().click();
    // }
  }
);

Cypress.Commands.add('setLocalStorage', () => {
  cy.getAllLocalStorage().then((result) => {
    Cypress.env('localStorage', result[window.location.origin]);
  });
});

Cypress.Commands.add('shouldHeaderBeLoaded', () => {
  cy.get('#main-header').should('exist').should('be.visible');
  cy.get('.cy-main-header').should('exist');
});

Cypress.Commands.add('shouldMenuBeLoaded', (visible: boolean) => {
  cy.get('.cy-main-menu').should('exist');
  if (visible) {
    cy.get('.cy-main-menu').should('be.visible');
  }
});

Cypress.Commands.add('shouldTemplateBeLoaded', (visible: boolean = false) => {
  cy.shouldHeaderBeLoaded();
  cy.shouldMenuBeLoaded(visible);
});
