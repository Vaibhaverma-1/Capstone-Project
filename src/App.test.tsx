import "src/test/mocks/axiosMock";
import "src/test/mocks/browserMocks";

import { render, screen } from "@testing-library/react";
import App from "./App";

test("unknown route shows 404 page", () => {
  window.history.pushState({}, "", "/unknown-page");

  render(<App />);

  expect(screen.getByText("404")).toBeInTheDocument();
});
