"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* ================= NAVBAR ================= */}

      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-lg font-bold text-white">
              L
            </div>

            <div>
              <h1 className="font-bold tracking-tight">
                LogisticsPro
              </h1>

              <p className="text-xs text-gray-500">
                Smart Logistics Management
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-gray-600 transition hover:text-black"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-gray-600 transition hover:text-black"
            >
              How It Works
            </a>

            <a
              href="#about"
              className="text-sm text-gray-600 transition hover:text-black"
            >
              About
            </a>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Login
          </button>

        </div>
      </nav>

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden bg-gray-50">

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">

          {/* LEFT */}

          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Modern Logistics Management
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Move your logistics
              <span className="block text-gray-500">
                with confidence.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Manage orders, shipments, vehicles and drivers
              from one powerful platform. Keep your logistics
              operations organized and your customers informed.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              <button
                onClick={() => router.push("/login")}
                className="rounded-xl bg-black px-7 py-3.5 font-medium text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-gray-800"
              >
                Access Dashboard →
              </button>

              <button
                onClick={() => {
                  document
                    .getElementById("features")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-medium transition hover:bg-gray-100"
              >
                Explore Features
              </button>

            </div>

            {/* TRUST */}

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-500">

              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Real-time tracking
              </div>

              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Secure platform
              </div>

              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                Centralized management
              </div>

            </div>

          </div>

          {/* RIGHT - DASHBOARD VISUAL */}

          <div className="relative">

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gray-200 blur-3xl" />

            <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">

              {/* CARD HEADER */}

              <div className="flex items-center justify-between border-b pb-4">

                <div>
                  <p className="text-sm text-gray-500">
                    Shipment Overview
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Logistics Dashboard
                  </h3>
                </div>

                <div className="rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700">
                  Live
                </div>

              </div>

              {/* STATS */}

              <div className="mt-5 grid grid-cols-3 gap-3">

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    Orders
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    248
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    Shipments
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    186
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    Delivered
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    164
                  </p>
                </div>

              </div>

              {/* ROUTE */}

              <div className="mt-5 rounded-xl border p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs text-gray-500">
                      Shipment
                    </p>

                    <p className="mt-1 font-bold">
                      SHP-001
                    </p>
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    In Transit
                  </span>

                </div>

                <div className="mt-6 flex items-center gap-3">

                  <div className="text-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs text-white">
                      A
                    </div>

                    <p className="mt-2 text-xs font-medium">
                      Ahmedabad
                    </p>
                  </div>

                  <div className="flex-1">

                    <div className="relative h-1 rounded-full bg-gray-200">

                      <div className="absolute left-0 top-0 h-1 w-2/3 rounded-full bg-black" />

                    </div>

                    <p className="mt-2 text-center text-xs text-gray-500">
                      Vehicle GJ01AB1234
                    </p>

                  </div>

                  <div className="text-center">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-medium">
                      M
                    </div>

                    <p className="mt-2 text-xs font-medium">
                      Mumbai
                    </p>

                  </div>

                </div>

              </div>

              {/* DRIVER */}

              <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                    RP
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Rahul Patel
                    </p>

                    <p className="text-xs text-gray-500">
                      Assigned Driver
                    </p>
                  </div>

                </div>

                <span className="text-xs text-gray-500">
                  Active
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <section className="border-b border-gray-100 bg-white">

        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-100 md:grid-cols-4">

          <div className="p-8 text-center">
            <p className="text-3xl font-bold">
              100%
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Centralized Data
            </p>
          </div>

          <div className="p-8 text-center">
            <p className="text-3xl font-bold">
              24/7
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Shipment Visibility
            </p>
          </div>

          <div className="p-8 text-center">
            <p className="text-3xl font-bold">
              Real-Time
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Tracking
            </p>
          </div>

          <div className="p-8 text-center">
            <p className="text-3xl font-bold">
              Secure
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Firebase Security
            </p>
          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section
        id="features"
        className="px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Platform Features
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage logistics
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              A centralized system designed to simplify
              logistics operations from order creation to
              final delivery.
            </p>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {/* FEATURE 1 */}

            <div className="group rounded-2xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                📦
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                Order Management
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Organize customer orders and keep all
                important information in one place.
              </p>

            </div>

            {/* FEATURE 2 */}

            <div className="group rounded-2xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                🚚
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                Shipment Tracking
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Track shipment status, routes and delivery
                information from one dashboard.
              </p>

            </div>

            {/* FEATURE 3 */}

            <div className="group rounded-2xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                🚗
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                Vehicle Management
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Manage vehicles and assign the right vehicle
                to each shipment.
              </p>

            </div>

            {/* FEATURE 4 */}

            <div className="group rounded-2xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                👨‍✈️
              </div>

              <h3 className="mt-6 text-lg font-semibold">
                Driver Management
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Manage drivers and assign them to active
                shipments efficiently.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section
        id="how-it-works"
        className="bg-gray-50 px-6 py-24"
      >

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Simple Workflow
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              From order to delivery
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Manage the complete shipment lifecycle
              through a simple and organized workflow.
            </p>

          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">

            {[
              {
                number: "01",
                title: "Manage Orders",
                text: "Create and manage customer orders.",
              },
              {
                number: "02",
                title: "Create Shipment",
                text: "Convert orders into shipments.",
              },
              {
                number: "03",
                title: "Assign Resources",
                text: "Assign vehicles and drivers.",
              },
              {
                number: "04",
                title: "Track Delivery",
                text: "Monitor shipment status in real time.",
              },
            ].map((item) => (

              <div
                key={item.number}
                className="relative rounded-2xl border border-gray-200 bg-white p-7"
              >

                <p className="text-sm font-bold text-gray-400">
                  {item.number}
                </p>

                <h3 className="mt-4 text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {item.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= ABOUT ================= */}

      <section
        id="about"
        className="px-6 py-24"
      >

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">

          <div>

            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Built for modern logistics
            </p>

            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              One platform.
              <br />
              Complete visibility.
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              LogisticsPro brings orders, shipments,
              vehicles and drivers together in one
              centralized system. Administrators can
              manage operations while customers can
              easily track their shipments.
            </p>

            <button
              onClick={() => router.push("/login")}
              className="mt-8 rounded-xl bg-black px-7 py-3.5 font-medium text-white transition hover:bg-gray-800"
            >
              Get Started →
            </button>

          </div>

          <div className="rounded-2xl bg-black p-8 text-white shadow-xl">

            <h3 className="text-xl font-semibold">
              Why LogisticsPro?
            </h3>

            <div className="mt-8 space-y-6">

              <div className="flex gap-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black">
                  ✓
                </div>

                <div>
                  <h4 className="font-medium">
                    Centralized Management
                  </h4>

                  <p className="mt-1 text-sm text-gray-400">
                    Keep logistics data organized in one
                    platform.
                  </p>
                </div>

              </div>

              <div className="flex gap-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black">
                  ✓
                </div>

                <div>
                  <h4 className="font-medium">
                    Real-Time Tracking
                  </h4>

                  <p className="mt-1 text-sm text-gray-400">
                    Keep customers informed about their
                    shipments.
                  </p>
                </div>

              </div>

              <div className="flex gap-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black">
                  ✓
                </div>

                <div>
                  <h4 className="font-medium">
                    Role-Based Access
                  </h4>

                  <p className="mt-1 text-sm text-gray-400">
                    Separate customer and administrator
                    permissions.
                  </p>
                </div>

              </div>

              <div className="flex gap-4">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black">
                  ✓
                </div>

                <div>
                  <h4 className="font-medium">
                    Secure Data
                  </h4>

                  <p className="mt-1 text-sm text-gray-400">
                    Firebase authentication and Firestore
                    security rules.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="bg-black px-6 py-24 text-white">

        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-black">
            L
          </div>

          <h2 className="mt-6 text-3xl font-bold sm:text-4xl">
            Ready to simplify your logistics?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-400">
            Access your dashboard and manage your
            logistics operations from one place.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="mt-8 rounded-xl bg-white px-8 py-3.5 font-medium text-black transition hover:bg-gray-200"
          >
            Login to Get Started
          </button>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-gray-800 bg-black px-6 py-8 text-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="font-semibold">
              LogisticsPro
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Smart Logistics Management System
            </p>
          </div>

          <p className="text-sm text-gray-500">
            © 2026 LogisticsPro. All rights reserved.
          </p>

        </div>

      </footer>

    </main>
  );
}