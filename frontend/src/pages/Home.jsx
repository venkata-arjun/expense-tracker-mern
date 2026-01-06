import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Lock,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50/40 flex flex-col">
      {/* ── Navbar ──────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-gray-100 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-semibold text-xl shadow-sm">
              F
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Finlyt
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-gray-700 font-medium hover:text-gray-900 transition"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <main className="flex-grow pt-20 lg:pt-28">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
            {/* Text content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-6">
                <Sparkles size={16} />
                Modern personal finance
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Take control of
                <span className="block text-indigo-600 mt-2">
                  your finances
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
                Track expenses effortlessly, set realistic budgets, and get
                clear insights — all in one beautifully simple app.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
                >
                  Start for free
                  <ArrowRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
                >
                  Log in
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  Bank-level security
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-600" />
                  Actionable insights
                </div>
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-purple-600" />
                  Multiple accounts
                </div>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden lg:block">
              <img
                src={import.meta.env.VITE_HERO_IMAGE_URL}
                alt="Finlyt app dashboard showing expense tracking and charts"
                className="rounded-2xl shadow-2xl border border-gray-100 object-cover"
                width={600}
                height={450}
              />

              <div className="absolute -bottom-5 -right-5 bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-2 border border-gray-100 text-sm font-medium">
                <CheckCircle2 size={18} className="text-emerald-600" />
                Secure bank sync
              </div>
            </div>
          </div>
        </div>

        {/* ── Features with images ────────────────────────────────── */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                Everything you need to succeed financially
              </h2>
              <p className="mt-5 text-lg text-gray-600 max-w-3xl mx-auto">
                Simple, powerful tools designed for real life money management
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={import.meta.env.VITE_FEATURE1_IMAGE_URL}
                  alt="Quick transaction entry in finance app"
                  className="w-full h-56 object-cover"
                />
                <div className="p-7">
                  <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center mb-5">
                    <PlusCircle className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Effortless tracking
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Add transactions instantly, auto-categorization,
                    multi-account & currency support.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={import.meta.env.VITE_FEATURE2_IMAGE_URL}
                  alt="Financial charts and growth visualization"
                  className="w-full h-56 object-cover"
                />
                <div className="p-7">
                  <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center mb-5">
                    <TrendingUp className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Clear insights
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Beautiful charts, spending patterns, budget progress,
                    monthly reports — understand your money fast.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={import.meta.env.VITE_FEATURE3_IMAGE_URL}
                  alt="Person confidently managing finances on phone"
                  className="w-full h-56 object-cover"
                />
                <div className="p-7">
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
                    <Lock className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Privacy & security
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    End-to-end encryption, secure authentication, zero
                    unnecessary data collection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="col-span-1 flex flex-col items-start mb-8 sm:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-semibold">
                  F
                </div>
                <span className="text-xl font-bold text-gray-900">Finlyt</span>
              </div>
              <p className="text-sm text-gray-600 max-w-xs">
                Simple, secure personal finance for everyone.
              </p>
            </div>

            <div className="mb-8 sm:mb-0">
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <Link to="/features" className="hover:text-gray-900">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mb-8 sm:mb-0">
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <Link to="/about" className="hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-gray-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <Link to="/privacy" className="hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100 text-center text-xs sm:text-sm text-gray-500">
            © {new Date().getFullYear()} Finlyt • All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
