// cypress/e2e/auth.cy.ts
// E2E Authentication Tests
// To run: npx cypress open (requires frontend running on localhost:3000)

describe("Authentication Flow", () => {

  // ── REGISTER ──
  describe("Register", () => {
    beforeEach(() => cy.visit("/auth/register"));

    it("should display register form", () => {
      cy.url().should("include", "/register");
    });

    it("should have email, username and password inputs", () => {
      cy.get('input[name="email"]').should("exist");
      cy.get('input[name="password"]').should("exist");
    });

    it("should have a submit button", () => {
      cy.get('button[type="submit"]').should("exist");
    });
  });

  // ── LOGIN ──
  describe("Login", () => {
    beforeEach(() => cy.visit("/auth/login"));

    it("should display login form", () => {
      cy.url().should("include", "/login");
    });

    it("should have email and password inputs", () => {
      cy.get('input[name="email"]').should("exist");
      cy.get('input[name="password"]').should("exist");
    });

    it("should have a submit button", () => {
      cy.get('button[type="submit"]').should("exist");
    });

    it("should allow typing in email and password", () => {
      cy.get('input[name="email"]').type("test@example.com");
      cy.get('input[name="password"]').type("password123");
      cy.get('input[name="email"]').should("have.value", "test@example.com");
      cy.get('input[name="password"]').should("have.value", "password123");
    });

    it("should show error with wrong credentials", () => {
      cy.get('input[name="email"]').type("wrong@email.com");
      cy.get('input[name="password"]').type("wrongpassword");
      cy.get('button[type="submit"]').click();
      cy.wait(1500);
      cy.url().should("include", "/login");
    });
  });

});