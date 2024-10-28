import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

async function enableMocking() {
  const { worker } = await import("./mocks/browser.js");
  await worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
