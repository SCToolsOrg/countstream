import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

import { Layout } from "./components/layout.tsx";
import App from "./routes/home.tsx";
import SmallEmbed from "./routes/embeds/small.tsx";
import User from "./routes/user.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<App />} />
              <Route path="/youtube/channel/:id" element={<User />} />
            </Route>
            <Route path="/embed">
              <Route
                path="/embed/small/youtube/channel/:id"
                element={<SmallEmbed />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </NuqsAdapter>
    </QueryClientProvider>
  </StrictMode>,
);
