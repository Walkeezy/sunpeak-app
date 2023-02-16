describe('Map', () => {
  it('should display the basic map', () => {
    cy.visit('/');
    cy.get('div[class*="ol-viewport"]').should('be.visible');
  });
});

const asModule = {};
export default asModule;
