describe('Map', () => {
  it('should display the basic map', () => {
    cy.visit('/');
    cy.get('[data-test-id="index-page"]').should('exist');
  });
});
