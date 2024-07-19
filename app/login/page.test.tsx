/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "./page";
import { faker } from "@faker-js/faker";
import axios from "axios";
import mockAxios from "jest-mock-axios";

import "@testing-library/jest-dom/extend-expect";

describe("User Login", () => {
  it("Should show fields and a button to login", () => {
    render(<Page />);
    expect(screen.getByRole("heading")).toHaveTextContent("Login");
    //   expect to have an email input
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    //   expect to have a password input
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    //   expect to have a login button with login text
    expect(screen.getByRole("button")).toHaveTextContent("Login");
    //   expect to have a link to the register page
    expect(screen.getByText("Register")).toBeInTheDocument();
  });
  it("Should show error message when email is invalid", () => {
    render(<Page />);
    const emailInput = screen.getByLabelText("Email");
    const loginButton = screen.getByRole("button");

    //   expect to show error message when email is invalid
    emailInput.textContent = "invalid-email";
    loginButton.click();
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });
  it("Should show error message when password is empty", () => {
    render(<Page />);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByRole("button");

    emailInput.textContent = faker.internet.email();
    passwordInput.textContent = "";
    loginButton.click();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });
  it("should login user with correct credentials", async () => {
    const mockResponse = { data: { message: "Login successful" } };
    mockAxios.mockImplementationOnce(() => Promise.resolve(mockResponse));

    render(<Page />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "correctUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "correctPass" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/login", {
        username: "correctUser",
        password: "correctPass",
      });
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
  it("should show error message with incorrect credentials", async () => {
    mockAxios.mockImplementationOnce(() =>
      Promise.reject(new Error("Invalid credentials"))
    );

    render(<Page />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "wrongEmail" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongPass" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/login", {
        username: "wrongEmail",
        password: "wrongPass",
      });
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
