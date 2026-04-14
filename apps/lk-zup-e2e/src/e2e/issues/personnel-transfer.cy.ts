// eslint-disable-next-line import/no-extraneous-dependencies
import { Interception } from 'cypress/types/net-stubbing';

describe('Routing', () => {
  before(() => {
    cy.visit(
      '/issues/types/personnelTransfer/custom?typeId=cd2713e5-c714-11ed-95c4-d1a15816dffe'
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
    cy.get('#organization > .p-dropdown-trigger').click();
    cy.get('#organization_0').click();
    cy.get('#division > .p-dropdown-trigger').click();
    cy.get('#division_0').click();
    cy.get('#staffingTable > .p-dropdown-trigger').click();
    cy.get('#staffingTable_0').click();
    cy.get('#date').type('23.12.2024');
    cy.get('h1').click();
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
