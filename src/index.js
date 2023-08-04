import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App.js";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Cannot find the root element with that ID");

const root = createRoot(rootEl);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
