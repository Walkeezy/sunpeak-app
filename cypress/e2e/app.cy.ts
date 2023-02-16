describe('Map', () => {
  it('should display the basic map', () => {
    cy.visit('/info');
    cy.get('[data-test-id="info-page"]').should('exist');
  });
});
