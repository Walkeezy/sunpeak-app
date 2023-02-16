describe('Map', () => {
  it('should display the basic map', () => {
    cy.visit('http://localhost:3000/');
    cy.get('[data-test-id="index-page"]').should('exist');
  });
});

const asModule = {};
export default asModule;
