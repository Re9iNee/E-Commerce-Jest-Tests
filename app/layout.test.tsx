import { fireEvent, render, screen } from "@testing-library/react";
import Layout from "./layout";

describe("Layout", () => {
  it("Should show a header and a footer", () => {
    render(<Layout>"No content"</Layout>);
    expect(screen.getByRole("header")).toBeInTheDocument();
    expect(screen.getByRole("footer")).toBeInTheDocument();
  });
  it("Should logout the user when the logout button is clicked", () => {
    render(<Layout>"No content"</Layout>);
    fireEvent.click(screen.getByText("Logout"));
    expect(screen.getByText("You have been logged out")).toBeInTheDocument();
    // check for the absence of the logout button
    expect(screen.queryByText("Logout")).toBeNull();
    // login button should be visible
    expect(screen.getByText("Login")).toBeInTheDocument();
    // the token must be removed from the local storage
    expect(localStorage.getItem("token")).toBeNull();
  });
});
