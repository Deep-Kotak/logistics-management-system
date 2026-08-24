"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type Shipment = {
  id: string;
  shipmentNumber: string;
  orderId: string;
  customerName: string;
  source: string;
  destination: string;
  status: string;

  vehicleId?: string;
  vehicleNumber?: string;

  driverId?: string;
  driverName?: string;
};

type Vehicle = {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  status: string;
};

type Driver = {
  id: string;
  name: string;
  phone: string;
  status: string;
};

const shipmentStatuses = [
  "Pending",
  "Picked Up",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

export default function ShipmentsPage() {
  const router = useRouter();

  const [shipments, setShipments] = useState<Shipment[]>(
    []
  );

  const [vehicles, setVehicles] = useState<Vehicle[]>(
    []
  );

  const [drivers, setDrivers] = useState<Driver[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH SHIPMENTS
  // ==========================================

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const shipmentsQuery = query(
          collection(db, "shipments"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(
          shipmentsQuery
        );

        const shipmentData: Shipment[] =
          snapshot.docs.map((shipmentDoc) => {
            const data = shipmentDoc.data();

            return {
              id: shipmentDoc.id,
              shipmentNumber:
                data.shipmentNumber || "",
              orderId: data.orderId || "",
              customerName:
                data.customerName || "",
              source: data.source || "",
              destination:
                data.destination || "",
              status:
                data.status || "Pending",

              vehicleId:
                data.vehicleId || "",
              vehicleNumber:
                data.vehicleNumber || "",

              driverId:
                data.driverId || "",
              driverName:
                data.driverName || "",
            };
          });

        setShipments(shipmentData);
      } catch (error) {
        console.error(
          "Error fetching shipments:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  // ==========================================
  // FETCH VEHICLES AND DRIVERS
  // ==========================================

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Fetch Vehicles
        const vehiclesSnapshot =
          await getDocs(
            collection(db, "vehicles")
          );

        const vehicleData: Vehicle[] =
          vehiclesSnapshot.docs.map(
            (vehicleDoc) => {
              const data =
                vehicleDoc.data();

              return {
                id: vehicleDoc.id,

                vehicleNumber:
                  data.vehicleNumber || "",

                vehicleType:
                  data.vehicleType || "",

                status:
                  data.status || "Available",
              };
            }
          );

        setVehicles(vehicleData);

        // Fetch Drivers
        const driversSnapshot =
          await getDocs(
            collection(db, "drivers")
          );

        const driverData: Driver[] =
          driversSnapshot.docs.map(
            (driverDoc) => {
              const data =
                driverDoc.data();

              return {
                id: driverDoc.id,

                name:
                  data.name || "",

                phone:
                  data.phone || "",

                status:
                  data.status || "Available",
              };
            }
          );

        setDrivers(driverData);
      } catch (error) {
        console.error(
          "Error fetching vehicles/drivers:",
          error
        );
      }
    };

    fetchResources();
  }, []);

  // ==========================================
  // UPDATE SHIPMENT STATUS
  // ==========================================

  const handleStatusChange = async (
    shipmentId: string,
    newStatus: string
  ) => {
    try {
      await updateDoc(
        doc(db, "shipments", shipmentId),
        {
          status: newStatus,
        }
      );

      setShipments((currentShipments) =>
        currentShipments.map((shipment) =>
          shipment.id === shipmentId
            ? {
                ...shipment,
                status: newStatus,
              }
            : shipment
        )
      );
    } catch (error) {
      console.error(
        "Error updating shipment status:",
        error
      );

      alert(
        "Failed to update shipment status."
      );
    }
  };

  // ==========================================
  // ASSIGN VEHICLE
  // ==========================================

  const handleVehicleChange = async (
    shipmentId: string,
    vehicleId: string
  ) => {
    try {
      const selectedVehicle =
        vehicles.find(
          (vehicle) =>
            vehicle.id === vehicleId
        );

      if (!selectedVehicle) {
        return;
      }

      // Update shipment
      await updateDoc(
        doc(db, "shipments", shipmentId),
        {
          vehicleId:
            selectedVehicle.id,

          vehicleNumber:
            selectedVehicle.vehicleNumber,
        }
      );

      // Update vehicle status
      await updateDoc(
        doc(
          db,
          "vehicles",
          selectedVehicle.id
        ),
        {
          status: "Assigned",
        }
      );

      // Update local shipment
      setShipments((currentShipments) =>
        currentShipments.map((shipment) =>
          shipment.id === shipmentId
            ? {
                ...shipment,

                vehicleId:
                  selectedVehicle.id,

                vehicleNumber:
                  selectedVehicle.vehicleNumber,
              }
            : shipment
        )
      );

      // Update local vehicle
      setVehicles((currentVehicles) =>
        currentVehicles.map((vehicle) =>
          vehicle.id ===
          selectedVehicle.id
            ? {
                ...vehicle,
                status: "Assigned",
              }
            : vehicle
        )
      );

      alert(
        `Vehicle ${selectedVehicle.vehicleNumber} assigned successfully!`
      );
    } catch (error) {
      console.error(
        "Error assigning vehicle:",
        error
      );

      alert(
        "Failed to assign vehicle."
      );
    }
  };

  // ==========================================
  // ASSIGN DRIVER
  // ==========================================

  const handleDriverChange = async (
    shipmentId: string,
    driverId: string
  ) => {
    try {
      const selectedDriver =
        drivers.find(
          (driver) =>
            driver.id === driverId
        );

      if (!selectedDriver) {
        return;
      }

      // Update shipment
      await updateDoc(
        doc(db, "shipments", shipmentId),
        {
          driverId:
            selectedDriver.id,

          driverName:
            selectedDriver.name,
        }
      );

      // Update driver status
      await updateDoc(
        doc(
          db,
          "drivers",
          selectedDriver.id
        ),
        {
          status: "Assigned",
        }
      );

      // Update local shipment
      setShipments((currentShipments) =>
        currentShipments.map((shipment) =>
          shipment.id === shipmentId
            ? {
                ...shipment,

                driverId:
                  selectedDriver.id,

                driverName:
                  selectedDriver.name,
              }
            : shipment
        )
      );

      // Update local driver
      setDrivers((currentDrivers) =>
        currentDrivers.map((driver) =>
          driver.id ===
          selectedDriver.id
            ? {
                ...driver,
                status: "Assigned",
              }
            : driver
        )
      );

      alert(
        `Driver ${selectedDriver.name} assigned successfully!`
      );
    } catch (error) {
      console.error(
        "Error assigning driver:",
        error
      );

      alert(
        "Failed to assign driver."
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
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
              Shipment Management
            </h1>

            <p className="mt-1 text-gray-500">
              Manage and track shipments
            </p>
          </div>

          <button
            onClick={() =>
              router.push(
                "/admin/shipments/create"
              )
            }
            className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
          >
            + Create Shipment
          </button>

        </header>

        {/* STATISTICS */}

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatusCard
            title="Total Shipments"
            value={shipments.length}
          />

          <StatusCard
            title="Pending"
            value={
              shipments.filter(
                (shipment) =>
                  shipment.status ===
                  "Pending"
              ).length
            }
          />

          <StatusCard
            title="In Transit"
            value={
              shipments.filter(
                (shipment) =>
                  shipment.status ===
                  "In Transit"
              ).length
            }
          />

          <StatusCard
            title="Delivered"
            value={
              shipments.filter(
                (shipment) =>
                  shipment.status ===
                  "Delivered"
              ).length
            }
          />

        </section>

        {/* SHIPMENT TABLE */}

        <section className="mt-8 rounded-xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              All Shipments
            </h2>

            <span className="text-sm text-gray-500">
              {shipments.length} shipments
            </span>

          </div>

          {loading ? (
            <p className="mt-6 text-gray-500">
              Loading shipments...
            </p>
          ) : shipments.length === 0 ? (
            <p className="mt-6 text-gray-500">
              No shipments available.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[1200px] text-left">

                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="px-4 py-3">
                      Shipment
                    </th>

                    <th className="px-4 py-3">
                      Customer
                    </th>

                    <th className="px-4 py-3">
                      Source
                    </th>

                    <th className="px-4 py-3">
                      Destination
                    </th>

                    <th className="px-4 py-3">
                      Vehicle
                    </th>

                    <th className="px-4 py-3">
                      Driver
                    </th>

                    <th className="px-4 py-3">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {shipments.map(
                    (shipment) => (

                      <tr
                        key={shipment.id}
                        className="border-b hover:bg-gray-50"
                      >

                        {/* Shipment */}

                        <td className="px-4 py-3">

                          <p className="font-medium">
                            {
                              shipment.shipmentNumber
                            }
                          </p>

                          <p className="text-xs text-gray-500">
                            Order:{" "}
                            {
                              shipment.orderId
                            }
                          </p>

                        </td>

                        {/* Customer */}

                        <td className="px-4 py-3">
                          {
                            shipment.customerName
                          }
                        </td>

                        {/* Source */}

                        <td className="px-4 py-3">
                          {shipment.source}
                        </td>

                        {/* Destination */}

                        <td className="px-4 py-3">
                          {
                            shipment.destination
                          }
                        </td>

                        {/* Vehicle */}

                        <td className="px-4 py-3">

                          <select
                            value={
                              shipment.vehicleId ||
                              ""
                            }
                            onChange={(e) =>
                              handleVehicleChange(
                                shipment.id,
                                e.target.value
                              )
                            }
                            className="rounded-lg border px-3 py-2 text-sm"
                          >

                            <option value="">
                              Select Vehicle
                            </option>

                            {vehicles
                              .filter(
                                (vehicle) =>
                                  vehicle.status ===
                                    "Available" ||
                                  vehicle.id ===
                                    shipment.vehicleId
                              )
                              .map(
                                (vehicle) => (
                                  <option
                                    key={
                                      vehicle.id
                                    }
                                    value={
                                      vehicle.id
                                    }
                                  >
                                    {
                                      vehicle.vehicleNumber
                                    }
                                  </option>
                                )
                              )}

                          </select>

                        </td>

                        {/* Driver */}

                        <td className="px-4 py-3">

                          <select
                            value={
                              shipment.driverId ||
                              ""
                            }
                            onChange={(e) =>
                              handleDriverChange(
                                shipment.id,
                                e.target.value
                              )
                            }
                            className="rounded-lg border px-3 py-2 text-sm"
                          >

                            <option value="">
                              Select Driver
                            </option>

                            {drivers
                              .filter(
                                (driver) =>
                                  driver.status ===
                                    "Available" ||
                                  driver.id ===
                                    shipment.driverId
                              )
                              .map(
                                (driver) => (
                                  <option
                                    key={
                                      driver.id
                                    }
                                    value={
                                      driver.id
                                    }
                                  >
                                    {
                                      driver.name
                                    }
                                  </option>
                                )
                              )}

                          </select>

                        </td>

                        {/* Status */}

                        <td className="px-4 py-3">

                          <select
                            value={
                              shipment.status
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                shipment.id,
                                e.target.value
                              )
                            }
                            className="rounded-lg border px-3 py-2 text-sm"
                          >

                            {shipmentStatuses.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>
                              )
                            )}

                          </select>

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

// ==========================================
// STATUS CARD
// ==========================================

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