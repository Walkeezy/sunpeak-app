describe('Map', () => {
  beforeEach(() => {
    cy.intercept('/api/data', { fixture: 'test-data.json' });
  });
  it('should display the basic map, fetch data and open a webcam', () => {
    cy.visit('/');
    cy.get('[data-test-id="index-page"]').should('exist');
    cy.get('[data-test-id="refresh-button"]').click();
    cy.get('[data-test-id="cam-thumbnail"]').first().click();
    cy.get('[data-test-id="cam-peek"]').should('exist');
  });
});
