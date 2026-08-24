"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type Vehicle = {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  capacity: number;
  status: string;
};

export default function VehiclesPage() {
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch vehicles from Firestore
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehiclesQuery = query(
          collection(db, "vehicles"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(vehiclesQuery);

        const vehicleData: Vehicle[] =
          snapshot.docs.map((vehicleDoc) => {
            const data = vehicleDoc.data();

            return {
              id: vehicleDoc.id,
              vehicleNumber:
                data.vehicleNumber || "",
              vehicleType:
                data.vehicleType || "",
              capacity:
                data.capacity || 0,
              status:
                data.status || "Available",
            };
          });

        setVehicles(vehicleData);
      } catch (error) {
        console.error(
          "Error fetching vehicles:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Delete Vehicle
  const handleDeleteVehicle = async (
    vehicleId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "vehicles", vehicleId)
      );

      setVehicles((currentVehicles) =>
        currentVehicles.filter(
          (vehicle) =>
            vehicle.id !== vehicleId
        )
      );
    } catch (error) {
      console.error(
        "Error deleting vehicle:",
        error
      );

      alert("Failed to delete vehicle.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <button
              onClick={() =>
                router.push("/admin")
              }
              className="text-sm text-gray-500 hover:underline"
            >
              ← Back to Dashboard
            </button>

            <h1 className="mt-2 text-3xl font-bold">
              Vehicle Management
            </h1>

            <p className="mt-1 text-gray-500">
              Manage logistics vehicles
            </p>
          </div>

          <button
            onClick={() =>
              router.push(
                "/admin/vehicles/create"
              )
            }
            className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
          >
            + Add Vehicle
          </button>

        </header>

        {/* Statistics */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatusCard
            title="Total Vehicles"
            value={vehicles.length}
          />

          <StatusCard
            title="Available"
            value={
              vehicles.filter(
                (vehicle) =>
                  vehicle.status ===
                  "Available"
              ).length
            }
          />

          <StatusCard
            title="Assigned"
            value={
              vehicles.filter(
                (vehicle) =>
                  vehicle.status ===
                  "Assigned"
              ).length
            }
          />

          <StatusCard
            title="Maintenance"
            value={
              vehicles.filter(
                (vehicle) =>
                  vehicle.status ===
                  "Maintenance"
              ).length
            }
          />

        </section>

        {/* Vehicle List */}
        <section className="mt-8 rounded-xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                All Vehicles
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your fleet
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {vehicles.length} vehicles
            </span>

          </div>

          {/* Loading */}
          {loading ? (
            <p className="mt-6 text-gray-500">
              Loading vehicles...
            </p>
          ) : vehicles.length === 0 ? (

            /* Empty */
            <div className="mt-6 rounded-lg border border-dashed p-8 text-center">

              <p className="text-gray-500">
                No vehicles available.
              </p>

              <button
                onClick={() =>
                  router.push(
                    "/admin/vehicles/create"
                  )
                }
                className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
              >
                + Add Your First Vehicle
              </button>

            </div>

          ) : (

            /* Table */
            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[700px] text-left">

                <thead>
                  <tr className="border-b bg-gray-50">

                    <th className="px-4 py-3 text-sm font-semibold">
                      Vehicle Number
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Type
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Capacity
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {vehicles.map(
                    (vehicle) => (

                      <tr
                        key={vehicle.id}
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="px-4 py-3 font-medium">
                          {
                            vehicle.vehicleNumber
                          }
                        </td>

                        <td className="px-4 py-3">
                          {
                            vehicle.vehicleType
                          }
                        </td>

                        <td className="px-4 py-3">
                          {vehicle.capacity} kg
                        </td>

                        <td className="px-4 py-3">

                          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                            {
                              vehicle.status
                            }
                          </span>

                        </td>

                        <td className="px-4 py-3">

                          <button
                            onClick={() =>
                              handleDeleteVehicle(
                                vehicle.id
                              )
                            }
                            className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>
    </main>
  );
}

/* Status Card */

function StatusCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}