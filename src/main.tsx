import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

import { Layout } from "./components/layout.tsx";
import Home from "./routes/home.tsx";
import SmallEmbed from "./routes/embeds/small.tsx";
import User from "./routes/user.tsx";
import EmbedCustomizer from "./routes/embeds/customizer.tsx";
import CountEmbed from "./routes/embeds/count.tsx";
import Search from "./routes/search.tsx";
import LargeEmbed from "./routes/embeds/large.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="youtube/channel" element={<Search />} />
              <Route path="youtube/channel/:id" element={<User />} />
              <Route
                path="embed/youtube/channel/:id"
                element={<EmbedCustomizer />}
              />
            </Route>
            <Route path="/embed">
              <Route
                path="small/youtube/channel/:id"
                element={<SmallEmbed />}
              />
              <Route
                path="large/youtube/channel/:id"
                element={<LargeEmbed />}
              />
              <Route
                path="count/youtube/channel/:id"
                element={<CountEmbed />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </NuqsAdapter>
    </QueryClientProvider>
  </StrictMode>,
);
