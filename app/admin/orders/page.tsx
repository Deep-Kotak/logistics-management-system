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

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc")
        );

        const snapshot =
          await getDocs(ordersQuery);

        const orderData: Order[] =
          snapshot.docs.map((orderDoc) => {
            const data =
              orderDoc.data();

            return {
              id: orderDoc.id,

              customerName:
                data.customerName || "",

              customerEmail:
                data.customerEmail || "",

              productName:
                data.productName || "",

              quantity:
                data.quantity || 0,

              source:
                data.source || "",

              destination:
                data.destination || "",

              status:
                data.status || "Pending",
            };
          });

        setOrders(orderData);
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
              Order Management
            </h1>

            <p className="mt-1 text-gray-500">
              Manage and track customer orders
            </p>

          </div>

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

        </header>

        {/* STATISTICS */}

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatusCard
            title="Total Orders"
            value={orders.length}
          />

          <StatusCard
            title="Pending"
            value={
              orders.filter(
                (order) =>
                  order.status ===
                  "Pending"
              ).length
            }
          />

          <StatusCard
            title="In Transit"
            value={
              orders.filter(
                (order) =>
                  order.status ===
                    "In Transit" ||
                  order.status ===
                    "Picked Up"
              ).length
            }
          />

          <StatusCard
            title="Delivered"
            value={
              orders.filter(
                (order) =>
                  order.status ===
                  "Delivered"
              ).length
            }
          />

        </section>

        {/* ORDER TABLE */}

        <section className="mt-8 rounded-xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              All Orders
            </h2>

            <span className="text-sm text-gray-500">
              {orders.length} orders
            </span>

          </div>

          {loading ? (

            <p className="mt-6 text-gray-500">
              Loading orders...
            </p>

          ) : orders.length === 0 ? (

            <div className="mt-6 rounded-lg border border-dashed p-8 text-center">

              <p className="text-gray-500">
                No orders available.
              </p>

              <button
                onClick={() =>
                  router.push(
                    "/admin/orders/create"
                  )
                }
                className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white"
              >
                Create First Order
              </button>

            </div>

          ) : (

            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[1200px] text-left">

                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="px-4 py-3">
                      Order ID
                    </th>

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

                        {/* ORDER ID */}

                        <td className="px-4 py-3">

                          <p className="font-medium">
                            {order.id}
                          </p>

                        </td>

                        {/* CUSTOMER */}

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

                        {/* PRODUCT */}

                        <td className="px-4 py-3">
                          {
                            order.productName
                          }
                        </td>

                        {/* QUANTITY */}

                        <td className="px-4 py-3">
                          {order.quantity}
                        </td>

                        {/* ROUTE */}

                        <td className="px-4 py-3">
                          {order.source}
                          {" → "}
                          {order.destination}
                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-3">

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                            {order.status}
                          </span>

                        </td>

                        {/* ACTIONS */}

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
                                  `/admin/orders/${order.id}/edit`
                                )
                              }
                              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                            >
                              Edit
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