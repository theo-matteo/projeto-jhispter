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

describe('Autor e2e test', () => {
  const autorPageUrl = '/autor';
  const autorPageUrlPattern = new RegExp('/autor(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const autorSample = { nomeAutor: 'out smarten' };

  let autor;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/autors+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/autors').as('postEntityRequest');
    cy.intercept('DELETE', '/api/autors/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (autor) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/autors/${autor.id}`,
      }).then(() => {
        autor = undefined;
      });
    }
  });

  it('Autors menu should load Autors page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('autor');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Autor').should('exist');
    cy.url().should('match', autorPageUrlPattern);
  });

  describe('Autor page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(autorPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Autor page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/autor/new$'));
        cy.getEntityCreateUpdateHeading('Autor');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', autorPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/autors',
          body: autorSample,
        }).then(({ body }) => {
          autor = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/autors+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [autor],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(autorPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Autor page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('autor');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', autorPageUrlPattern);
      });

      it('edit button click should load edit Autor page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Autor');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', autorPageUrlPattern);
      });

      it('edit button click should load edit Autor page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Autor');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', autorPageUrlPattern);
      });

      it('last delete button click should delete instance of Autor', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('autor').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', autorPageUrlPattern);

        autor = undefined;
      });
    });
  });

  describe('new Autor page', () => {
    beforeEach(() => {
      cy.visit(`${autorPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Autor');
    });

    it('should create an instance of Autor', () => {
      cy.get(`[data-cy="nomeAutor"]`).type('gadzooks');
      cy.get(`[data-cy="nomeAutor"]`).should('have.value', 'gadzooks');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        autor = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', autorPageUrlPattern);
    });
  });
});
