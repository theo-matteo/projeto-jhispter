import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('Emprestimo e2e test', () => {
  const emprestimoPageUrl = '/emprestimo';
  const emprestimoPageUrlPattern = new RegExp('/emprestimo(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const emprestimoSample = { dataEmprestimo: '2025-01-23T15:32:22.226Z', status: 'harvest' };

  let emprestimo;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/emprestimos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/emprestimos').as('postEntityRequest');
    cy.intercept('DELETE', '/api/emprestimos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (emprestimo) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/emprestimos/${emprestimo.id}`,
      }).then(() => {
        emprestimo = undefined;
      });
    }
  });

  it('Emprestimos menu should load Emprestimos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('emprestimo');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Emprestimo').should('exist');
    cy.url().should('match', emprestimoPageUrlPattern);
  });

  describe('Emprestimo page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(emprestimoPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Emprestimo page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/emprestimo/new$'));
        cy.getEntityCreateUpdateHeading('Emprestimo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', emprestimoPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/emprestimos',
          body: emprestimoSample,
        }).then(({ body }) => {
          emprestimo = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/emprestimos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [emprestimo],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(emprestimoPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Emprestimo page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('emprestimo');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', emprestimoPageUrlPattern);
      });

      it('edit button click should load edit Emprestimo page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Emprestimo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', emprestimoPageUrlPattern);
      });

      it('edit button click should load edit Emprestimo page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Emprestimo');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', emprestimoPageUrlPattern);
      });

      it('last delete button click should delete instance of Emprestimo', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('emprestimo').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', emprestimoPageUrlPattern);

        emprestimo = undefined;
      });
    });
  });

  describe('new Emprestimo page', () => {
    beforeEach(() => {
      cy.visit(`${emprestimoPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Emprestimo');
    });

    it('should create an instance of Emprestimo', () => {
      cy.get(`[data-cy="dataEmprestimo"]`).type('2025-01-24T10:26');
      cy.get(`[data-cy="dataEmprestimo"]`).blur();
      cy.get(`[data-cy="dataEmprestimo"]`).should('have.value', '2025-01-24T10:26');

      cy.get(`[data-cy="status"]`).type('outside towards');
      cy.get(`[data-cy="status"]`).should('have.value', 'outside towards');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        emprestimo = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', emprestimoPageUrlPattern);
    });
  });
});
