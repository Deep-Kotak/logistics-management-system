"use client";

import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function CreateVehiclePage() {
  const router = useRouter();

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [capacity, setCapacity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await addDoc(
        collection(db, "vehicles"),
        {
          vehicleNumber,
          vehicleType,
          capacity: Number(capacity),
          status: "Available",
          createdAt: serverTimestamp(),
        }
      );

      alert("Vehicle added successfully!");

      router.push("/admin/vehicles");
    } catch (error) {
      console.error(
        "Error adding vehicle:",
        error
      );

      setError(
        "Failed to add vehicle."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl">

        {/* Back Button */}
        <button
          onClick={() =>
            router.push("/admin/vehicles")
          }
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Vehicles
        </button>

        {/* Heading */}
        <h1 className="mt-4 text-3xl font-bold">
          Add Vehicle
        </h1>

        <p className="mt-1 text-gray-500">
          Add a new vehicle to your fleet
        </p>

        {/* Form */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Vehicle Number */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Vehicle Number
              </label>

              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) =>
                  setVehicleNumber(
                    e.target.value
                  )
                }
                placeholder="GJ01AB1234"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Vehicle Type
              </label>

              <select
                value={vehicleType}
                onChange={(e) =>
                  setVehicleType(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-lg border p-3"
              >
                <option value="">
                  Select vehicle type
                </option>

                <option value="Truck">
                  Truck
                </option>

                <option value="Van">
                  Van
                </option>

                <option value="Mini Truck">
                  Mini Truck
                </option>

                <option value="Pickup">
                  Pickup
                </option>
              </select>
            </div>

            {/* Capacity */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Capacity (kg)
              </label>

              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) =>
                  setCapacity(
                    e.target.value
                  )
                }
                placeholder="5000"
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
                ? "Adding Vehicle..."
                : "Add Vehicle"}
            </button>

          </form>

        </div>
      </div>
    </main>
  );
}