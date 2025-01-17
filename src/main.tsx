import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "./routes/home.tsx";
import { Layout } from "./components/layout.tsx";
import User from "./routes/user.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/youtube/channel/:id" element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
