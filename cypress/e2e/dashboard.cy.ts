// cypress/e2e/dashboard.cy.ts
// E2E Dashboard & Activities Flow Tests
// To run: npx cypress open (requires frontend running on localhost:3000)

describe("Dashboard & Activities Flow", () => {

  // ── DASHBOARD ──
  describe("Dashboard", () => {

    it("should display dashboard page", () => {
      cy.visit("/auth/dashboard");
      cy.url().should("include", "/dashboard");
    });

    it("should show navigation bar", () => {
      cy.visit("/auth/dashboard");
      cy.get("nav").should("exist");
    });

    it("should have link to activities", () => {
      cy.visit("/auth/dashboard");
      cy.get("a").contains(/activities/i).should("exist");
    });
  });

  // ── ACTIVITIES ──
  describe("Activities", () => {
    it("should display activities page", () => {
      cy.visit("/auth/dashboard/activities");
      cy.url().should("include", "/activities");
    });

    it("should show list of activities", () => {
      cy.visit("/auth/dashboard/activities");
      cy.get("div, article, li").should("have.length.greaterThan", 0);
    });
  });

  // ── NAVIGATION ──
  describe("Navigation", () => {
    it("should navigate to login page", () => {
      cy.visit("/auth/login");
      cy.url().should("include", "/login");
    });

    it("should navigate to register page", () => {
      cy.visit("/auth/register");
      cy.url().should("include", "/register");
    });

    it("should navigate to children page", () => {
      cy.visit("/auth/children");
      cy.url().should("include", "/children");
    });
  });

});