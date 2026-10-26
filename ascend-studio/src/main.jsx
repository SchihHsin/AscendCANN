import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./prototype-polish.css";
import "./scrollbar-autohide.css";
import "./canvas-reference-style.css";
import "./shared/canvas/canvas.css";
import "./scrollbar-autohide.js";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
