import { Link, Outlet } from "react-router";

export function Layout() {
  return (
    <>
      <div className="border-b border-zinc-600">
        <header className="px-4 py-3 flex justify-between w-full max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-1">
            <h1 className="text-xl font-semibold">CountStream</h1>
            <sub className="text-purple-500">by SCTools</sub>
          </Link>
        </header>
      </div>
      <main className="w-full max-w-7xl mx-auto p-4">
        <Outlet />
      </main>
    </>
  );
}
