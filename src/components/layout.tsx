import { Link, Outlet } from "react-router";

export function Layout() {
  return (
    <>
      <header className="px-4 py-3 border-b border-zinc-600 flex justify-between">
        <Link to="/" className="flex items-center gap-1">
          <h1 className="text-xl font-semibold">CountStream</h1>
          <sub className="text-purple-500">by SCTools</sub>
        </Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
