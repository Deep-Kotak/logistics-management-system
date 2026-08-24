"use client";

import { useEffect, useState } from "react";

import {
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

import { useRouter } from "next/navigation";

// ==========================================
// TYPES
// ==========================================

type Order = {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  source: string;
  destination: string;
  status: string;
};

type Shipment = {
  id: string;
  status: string;
};

type Vehicle = {
  id: string;
  status: string;
};

type Driver = {
  id: string;
  status: string;
};

// ==========================================
// ADMIN DASHBOARD
// ==========================================

export default function AdminDashboard() {
  const router = useRouter();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [shipments, setShipments] =
    useState<Shipment[]>([]);

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [drivers, setDrivers] =
    useState<Driver[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    await signOut(auth);

    router.push("/login");
  };

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

useEffect(() => {
  const unsubscribe = onAuthStateChanged(
    auth,
    async (user) => {
      // =====================================
      // USER NOT LOGGED IN
      // =====================================

      if (!user) {
        router.push("/login");
        return;
      }

      // =====================================
      // USER LOGGED IN
      // =====================================

      console.log(
        "Admin user logged in:",
        user.email
      );

      const fetchDashboardData =
        async () => {
          try {
            // =================================
            // ORDERS
            // =================================

            const ordersQuery = query(
              collection(db, "orders"),
              orderBy(
                "createdAt",
                "desc"
              )
            );

            const ordersSnapshot =
              await getDocs(
                ordersQuery
              );

            const orderData: Order[] =
              ordersSnapshot.docs.map(
                (orderDoc) => {
                  const data =
                    orderDoc.data();

                  return {
                    id: orderDoc.id,

                    customerName:
                      data.customerName ||
                      "",

                    customerEmail:
                      data.customerEmail ||
                      "",

                    productName:
                      data.productName ||
                      "",

                    quantity:
                      data.quantity || 0,

                    source:
                      data.source || "",

                    destination:
                      data.destination ||
                      "",

                    status:
                      data.status ||
                      "Pending",
                  };
                }
              );

            setOrders(orderData);

            // =================================
            // SHIPMENTS
            // =================================

            const shipmentsSnapshot =
              await getDocs(
                collection(
                  db,
                  "shipments"
                )
              );

            const shipmentData:
              Shipment[] =
              shipmentsSnapshot.docs.map(
                (shipmentDoc) => {
                  const data =
                    shipmentDoc.data();

                  return {
                    id: shipmentDoc.id,

                    status:
                      data.status ||
                      "Pending",
                  };
                }
              );

            setShipments(
              shipmentData
            );

            // =================================
            // VEHICLES
            // =================================

            const vehiclesSnapshot =
              await getDocs(
                collection(
                  db,
                  "vehicles"
                )
              );

            const vehicleData:
              Vehicle[] =
              vehiclesSnapshot.docs.map(
                (vehicleDoc) => {
                  const data =
                    vehicleDoc.data();

                  return {
                    id: vehicleDoc.id,

                    status:
                      data.status ||
                      "Available",
                  };
                }
              );

            setVehicles(
              vehicleData
            );

            // =================================
            // DRIVERS
            // =================================

            const driversSnapshot =
              await getDocs(
                collection(
                  db,
                  "drivers"
                )
              );

            const driverData:
              Driver[] =
              driversSnapshot.docs.map(
                (driverDoc) => {
                  const data =
                    driverDoc.data();

                  return {
                    id: driverDoc.id,

                    status:
                      data.status ||
                      "Available",
                  };
                }
              );

            setDrivers(
              driverData
            );
          } catch (error) {
            console.error(
              "Error fetching dashboard data:",
              error
            );
          } finally {
            setLoading(false);
          }
        };

      fetchDashboardData();
    }
  );

  // ==========================================
  // CLEANUP AUTH LISTENER
  // ==========================================

  return () => unsubscribe();

}, [router]);

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const handleStatusChange = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      await updateDoc(
        doc(db, "orders", orderId),
        {
          status: newStatus,
        }
      );

      setOrders(
        (currentOrders) =>
          currentOrders.map(
            (order) =>
              order.id === orderId
                ? {
                    ...order,
                    status: newStatus,
                  }
                : order
          )
      );
    } catch (error) {
      console.error(
        "Error updating order status:",
        error
      );

      alert(
        "Failed to update order status."
      );
    }
  };

  // ==========================================
  // DELETE ORDER
  // ==========================================

  const handleDeleteOrder = async (
    orderId: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this order?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "orders", orderId)
      );

      setOrders(
        (currentOrders) =>
          currentOrders.filter(
            (order) =>
              order.id !== orderId
          )
      );

      alert(
        "Order deleted successfully."
      );
    } catch (error) {
      console.error(
        "Error deleting order:",
        error
      );

      alert(
        "Failed to delete order."
      );
    }
  };

  // ==========================================
  // DASHBOARD COUNTS
  // ==========================================

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === "Pending"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;

  const inTransitShipments =
    shipments.filter(
      (shipment) =>
        shipment.status ===
          "In Transit" ||
        shipment.status ===
          "Picked Up" ||
        shipment.status ===
          "Out for Delivery"
    ).length;

  const deliveredShipments =
    shipments.filter(
      (shipment) =>
        shipment.status ===
        "Delivered"
    ).length;

  const availableVehicles =
    vehicles.filter(
      (vehicle) =>
        vehicle.status ===
        "Available"
    ).length;

  const availableDrivers =
    drivers.filter(
      (driver) =>
        driver.status ===
        "Available"
    ).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-7xl">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Admin Panel
            </p>

            <h1 className="text-3xl font-bold">
              Logistics Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage orders and logistics operations
            </p>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              onClick={() =>
                router.push(
                  "/admin/orders/create"
                )
              }
              className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
            >
              + Create Order
            </button>

            <button
              onClick={() =>
                router.push(
                  "/admin/orders"
                )
              }
              className="rounded-lg border bg-white px-5 py-2 hover:bg-gray-50"
            >
              Orders
            </button>

            <button
              onClick={() =>
                router.push(
                  "/admin/shipments"
                )
              }
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Shipments
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-5 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>

          </div>

        </header>

        {/* ================================= */}
        {/* DASHBOARD CARDS */}
        {/* ================================= */}

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <DashboardCard
            title="Total Orders"
            value={
              loading
                ? "..."
                : orders.length.toString()
            }
          />

          <DashboardCard
            title="Total Shipments"
            value={
              loading
                ? "..."
                : shipments.length.toString()
            }
          />

          <DashboardCard
            title="Available Vehicles"
            value={
              loading
                ? "..."
                : availableVehicles.toString()
            }
          />

          <DashboardCard
            title="Available Drivers"
            value={
              loading
                ? "..."
                : availableDrivers.toString()
            }
          />

          <DashboardCard
            title="Pending Orders"
            value={
              loading
                ? "..."
                : pendingOrders.toString()
            }
          />

          <DashboardCard
            title="In Transit"
            value={
              loading
                ? "..."
                : inTransitShipments.toString()
            }
          />

          <DashboardCard
            title="Delivered Orders"
            value={
              loading
                ? "..."
                : deliveredOrders.toString()
            }
          />

          <DashboardCard
            title="Delivered Shipments"
            value={
              loading
                ? "..."
                : deliveredShipments.toString()
            }
          />

        </section>

        {/* ================================= */}
        {/* QUICK NAVIGATION */}
        {/* ================================= */}

        <section className="mt-8 grid gap-5 md:grid-cols-3">

          <QuickCard
            title="Order Management"
            description="Create, edit and manage customer orders."
            button="Open Orders"
            onClick={() =>
              router.push(
                "/admin/orders"
              )
            }
          />

          <QuickCard
            title="Shipment Management"
            description="Assign vehicles, drivers and update shipment status."
            button="Open Shipments"
            onClick={() =>
              router.push(
                "/admin/shipments"
              )
            }
          />

          <QuickCard
            title="Create Order"
            description="Create a new logistics order."
            button="Create Order"
            onClick={() =>
              router.push(
                "/admin/orders/create"
              )
            }
          />

        </section>

        {/* ================================= */}
        {/* RECENT ORDERS */}
        {/* ================================= */}

        <section className="mt-8 rounded-xl bg-white p-6 shadow">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage customer orders
              </p>

            </div>

            <span className="text-sm text-gray-500">
              {orders.length} orders
            </span>

          </div>

          {loading ? (

            <p className="mt-6 text-gray-500">
              Loading dashboard...
            </p>

          ) : orders.length === 0 ? (

            <p className="mt-6 text-gray-500">
              No orders available yet.
            </p>

          ) : (

            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[1000px] text-left">

                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="px-4 py-3">
                      Customer
                    </th>

                    <th className="px-4 py-3">
                      Product
                    </th>

                    <th className="px-4 py-3">
                      Quantity
                    </th>

                    <th className="px-4 py-3">
                      Route
                    </th>

                    <th className="px-4 py-3">
                      Status
                    </th>

                    <th className="px-4 py-3">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {orders.map(
                    (order) => (

                      <tr
                        key={order.id}
                        className="border-b hover:bg-gray-50"
                      >

                        <td className="px-4 py-3">

                          <p className="font-medium">
                            {
                              order.customerName
                            }
                          </p>

                          <p className="text-xs text-gray-500">
                            {
                              order.customerEmail
                            }
                          </p>

                        </td>

                        <td className="px-4 py-3">
                          {
                            order.productName
                          }
                        </td>

                        <td className="px-4 py-3">
                          {order.quantity}
                        </td>

                        <td className="px-4 py-3">
                          {order.source}
                          {" → "}
                          {order.destination}
                        </td>

                        <td className="px-4 py-3">

                          <select
                            value={
                              order.status
                            }
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value
                              )
                            }
                            className="rounded-lg border px-3 py-2 text-sm"
                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Confirmed">
                              Confirmed
                            </option>

                            <option value="Processing">
                              Processing
                            </option>

                            <option value="Picked Up">
                              Picked Up
                            </option>

                            <option value="In Transit">
                              In Transit
                            </option>

                            <option value="Out for Delivery">
                              Out for Delivery
                            </option>

                            <option value="Shipped">
                              Shipped
                            </option>

                            <option value="Delivered">
                              Delivered
                            </option>

                          </select>

                        </td>

                        <td className="px-4 py-3">

                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/orders/${order.id}`
                                )
                              }
                              className="rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-gray-800"
                            >
                              View
                            </button>

                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/shipments/create?orderId=${order.id}`
                                )
                              }
                              className="rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
                            >
                              Shipment
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteOrder(
                                  order.id
                                )
                              }
                              className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                            >
                              Delete
                            </button>

                          </div>

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
// DASHBOARD CARD
// ==========================================

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string;
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

// ==========================================
// QUICK CARD
// ==========================================

function QuickCard({
  title,
  description,
  button,
  onClick,
}: {
  title: string;
  description: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>

      <button
        onClick={onClick}
        className="mt-5 rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
      >
        {button}
      </button>

    </div>
  );
}