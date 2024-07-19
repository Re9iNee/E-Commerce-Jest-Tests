import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";
describe("NotFound", () => {
  it("Should show a message", () => {
    // render the NotFound component
    render(<NotFound />);
    // check if the text "NotFound" is present
    expect(screen.getByText("NotFound")).toBeInTheDocument();
    // status code should be 404
    expect(screen.getByText("404")).toBeInTheDocument;
  });
});
