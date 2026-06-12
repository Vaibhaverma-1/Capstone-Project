import { render, screen } from "@testing-library/react";
import OfflineBanner from "./index";

test("renders offline banner warning when offline", () => {
  jest.spyOn(navigator, "onLine", "get").mockReturnValue(false);

  render(<OfflineBanner />);

  expect(screen.getByText("Offline Mode")).toBeInTheDocument();
});

test("does not render banner when online", () => {
  jest.spyOn(navigator, "onLine", "get").mockReturnValue(true);

  render(<OfflineBanner />);

  expect(screen.queryByText("Offline Mode")).not.toBeInTheDocument();
});
