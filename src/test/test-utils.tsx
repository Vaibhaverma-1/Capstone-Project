import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "src/context/appContext";
import ThemeProvider from "src/theme/antdTheme";

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <AppContextProvider>
      <BrowserRouter>
        <ThemeProvider>{ui}</ThemeProvider>
      </BrowserRouter>
    </AppContextProvider>,
  );
}
