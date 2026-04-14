// eslint-disable-next-line import/no-extraneous-dependencies
import { Interception } from 'cypress/types/net-stubbing';

describe('Routing', () => {
  before(() => {
    cy.visit(
      '/issues/types/command/custom?typeId=689bb302-0aba-11ee-95d3-e92506072cef'
    );
    cy.auth({ skipOnboarding: true });
    cy.setLocalStorage();
    cy.shouldTemplateBeLoaded(true);
  });

  function interceptResponse(
    beforeRequest: () => void,
    cb: (interception: Interception) => void
  ): void {
    cy.intercept('POST', `/data/ru/wa_issues`).as('createIssue');

    beforeRequest();

    cy.wait('@createIssue', { timeout: 30000 }).then(cb);
  }

  it('Filling issue', () => {
    cy.get('#dateBegin').type('23.12.2024');
    cy.get('#dateEnd').type('25.12.2024');
    cy.get('.p-card-content > :nth-child(1) > .p-inputtext').type('cy-test');
    cy.get('#pn_id_12 > .p-dropdown-trigger').click();
    cy.get('#pn_id_12_0').click();
    cy.get(':nth-child(3) > .p-inputtext').type('cy-test');
    cy.get('#pn_id_14 > .p-dropdown-trigger').click();
    cy.get('#pn_id_14_0').click();
    cy.get('#pn_id_16 > .p-dropdown-trigger').click();
    cy.get('#pn_id_16_0').click();
    cy.get('.p-inputtextarea').type('cy-test');

    interceptResponse(
      () => {
        cy.get('[type="submit"]').click();
      },
      (interception) => {

        if (
          interception.response.statusCode !== 200 &&
          interception.response.statusCode !== 406
        ) {
          throw new Error('Error create issue');
        }
        if (interception.response.statusCode === 200) {
          if (
            !interception.response.body.IssueID ||
            !interception.response.body.success
          ) {
            {
              throw new Error('Error create issue');
            }
          }
        }
      }
    );
  });
});
