"use client";

import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function CreateDriverPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await addDoc(collection(db, "drivers"), {
        name,
        phone,
        licenseNumber,
        status: "Available",
        createdAt: serverTimestamp(),
      });

      alert("Driver added successfully!");

      router.push("/admin/drivers");
    } catch (error) {
      console.error(
        "Error adding driver:",
        error
      );

      setError("Failed to add driver.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">

        {/* Back */}
        <button
          onClick={() =>
            router.push("/admin/drivers")
          }
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Drivers
        </button>

        {/* Heading */}
        <h1 className="mt-4 text-3xl font-bold">
          Add Driver
        </h1>

        <p className="mt-1 text-gray-500">
          Add a new delivery driver
        </p>

        {/* Form */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Driver Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Rahul Patel"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="9876543210"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* License */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                License Number
              </label>

              <input
                type="text"
                value={licenseNumber}
                onChange={(e) =>
                  setLicenseNumber(
                    e.target.value
                  )
                }
                placeholder="GJ0120230001234"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black p-3 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {loading
                ? "Adding Driver..."
                : "Add Driver"}
            </button>

          </form>

        </div>
      </div>
    </main>
  );
}