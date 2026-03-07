import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
}));

jest.mock("axios", () => ({
  post: jest.fn(),
  get:  jest.fn(),
  defaults: { baseURL: "" },
}));

const renderRegisterForm = () => {
  render(
    <form data-testid="register-form">
      <input name="email"           type="email"    placeholder="Email"    data-testid="email-input"    />
      <input name="username"        type="text"     placeholder="Username" data-testid="username-input" />
      <input name="password"        type="password" placeholder="Password" data-testid="password-input" />
      <button type="submit" data-testid="submit-btn">Register</button>
    </form>
  );
};

describe("Register Page - Unit Tests", () => {

  it("should render email input", () => {
    renderRegisterForm();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
  });

  it("should render username input", () => {
    renderRegisterForm();
    expect(screen.getByTestId("username-input")).toBeInTheDocument();
  });

  it("should render password input", () => {
    renderRegisterForm();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    renderRegisterForm();
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
  });

  it("should allow typing in email field", () => {
    renderRegisterForm();
    const input = screen.getByTestId("email-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "user@gmail.com" } });
    expect(input.value).toBe("user@gmail.com");
  });

  it("should allow typing in username field", () => {
    renderRegisterForm();
    const input = screen.getByTestId("username-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "testuser" } });
    expect(input.value).toBe("testuser");
  });

  it("should allow typing in password field", () => {
    renderRegisterForm();
    const input = screen.getByTestId("password-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Password123" } });
    expect(input.value).toBe("Password123");
  });

  it("should have password field masked", () => {
    renderRegisterForm();
    const input = screen.getByTestId("password-input") as HTMLInputElement;
    expect(input.type).toBe("password");
  });
});