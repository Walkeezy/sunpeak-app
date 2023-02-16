describe('Navigation', () => {
  it('should navigate to the info page', () => {
    cy.visit('/');
    cy.get('a[href*="info"]').click();
    cy.url().should('include', '/info');
    cy.get('p').contains('This interactive map displays webcams from all over Switzerland');
  });
});

const asModule = {};
export default asModule;
