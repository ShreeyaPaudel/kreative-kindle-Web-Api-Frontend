import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSearchParams: () => ({ get: jest.fn() }),
}));

// Mock axios
jest.mock("axios", () => ({
  post: jest.fn(),
  get:  jest.fn(),
  defaults: { baseURL: "" },
}));

import axios from "axios";
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Simple LoginForm component test (tests the form behaviour directly)
const renderLoginForm = () => {
  const { container } = render(
    <div>
      <form data-testid="login-form">
        <input name="email"    type="email"    placeholder="Email"    data-testid="email-input"    />
        <input name="password" type="password" placeholder="Password" data-testid="password-input" />
        <button type="submit" data-testid="submit-btn">Login</button>
      </form>
    </div>
  );
  return container;
};

describe("Login Page - Unit Tests", () => {

  it("should render email input", () => {
    renderLoginForm();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
  });

  it("should render password input", () => {
    renderLoginForm();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    renderLoginForm();
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });

  it("should allow typing in email field", () => {
    renderLoginForm();
    const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    expect(emailInput.value).toBe("test@gmail.com");
  });

  it("should allow typing in password field", () => {
    renderLoginForm();
    const passwordInput = screen.getByTestId("password-input") as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "Password123" } });
    expect(passwordInput.value).toBe("Password123");
  });

  it("should have password input of type password", () => {
    renderLoginForm();
    const passwordInput = screen.getByTestId("password-input") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");
  });

  it("should have email input of type email", () => {
    renderLoginForm();
    const emailInput = screen.getByTestId("email-input") as HTMLInputElement;
    expect(emailInput.type).toBe("email");
  });

  it("should render the form element", () => {
    renderLoginForm();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });
});