/// <reference types="cypress" />

// eslint-disable-next-line import/no-extraneous-dependencies
import { Interception } from 'cypress/types/net-stubbing';
import { CyHelpers } from '../support/helpers';

describe('Routing', () => {
  function interceptReport(
    beforeRequest: () => void,
    cb: (interception: Interception) => void
  ): void {
    const employeeId = Cypress.env('localStorage')?.employeeId;
    cy.intercept('GET', `/data/ru/wa_employee/${employeeId}/customReport/*`).as(
      'report'
    );

    beforeRequest();

    cy.wait('@report', { timeout: 30000 }).then(cb);
  }

  function interceptRequests(
    beforeRequest: () => void,
    cb: (interceptions: Interception[]) => void
  ): void {
    const employeeId = Cypress.env('localStorage')?.employeeId;
    cy.intercept('GET', `/data/wa_global/settings`).as(`settings`);
    cy.intercept('GET', `/data/ru/wa_users/current`).as(`current`);
    cy.intercept('GET', `/data/ru/wa_issues/states`).as(`states`);
    cy.intercept('GET', `/data/ru/wa_global/documentsStates`).as(
      `documentsStates`
    );
    cy.intercept('GET', `/data/ru/wa_global/signProviders`).as(`signProviders`);
    cy.intercept('GET', `/data/ru/vacationTypes`).as(`vacationTypes`);
    cy.intercept('GET', `/data/ru/wa_employee/employeesstateslist`).as(
      `employeesStatesList`
    );
    cy.intercept('GET', `/data/ru/wa_users/messageLanguage`).as(
      `messageLanguage`
    );
    cy.intercept('GET', `/data/ru/wa_users/sectionsSettings`).as(
      `sectionsSettings`
    );
    cy.intercept('GET', `/data/ru/wa_employee/${employeeId}/staticData`).as(
      `staticData`
    );
    cy.intercept({
      pathname: `/data/ru/wa_employee/${employeeId}/documents`,
    }).as(`documents`);
    cy.intercept({ pathname: `/data/ru/members/sheduleList` }).as(
      `scheduleList`
    );
    cy.intercept(
      'GET',
      `/data/ru/wa_employee/${employeeId}/notifications/all`
    ).as(`notifications`);
    cy.intercept('GET', `/data/ru/wa_employee/${employeeId}/currentState`).as(
      `currentState`
    );
    cy.intercept('GET', `/data/ru/wa_issueTypes/popular`).as(`popular`);
    cy.intercept('GET', `/data/ru/wa_employee/${employeeId}/vacationArray`).as(
      `vacationArray`
    );
    cy.intercept(
      'GET',
      `/data/ru/wa_employee/${employeeId}/vacationBalance`
    ).as(`vacationBalance`);
    cy.intercept({
      pathname: `/data/ru/wa_employee/${employeeId}/issues`,
    }).as(`issues`);
    cy.intercept({ pathname: `/data/ru/timesheet/documentsWidget` }).as(
      `documentsWidget`
    );

    beforeRequest();

    cy.wait(
      [
        `@settings`,
        `@current`,
        `@states`,
        `@documentsStates`,
        `@signProviders`,
        `@vacationTypes`,
        `@employeesStatesList`,
        `@messageLanguage`,
        `@sectionsSettings`,
        `@staticData`,
        `@documents`,
        `@scheduleList`,
        `@notifications`,
        `@currentState`,
        `@popular`,
        `@vacationArray`,
        `@vacationBalance`,
        `@issues`,
        `@documentsWidget`,
      ],
      { timeout: 35000 }
    ).then(cb);
  }

  it('check responses', () => {
    interceptRequests(
      () => {
        cy.visit('/');
        cy.auth({ skipOnboarding: true });
        cy.setLocalStorage();
        cy.shouldTemplateBeLoaded(true);
      },
      (interceptions) => {
        interceptions.forEach(({ request, response }) => {
          if (response.statusCode !== 200) {
            throw new Error(
              `Method ${request.alias} has error! Url: ${request.url}`
            );
          }
        });
      }
    );
  });

  it('Displaying and downloading reports', () => {
    let date = '';
    cy.get('#cy-dashboard-salary-report-calendar input')
      .should('exist')
      .each((el) => {
        date = el.attr('data-date');
      });

    interceptReport(
      () => {
        cy.get('#cy-dashboard-salary-report-button').should('exist').click();
      },
      (interception) => {
        const normalizedDate = CyHelpers.normalizeDate(date);
        const { dateBegin, dateEnd } = interception.request.query;
        const firstDayInMonth = CyHelpers.normalizeDate(
          new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), 1)
        );
        const lastDayInMonth = CyHelpers.normalizeDate(
          new Date(
            normalizedDate.getFullYear(),
            normalizedDate.getMonth() + 1,
            0
          )
        );
        if (
          dateBegin !== firstDayInMonth.toISOString() ||
          dateEnd !== lastDayInMonth.toISOString()
        ) {
          throw new Error('Invalid dates');
        }
      }
    );
  });
});
