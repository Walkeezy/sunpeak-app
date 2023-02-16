describe("Navigation", () => {
  it("should navigate to the info page", () => {
    // Start from the index page
    cy.visit("/");

    // Find a link with an href attribute containing "about" and click it
    cy.get('a[href*="info"]').click();

    // The new url should include "/about"
    cy.url().should("include", "/info");

    // The new page should contain an h1 with "About page"
    cy.get("h1").contains(
      "This interactive map displays webcams from all over Switzerland"
    );
  });
});
