import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAxios from "jest-mock-axios";
import Page from "./page";

describe("User Registration", () => {
  it("Should register a user with valid data", async () => {
    const mockResponse = { data: { message: "Registration successful" } };
    MockAxios.mockImplementationOnce(() => Promise.resolve(mockResponse));

    render(<Page />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "newEmail" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/register", {
        email: "newuser@example.com",
        password: "password123",
      });
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Registration successful")).toBeInTheDocument();
    });
  });
  it("should show error message with invalid data", async () => {
    MockAxios.mockImplementationOnce(() =>
      Promise.reject(new Error("Registration failed"))
    );

    render(<Page />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invaliduser@example" }, // invalid email format
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "short" }, // password too short
    });

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/register", {
        email: "invaliduser@example",
        password: "short",
      });
      expect(screen.getByText("Registration failed")).toBeInTheDocument();
    });
  });
});
