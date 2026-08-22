"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Logistics Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Welcome to Logistics Management System
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-5 py-2 text-white"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Shipments</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Delivered</p>
            <h2 className="mt-2 text-3xl font-bold">0</h2>
          </div>
        </div>
      </div>
    </main>
  );
}