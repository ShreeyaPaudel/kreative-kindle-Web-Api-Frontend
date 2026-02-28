describe("Dashboard & Activities Flow", () => {
  beforeEach(() => {
    cy.login("auth_test_fixed@gmail.com", "Password123");
    cy.url().should("include", "/dashboard");
  });

  // ── DASHBOARD ──
  describe("Dashboard", () => {
    it("should display dashboard page", () => {
      cy.url().should("include", "/dashboard");
    });

    it("should show navigation bar", () => {
      cy.get("nav").should("exist");
    });

    it("should have link to activities", () => {
      cy.get("a").contains(/activities/i).should("exist");
    });
  });

  // ── ACTIVITIES ──
  describe("Activities", () => {
    beforeEach(() => cy.visit("/activities"));

    it("should display activities page", () => {
      cy.url().should("include", "/activities");
    });

    it("should show list of activities", () => {
      cy.get("div, article, li").should("have.length.greaterThan", 0);
    });

    it("should be able to click on an activity", () => {
      cy.get("a[href*='/activities/']").first().click();
      cy.url().should("include", "/activities/");
    });

    it("should show activity details", () => {
      cy.get("a[href*='/activities/']").first().click();
      cy.get("h1, h2").should("exist");
    });
  });

  // ── PROGRESS ──
  describe("Progress", () => {
    it("should navigate to progress page", () => {
      cy.visit("/progress");
      cy.url().should("include", "/progress");
    });
  });

  // ── FAVOURITES ──
  describe("Favourites", () => {
    it("should navigate to favourites page", () => {
      cy.visit("/favourites");
      cy.url().should("include", "/favourites");
    });
  });
});