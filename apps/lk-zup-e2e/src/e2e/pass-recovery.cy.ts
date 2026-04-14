describe('Restore password', () => {
  beforeEach(() => {
    cy.visit('https://empl-dev.test-wa.ru/auth');
  });

  it('Invalid email', () => {
    cy.get('#auth-input-restore-button').click();
    cy.url().should('include', '/auth/restorePass');

    cy.get('#auth-restore-input-email').type('kshevskaya');
    cy.get('#auth-restore-confirm-button').click();
    cy.url().should('include', '/auth/restorePass');
    cy.get('.custom-form-field__error').should('exist').should('not.be.empty');
  });

  it('Valid unexisting email', () => {
    cy.get('#auth-input-restore-button').click();
    cy.url().should('include', '/auth/restorePass');

    cy.get('#auth-restore-input-email').type(
      `incorrentkshevskaya@wiseadvice.ru`
    );
    cy.get('#auth-restore-confirm-button').click();
    cy.url().should('include', '/auth/restorePass');
  });

  it('Valid email', () => {
    cy.get('#auth-input-restore-button').click();
    cy.url().should('include', '/auth/restorePass');

    cy.get('#auth-restore-input-email').type('kshevskaya@wiseadvice.ru');
    cy.get('#auth-restore-confirm-button').click();
    cy.url().should('include', '/auth/restorePass');
    cy.get('#auth-restore-success-message').should('exist');

    cy.get('#auth-restore-back-button').click();
    cy.url().should('include', '/auth').and('not.include', '/auth/restorePass');
  });
});
