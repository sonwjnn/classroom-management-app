import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-phone-number-input/style.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./providers/query-provider";
import { Modals } from "./components/modals.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <Modals />
        <App />
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
);
