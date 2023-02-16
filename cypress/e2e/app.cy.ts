describe('Map', () => {
  it('should display the basic map', () => {
    cy.visit('http://localhost:3000/info');
    cy.get('[data-test-id="info-page"]').should('exist');
  });
});

const asModule = {};
export default asModule;
