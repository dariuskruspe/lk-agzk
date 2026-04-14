describe('Auth by email', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/auth');
  });

  it('Incorrect credentials', () => {
    // login by email
    cy.get('.p-card-content > :nth-child(1) > .p-inputtext').type(
      'chernysheva@wiseadvice.ru'
    );
    cy.get('.p-password > .p-inputtext').type('12345');
    cy.get('.full').click();

    cy.get('.p-toast-message-content').should('exist');
    cy.url().should('include', '/auth');
  });

  it('Correct credentials', () => {
    cy.get('.p-card-content > :nth-child(1) > .p-inputtext').type(
      'aleksandrova.e@wiseadvice.ru'
    );
    cy.get('.p-password > .p-inputtext').type('1234');
    cy.get('.full').click();

    cy.get('.initial-loading').should('exist').should('be.visible');
    cy.get('.initial-loading', { timeout: 30000 }).should('not.exist');
    cy.url().should('not.include', '/auth');
  });
});
