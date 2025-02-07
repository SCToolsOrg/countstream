import { useQueryClient } from "@tanstack/react-query";
import { Info } from "lucide-react";
import { Link, Outlet } from "react-router";

export function Layout() {
  const queryClient = useQueryClient();

  return (
    <>
      <div className="border-b border-zinc-600">
        <header className="mx-auto flex w-full max-w-7xl justify-between px-4 py-3">
          <Link
            to="/"
            onClick={() => {
              queryClient.clear();
            }}
            className="flex items-center gap-1"
          >
            <h1 className="text-xl font-semibold">CountStream</h1>
            <sub className="text-purple-500">by SCTools</sub>
          </Link>
        </header>
      </div>
      <main className="mx-auto w-full max-w-7xl p-3">
        <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-700/50 px-3 pb-2 pt-3 text-center text-sm text-yellow-300">
          <Info className="mb-1 mr-1.5 inline size-4" />
          CountStream is currently in beta. Expect some bugs and missing
          features.
        </div>
        <Outlet />
      </main>
    </>
  );
}
