import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/server/auth/require-admin";

const managementLinks = [
  {
    number: "01",
    title: "Product catalogue",
    description: "Manage product details, pricing, stock and visibility.",
    href: "/admin/products",
    action: "Manage catalogue",
  },
  {
    number: "02",
    title: "Add new jewellery",
    description: "Create a product listing with images and inventory details.",
    href: "/admin/products/new",
    action: "Create product",
  },
];

export default async function AdminDashboardPage() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#F8F3EC] text-[#321719]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[260px] shrink-0 flex-col bg-[#321719] px-7 py-9 text-[#FFF8EF] md:flex">
          <Link href="/" className="block">
            <p className="font-serif text-xl tracking-[0.12em]">
              AURA OF SHREE
            </p>
            <p className="mt-2 text-[9px] tracking-[0.42em] text-[#D8B783]">
              J E W E L L E R Y
            </p>
          </Link>

          <div className="my-9 border-t border-white/15" />

          <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[#D8B783]">
            Workspace
          </p>

          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm"
          >
            <span className="text-[#D8B783]">◆</span>
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className="mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-[#D8B783]">◇</span>
            Products & inventory
          </Link>

          <Link
            href="/admin/products/new"
            className="mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <span className="text-[#D8B783]">＋</span>
            Add product
          </Link>

          <div className="mt-auto border-t border-white/15 pt-6">
            <Link
              href="/"
              className="text-sm text-white/75 transition hover:text-white"
            >
              ← Visit storefront
            </Link>
            <p className="mt-5 text-[10px] leading-5 text-white/45">
              AURA OF SHREE JEWELLERY
              <br />
              Store management
            </p>
          </div>
        </aside>

        {/* Main workspace */}
        <div className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-[#E9DED0] bg-[#FFFCF7] px-5 py-5 sm:px-9 lg:px-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#8B7466]">
                Store management
              </p>
              <p className="mt-1 font-serif text-lg">Aura of Shree</p>
            </div>

            <Link
              href="/"
              className="rounded-full border border-[#DCCBB7] px-4 py-2.5 text-xs font-medium transition hover:border-[#321719] hover:bg-[#F8F3EC]"
            >
              View storefront ↗
            </Link>
          </header>

          <div className="mx-auto max-w-[1440px] px-5 py-9 sm:px-9 sm:py-12 lg:px-12">
            {/* Welcome */}
            <section className="relative overflow-hidden rounded-2xl bg-[#432124] px-6 py-9 text-[#FFF8EF] sm:px-10 sm:py-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border border-[#D8B783]/20"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-1 top-[-35px] h-56 w-56 rounded-full border border-[#D8B783]/15"
              />

              <div className="relative max-w-2xl">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D8B783]">
                  Your private workspace
                </p>

                <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                  Welcome to your
                  <br />
                  jewellery atelier.
                </h1>

                <p className="mt-4 max-w-lg text-sm leading-7 text-white/70">
                  Curate your collections, maintain accurate inventory, and keep
                  your online jewellery store beautifully presented.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/admin/products"
                    className="rounded-full bg-[#E6C99C] px-6 py-3 text-sm font-semibold text-[#321719] transition hover:bg-[#F1DDBB]"
                  >
                    Open product catalogue →
                  </Link>

                  <Link
                    href="/admin/products/new"
                    className="rounded-full border border-white/25 px-6 py-3 text-sm text-white transition hover:bg-white/10"
                  >
                    + Add a product
                  </Link>
                </div>
              </div>
            </section>

            {/* Section heading */}
            <section className="mt-11">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#9B7958]">
                    Management
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">Your workspace</h2>
                </div>

                <p className="text-xs text-[#8B7466]">
                  Select an area to get started
                </p>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {managementLinks.map((item) => (
                  <Link
                    key={item.number}
                    href={item.href}
                    className="group rounded-2xl border border-[#E6D8C7] bg-[#FFFCF7] p-6 transition duration-200 hover:-translate-y-1 hover:border-[#B99A72] hover:shadow-[0_14px_35px_rgba(50,23,25,0.06)] sm:p-8"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-serif text-4xl text-[#C5A77E]">
                        {item.number}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E6D8C7] transition group-hover:border-[#321719] group-hover:bg-[#321719] group-hover:text-white">
                        ↗
                      </span>
                    </div>

                    <h3 className="mt-7 font-serif text-2xl">{item.title}</h3>

                    <p className="mt-3 max-w-md text-sm leading-6 text-[#806D60]">
                      {item.description}
                    </p>

                    <div className="mt-7 flex items-center justify-between border-t border-[#EDE3D8] pt-5">
                      <span className="text-sm font-semibold">
                        {item.action}
                      </span>
                      <span className="text-[#9B7958] transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Quick actions */}
            <section className="mt-10 rounded-2xl border border-[#E6D8C7] bg-[#F1E7DA] p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#9B7958]">
                Quick access
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Keep your store in order
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Link
                  href="/admin/products"
                  className="rounded-xl border border-[#E0D0BD] bg-[#FFFCF7] p-4 transition hover:border-[#B99A72]"
                >
                  <p className="text-sm font-semibold">Review inventory</p>
                  <p className="mt-2 text-xs leading-5 text-[#806D60]">
                    Check stock levels and prices.
                  </p>
                </Link>

                <Link
                  href="/admin/products"
                  className="rounded-xl border border-[#E0D0BD] bg-[#FFFCF7] p-4 transition hover:border-[#B99A72]"
                >
                  <p className="text-sm font-semibold">Update listings</p>
                  <p className="mt-2 text-xs leading-5 text-[#806D60]">
                    Edit existing jewellery products.
                  </p>
                </Link>

                <Link
                  href="/admin/products/new"
                  className="rounded-xl border border-[#E0D0BD] bg-[#FFFCF7] p-4 transition hover:border-[#B99A72]"
                >
                  <p className="text-sm font-semibold">Expand collection</p>
                  <p className="mt-2 text-xs leading-5 text-[#806D60]">
                    Introduce a new product listing.
                  </p>
                </Link>
              </div>
            </section>

            <footer className="mt-10 flex flex-wrap justify-between gap-3 border-t border-[#E6D8C7] pt-5 text-[11px] text-[#8B7466]">
              <p>Aura of Shree Jewellery · Administration</p>
              <p>Authorized access only</p>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
