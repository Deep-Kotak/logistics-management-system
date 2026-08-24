"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type Driver = {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  status: string;
};

export default function DriversPage() {
  const router = useRouter();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driversQuery = query(
          collection(db, "drivers"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(
          driversQuery
        );

        const driverData: Driver[] =
          snapshot.docs.map((driverDoc) => {
            const data = driverDoc.data();

            return {
              id: driverDoc.id,
              name: data.name || "",
              phone: data.phone || "",
              licenseNumber:
                data.licenseNumber || "",
              status:
                data.status || "Available",
            };
          });

        setDrivers(driverData);
      } catch (error) {
        console.error(
          "Error fetching drivers:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Update driver status
  const handleStatusChange = async (
    driverId: string,
    newStatus: string
  ) => {
    try {
      await updateDoc(
        doc(db, "drivers", driverId),
        {
          status: newStatus,
        }
      );

      setDrivers((currentDrivers) =>
        currentDrivers.map((driver) =>
          driver.id === driverId
            ? {
                ...driver,
                status: newStatus,
              }
            : driver
        )
      );
    } catch (error) {
      console.error(
        "Error updating driver status:",
        error
      );

      alert(
        "Failed to update driver status."
      );
    }
  };

  // Delete driver
  const handleDeleteDriver = async (
    driverId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this driver?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "drivers", driverId)
      );

      setDrivers((currentDrivers) =>
        currentDrivers.filter(
          (driver) =>
            driver.id !== driverId
        )
      );
    } catch (error) {
      console.error(
        "Error deleting driver:",
        error
      );

      alert("Failed to delete driver.");
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
              Driver Management
            </h1>

            <p className="mt-1 text-gray-500">
              Manage delivery drivers
            </p>
          </div>

          <button
            onClick={() =>
              router.push(
                "/admin/drivers/create"
              )
            }
            className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
          >
            + Add Driver
          </button>

        </header>

        {/* Statistics */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatusCard
            title="Total Drivers"
            value={drivers.length}
          />

          <StatusCard
            title="Available"
            value={
              drivers.filter(
                (driver) =>
                  driver.status ===
                  "Available"
              ).length
            }
          />

          <StatusCard
            title="Assigned"
            value={
              drivers.filter(
                (driver) =>
                  driver.status ===
                  "Assigned"
              ).length
            }
          />

          <StatusCard
            title="On Duty"
            value={
              drivers.filter(
                (driver) =>
                  driver.status ===
                  "On Duty"
              ).length
            }
          />

        </section>

        {/* Driver List */}
        <section className="mt-8 rounded-xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                All Drivers
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your delivery drivers
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {drivers.length} drivers
            </span>

          </div>

          {loading ? (
            <p className="mt-6 text-gray-500">
              Loading drivers...
            </p>
          ) : drivers.length === 0 ? (

            <div className="mt-6 rounded-lg border border-dashed p-8 text-center">

              <p className="text-gray-500">
                No drivers available.
              </p>

              <button
                onClick={() =>
                  router.push(
                    "/admin/drivers/create"
                  )
                }
                className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
              >
                + Add Your First Driver
              </button>

            </div>

          ) : (

            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[800px] text-left">

                <thead>
                  <tr className="border-b bg-gray-50">

                    <th className="px-4 py-3 text-sm font-semibold">
                      Name
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Phone
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      License Number
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

                  {drivers.map(
                    (driver) => (

                      <tr
                        key={driver.id}
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="px-4 py-3 font-medium">
                          {driver.name}
                        </td>

                        <td className="px-4 py-3">
                          {driver.phone}
                        </td>

                        <td className="px-4 py-3">
                          {
                            driver.licenseNumber
                          }
                        </td>

                        <td className="px-4 py-3">

                          <select
                            value={driver.status}
                            onChange={(e) =>
                              handleStatusChange(
                                driver.id,
                                e.target.value
                              )
                            }
                            className="rounded-lg border px-3 py-2 text-sm"
                          >

                            <option value="Available">
                              Available
                            </option>

                            <option value="Assigned">
                              Assigned
                            </option>

                            <option value="On Duty">
                              On Duty
                            </option>

                            <option value="Inactive">
                              Inactive
                            </option>

                          </select>

                        </td>

                        <td className="px-4 py-3">

                          <button
                            onClick={() =>
                              handleDeleteDriver(
                                driver.id
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