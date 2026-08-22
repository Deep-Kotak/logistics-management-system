"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
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

export default function AdminDashboard() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(ordersQuery);

        const orderData: Order[] = snapshot.docs.map((orderDoc) => {
          const data = orderDoc.data();

          return {
            id: orderDoc.id,
            customerName: data.customerName || "",
            customerEmail: data.customerEmail || "",
            productName: data.productName || "",
            quantity: data.quantity || 0,
            source: data.source || "",
            destination: data.destination || "",
            status: data.status || "Pending",
          };
        });

        setOrders(orderData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  // Update Order Status
  const handleStatusChange = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
      });

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);

      alert("Failed to update order status.");
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteDoc(doc(db, "orders", orderId));

      setOrders((currentOrders) =>
        currentOrders.filter(
          (order) => order.id !== orderId
        )
      );
    } catch (error) {
      console.error("Error deleting order:", error);

      alert("Failed to delete order.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
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

            {/* Create Order */}
            <button
              onClick={() =>
                router.push("/admin/orders/create")
              }
              className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
            >
              + Create Order
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-5 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>

          </div>
        </header>

        {/* Dashboard Cards */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <DashboardCard
            title="Total Orders"
            value={orders.length.toString()}
          />

          <DashboardCard
            title="Pending Shipments"
            value={orders.filter(
              (order) => order.status === "Pending"
            ).length.toString()}
          />

          <DashboardCard
            title="In Transit"
            value={orders.filter(
              (order) =>
                order.status === "Processing" ||
                order.status === "Shipped"
            ).length.toString()}
          />

          <DashboardCard
            title="Delivered"
            value={orders.filter(
              (order) => order.status === "Delivered"
            ).length.toString()}
          />

          <DashboardCard
            title="Available Vehicles"
            value="0"
          />

          <DashboardCard
            title="Warehouse Stock"
            value="0"
          />

        </section>

        {/* Orders */}
        <section className="mt-8 rounded-xl bg-white p-6 shadow">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage all customer orders
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {orders.length} orders
            </span>

          </div>

          {/* Loading */}
          {loadingOrders ? (
            <p className="mt-6 text-gray-500">
              Loading orders...
            </p>
          ) : orders.length === 0 ? (

            /* Empty */
            <p className="mt-6 text-gray-500">
              No orders available yet.
            </p>

          ) : (

            /* Orders Table */
            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[900px] text-left">

                <thead>
                  <tr className="border-b bg-gray-50">

                    <th className="px-4 py-3 text-sm font-semibold">
                      Customer
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Product
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Quantity
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Source
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold">
                      Destination
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

                  {orders.map((order) => (

                    <tr
                      key={order.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">
                            {order.customerName}
                          </p>

                          <p className="text-xs text-gray-500">
                            {order.customerEmail}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {order.productName}
                      </td>

                      <td className="px-4 py-3">
                        {order.quantity}
                      </td>

                      <td className="px-4 py-3">
                        {order.source}
                      </td>

                      <td className="px-4 py-3">
                        {order.destination}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">

                        <select
                          value={order.status}
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

                          <option value="Shipped">
                            Shipped
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>
                        </select>

                      </td>

                      {/* Delete */}
                      <td className="px-4 py-3">

                        <button
                          onClick={() =>
                            handleDeleteOrder(order.id)
                          }
                          className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </div>
    </main>
  );
}

/* Dashboard Card */

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