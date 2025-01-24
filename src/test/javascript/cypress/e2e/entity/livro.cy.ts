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

describe('Livro e2e test', () => {
  const livroPageUrl = '/livro';
  const livroPageUrlPattern = new RegExp('/livro(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const livroSample = { titulo: 'modulo pish', quantidade: 15219 };

  let livro;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/livros+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/livros').as('postEntityRequest');
    cy.intercept('DELETE', '/api/livros/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (livro) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/livros/${livro.id}`,
      }).then(() => {
        livro = undefined;
      });
    }
  });

  it('Livros menu should load Livros page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('livro');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Livro').should('exist');
    cy.url().should('match', livroPageUrlPattern);
  });

  describe('Livro page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(livroPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Livro page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/livro/new$'));
        cy.getEntityCreateUpdateHeading('Livro');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', livroPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/livros',
          body: livroSample,
        }).then(({ body }) => {
          livro = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/livros+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [livro],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(livroPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Livro page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('livro');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', livroPageUrlPattern);
      });

      it('edit button click should load edit Livro page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Livro');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', livroPageUrlPattern);
      });

      it('edit button click should load edit Livro page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Livro');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', livroPageUrlPattern);
      });

      it('last delete button click should delete instance of Livro', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('livro').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', livroPageUrlPattern);

        livro = undefined;
      });
    });
  });

  describe('new Livro page', () => {
    beforeEach(() => {
      cy.visit(`${livroPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Livro');
    });

    it('should create an instance of Livro', () => {
      cy.get(`[data-cy="titulo"]`).type('blaspheme as');
      cy.get(`[data-cy="titulo"]`).should('have.value', 'blaspheme as');

      cy.get(`[data-cy="quantidade"]`).type('16619');
      cy.get(`[data-cy="quantidade"]`).should('have.value', '16619');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        livro = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', livroPageUrlPattern);
    });
  });
});
