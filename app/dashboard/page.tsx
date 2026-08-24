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
  where,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

import { useRouter } from "next/navigation";

// ==========================================
// SHIPMENT TYPE
// ==========================================

type Shipment = {
  id: string;
  shipmentNumber: string;
  orderId: string;
  status: string;
  vehicleNumber: string;
  driverName: string;
};

// ==========================================
// ORDER TYPE
// ==========================================

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  source: string;
  destination: string;
  status: string;
  shipment?: Shipment;
};

// ==========================================
// DASHBOARD
// ==========================================

export default function DashboardPage() {
  const router = useRouter();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [userEmail, setUserEmail] =
    useState("");

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await signOut(auth);

      router.push("/login");
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  // ==========================================
  // FETCH ORDERS + SHIPMENTS
  // ==========================================

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          // =================================
          // USER NOT LOGGED IN
          // =================================

          if (!user) {
            router.replace("/login");
            return;
          }

          setUserEmail(
            user.email || ""
          );

          try {
            // =================================
            // 1. GET USER ORDERS
            // =================================

            const ordersQuery =
              query(
                collection(
                  db,
                  "orders"
                ),
                where(
                  "userId",
                  "==",
                  user.uid
                )
              );

            const ordersSnapshot =
              await getDocs(
                ordersQuery
              );

            console.log(
              "User UID:",
              user.uid
            );

            console.log(
              "Orders found:",
              ordersSnapshot.size
            );

            // =================================
            // 2. CREATE ORDER DATA
            // =================================

            const orderData: Order[] =
              [];

            // =================================
            // 3. PROCESS EACH ORDER
            // =================================

            for (
              const orderDoc of
                ordersSnapshot.docs
            ) {
              const data =
                orderDoc.data();

              const order: Order = {
                id: orderDoc.id,

                orderNumber:
                  data.orderNumber ||
                  orderDoc.id,

                customerName:
                  data.customerName ||
                  "",

                source:
                  data.source ||
                  "",

                destination:
                  data.destination ||
                  "",

                status:
                  data.status ||
                  "Pending",
              };

              console.log(
                "Checking order:",
                orderDoc.id
              );

              // =================================
              // 4. FIND USER'S SHIPMENT
              // =================================

const shipmentsQuery = query(
  collection(db, "shipments"),
  where("orderId", "==", order.id),
  where("userId", "==", user.uid)
);

const shipmentSnapshot = await getDocs(
  shipmentsQuery
);

              console.log(
                "Shipments for order",
                orderDoc.id,
                ":",
                shipmentSnapshot.size
              );

              // =================================
              // 5. GET SHIPMENT
              // =================================

              if (
                !shipmentSnapshot.empty
              ) {
                const shipmentDoc =
                  shipmentSnapshot
                    .docs[0];

                const shipmentData =
                  shipmentDoc.data();

                console.log(
                  "FOUND SHIPMENT:",
                  shipmentData
                );

                order.shipment = {
                  id: shipmentDoc.id,

                  shipmentNumber:
                    shipmentData.shipmentNumber ||
                    "",

                  orderId:
                    shipmentData.orderId ||
                    "",

                  status:
                    shipmentData.status ||
                    "Pending",

                  vehicleNumber:
                    shipmentData.vehicleNumber ||
                    "Not Assigned",

                  driverName:
                    shipmentData.driverName ||
                    "Not Assigned",
                };
              } else {
                console.log(
                  "NO SHIPMENT FOUND FOR:",
                  orderDoc.id
                );
              }

              orderData.push(order);
            }

            // =================================
            // 6. SET ORDERS
            // =================================

            setOrders(orderData);

          } catch (error) {
            console.error(
              "Dashboard error:",
              error
            );
          } finally {
            setLoading(false);
          }
        }
      );

    return () => unsubscribe();
  }, [router]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const activeShipments =
    orders.filter(
      (order) =>
        order.shipment &&
        order.shipment.status !==
          "Delivered"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.shipment?.status ===
          "Delivered" ||
        order.status ===
          "Delivered"
    ).length;

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="mx-auto max-w-7xl">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Logistics Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Welcome, {userEmail}
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-5 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>

        </div>

        {/* ================================= */}
        {/* STATISTICS */}
        {/* ================================= */}

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {/* TOTAL ORDERS */}

          <div className="rounded-xl bg-white p-6 shadow">

            <p className="text-gray-500">
              Total Orders
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {orders.length}
            </h2>

          </div>

          {/* ACTIVE SHIPMENTS */}

          <div className="rounded-xl bg-white p-6 shadow">

            <p className="text-gray-500">
              Active Shipments
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {activeShipments}
            </h2>

          </div>

          {/* DELIVERED */}

          <div className="rounded-xl bg-white p-6 shadow">

            <p className="text-gray-500">
              Delivered
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {deliveredOrders}
            </h2>

          </div>

        </div>

        {/* ================================= */}
        {/* MY ORDERS */}
        {/* ================================= */}

        <section className="mt-8 rounded-xl bg-white p-6 shadow">

          <div>

            <h2 className="text-xl font-semibold">
              My Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View your orders and shipment tracking
            </p>

          </div>

          {/* ================================= */}
          {/* LOADING */}
          {/* ================================= */}

          {loading ? (

            <p className="mt-6 text-gray-500">
              Loading orders...
            </p>

          ) : orders.length === 0 ? (

            /* ================================= */
            /* NO ORDERS */
            /* ================================= */

            <div className="mt-6 rounded-lg border border-dashed p-8 text-center">

              <p className="text-gray-500">
                You don't have any orders yet.
              </p>

            </div>

          ) : (

            /* ================================= */
            /* ORDERS */
            /* ================================= */

            <div className="mt-6 space-y-6">

              {orders.map(
                (order) => (

                  <div
                    key={order.id}
                    className="rounded-xl border p-6"
                  >

                    {/* ========================= */}
                    {/* ORDER HEADER */}
                    {/* ========================= */}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-sm text-gray-500">
                          Order
                        </p>

                        <h3 className="text-lg font-bold">
                          {order.orderNumber}
                        </h3>

                      </div>

                      <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-sm">
                        {order.status}
                      </span>

                    </div>

                    {/* ========================= */}
                    {/* ROUTE */}
                    {/* ========================= */}

                    <div className="mt-5">

                      <p className="text-sm text-gray-500">
                        Route
                      </p>

                      <p className="mt-1 font-medium">
                        {order.source}
                        {" → "}
                        {order.destination}
                      </p>

                    </div>

                    {/* ========================= */}
                    {/* SHIPMENT */}
                    {/* ========================= */}

                    {order.shipment ? (

                      <div className="mt-5 rounded-lg bg-gray-50 p-5">

                        <h4 className="font-semibold">
                          Shipment Tracking
                        </h4>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                          {/* SHIPMENT NUMBER */}

                          <div>

                            <p className="text-xs text-gray-500">
                              Shipment
                            </p>

                            <p className="mt-1 font-medium">
                              {
                                order.shipment
                                  .shipmentNumber
                              }
                            </p>

                          </div>

                          {/* STATUS */}

                          <div>

                            <p className="text-xs text-gray-500">
                              Status
                            </p>

                            <p className="mt-1 font-medium">
                              {
                                order.shipment
                                  .status
                              }
                            </p>

                          </div>

                          {/* VEHICLE */}

                          <div>

                            <p className="text-xs text-gray-500">
                              Vehicle
                            </p>

                            <p className="mt-1 font-medium">
                              {
                                order.shipment
                                  .vehicleNumber
                              }
                            </p>

                          </div>

                          {/* DRIVER */}

                          <div>

                            <p className="text-xs text-gray-500">
                              Driver
                            </p>

                            <p className="mt-1 font-medium">
                              {
                                order.shipment
                                  .driverName
                              }
                            </p>

                          </div>

                        </div>

                      </div>

                    ) : (

                      /* ========================= */
                      /* NO SHIPMENT */
                      /* ========================= */

                      <div className="mt-5 rounded-lg bg-yellow-50 p-4">

                        <p className="text-sm text-yellow-700">
                          Shipment has not been created yet.
                        </p>

                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}