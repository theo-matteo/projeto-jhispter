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

describe('Estudante e2e test', () => {
  const estudantePageUrl = '/estudante';
  const estudantePageUrlPattern = new RegExp('/estudante(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const estudanteSample = { nomeEstudante: 'glider', email: 'Norberto_Macedo4@live.com', telefone: 'though fax gracefully' };

  let estudante;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/estudantes+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/estudantes').as('postEntityRequest');
    cy.intercept('DELETE', '/api/estudantes/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (estudante) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/estudantes/${estudante.id}`,
      }).then(() => {
        estudante = undefined;
      });
    }
  });

  it('Estudantes menu should load Estudantes page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('estudante');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Estudante').should('exist');
    cy.url().should('match', estudantePageUrlPattern);
  });

  describe('Estudante page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(estudantePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Estudante page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/estudante/new$'));
        cy.getEntityCreateUpdateHeading('Estudante');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', estudantePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/estudantes',
          body: estudanteSample,
        }).then(({ body }) => {
          estudante = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/estudantes+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [estudante],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(estudantePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Estudante page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('estudante');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', estudantePageUrlPattern);
      });

      it('edit button click should load edit Estudante page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Estudante');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', estudantePageUrlPattern);
      });

      it('edit button click should load edit Estudante page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Estudante');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', estudantePageUrlPattern);
      });

      it('last delete button click should delete instance of Estudante', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('estudante').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', estudantePageUrlPattern);

        estudante = undefined;
      });
    });
  });

  describe('new Estudante page', () => {
    beforeEach(() => {
      cy.visit(`${estudantePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Estudante');
    });

    it('should create an instance of Estudante', () => {
      cy.get(`[data-cy="nomeEstudante"]`).type('awesome cooperative');
      cy.get(`[data-cy="nomeEstudante"]`).should('have.value', 'awesome cooperative');

      cy.get(`[data-cy="email"]`).type('Rafael_Moreira@live.com');
      cy.get(`[data-cy="email"]`).should('have.value', 'Rafael_Moreira@live.com');

      cy.get(`[data-cy="telefone"]`).type('hope');
      cy.get(`[data-cy="telefone"]`).should('have.value', 'hope');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        estudante = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', estudantePageUrlPattern);
    });
  });
});
