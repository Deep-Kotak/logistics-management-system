"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  useParams,
  useRouter,
} from "next/navigation";

// ==========================================
// ORDER TYPE
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

// ==========================================
// SHIPMENT TYPE
// ==========================================

type Shipment = {
  id: string;
  shipmentNumber: string;
  status: string;
  vehicleNumber: string;
  driverName: string;
};

// ==========================================
// PAGE
// ==========================================

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const orderId = params.id as string;

  const [order, setOrder] =
    useState<Order | null>(null);

  const [shipment, setShipment] =
    useState<Shipment | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH ORDER + SHIPMENT
  // ==========================================

  useEffect(() => {
    const fetchOrderAndShipment =
      async () => {
        try {
          if (!orderId) {
            setError(
              "Order ID is missing."
            );
            return;
          }

          // ====================================
          // FETCH ORDER
          // ====================================

          const orderRef = doc(
            db,
            "orders",
            orderId
          );

          const orderSnapshot =
            await getDoc(orderRef);

          if (!orderSnapshot.exists()) {
            setError(
              "Order not found."
            );
            return;
          }

          const orderData =
            orderSnapshot.data();

          setOrder({
            id: orderSnapshot.id,

            customerName:
              orderData.customerName || "",

            customerEmail:
              orderData.customerEmail || "",

            productName:
              orderData.productName || "",

            quantity:
              orderData.quantity || 0,

            source:
              orderData.source || "",

            destination:
              orderData.destination || "",

            status:
              orderData.status || "Pending",
          });

          // ====================================
          // FETCH SHIPMENT
          // ====================================

          const shipmentQuery =
            query(
              collection(
                db,
                "shipments"
              ),
              where(
                "orderId",
                "==",
                orderId
              )
            );

          const shipmentSnapshot =
            await getDocs(
              shipmentQuery
            );

          if (
            !shipmentSnapshot.empty
          ) {
            const shipmentDoc =
              shipmentSnapshot.docs[0];

            const shipmentData =
              shipmentDoc.data();

            setShipment({
              id: shipmentDoc.id,

              shipmentNumber:
                shipmentData.shipmentNumber ||
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
            });
          } else {
            setShipment(null);
          }
        } catch (error) {
          console.error(
            "Error fetching order and shipment:",
            error
          );

          setError(
            "Failed to load order details."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchOrderAndShipment();
  }, [orderId]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          Loading order...
        </p>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">

        <div className="mx-auto max-w-4xl">

          <button
            onClick={() =>
              router.push(
                "/admin/orders"
              )
            }
            className="text-sm text-gray-600 hover:underline"
          >
            ← Back to Orders
          </button>

          <div className="mt-6 rounded-xl bg-white p-6 shadow">

            <p className="text-red-500">
              {error ||
                "Order not found."}
            </p>

          </div>

        </div>

      </main>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-4xl">

        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <button
          onClick={() =>
            router.push(
              "/admin/orders"
            )
          }
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Orders
        </button>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Order Details
            </h1>

            <p className="mt-1 text-gray-500">
              View complete order information
            </p>

          </div>

          <span className="w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
            {order.status}
          </span>

        </div>

        {/* ================================= */}
        {/* ORDER INFORMATION */}
        {/* ================================= */}

        <div className="mt-6 rounded-xl bg-white p-6 shadow">

          <h2 className="text-xl font-semibold">
            Order Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <InfoItem
              label="Order ID"
              value={order.id}
            />

            <InfoItem
              label="Status"
              value={order.status}
            />

            <InfoItem
              label="Customer Name"
              value={
                order.customerName ||
                "Not Available"
              }
            />

            <InfoItem
              label="Customer Email"
              value={
                order.customerEmail ||
                "Not Available"
              }
            />

            <InfoItem
              label="Product"
              value={
                order.productName ||
                "Not Available"
              }
            />

            <InfoItem
              label="Quantity"
              value={String(
                order.quantity
              )}
            />

            <InfoItem
              label="Source"
              value={
                order.source ||
                "Not Available"
              }
            />

            <InfoItem
              label="Destination"
              value={
                order.destination ||
                "Not Available"
              }
            />

          </div>

          {/* ================================= */}
          {/* ROUTE */}
          {/* ================================= */}

          <div className="mt-8 border-t pt-6">

            <h2 className="text-xl font-semibold">
              Delivery Route
            </h2>

            <div className="mt-4 rounded-lg bg-gray-50 p-5">

              <p className="text-sm text-gray-500">
                Route
              </p>

              <p className="mt-2 text-lg font-semibold">
                {order.source}
                {" → "}
                {order.destination}
              </p>

            </div>

          </div>

          {/* ================================= */}
          {/* SHIPMENT TRACKING */}
          {/* ================================= */}

          <div className="mt-8 border-t pt-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  Shipment Tracking
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Shipment information for this order
                </p>

              </div>

            </div>

            {shipment ? (

              <div className="mt-5 rounded-xl border bg-gray-50 p-5">

                <div className="grid gap-5 sm:grid-cols-2">

                  <InfoItem
                    label="Shipment Number"
                    value={
                      shipment.shipmentNumber ||
                      "Not Available"
                    }
                  />

                  <InfoItem
                    label="Shipment Status"
                    value={
                      shipment.status ||
                      "Pending"
                    }
                  />

                  <InfoItem
                    label="Vehicle"
                    value={
                      shipment.vehicleNumber ||
                      "Not Assigned"
                    }
                  />

                  <InfoItem
                    label="Driver"
                    value={
                      shipment.driverName ||
                      "Not Assigned"
                    }
                  />

                </div>

                {/* View Shipment */}

                <button
                  onClick={() =>
                    router.push(
                      `/admin/shipments/${shipment.id}`
                    )
                  }
                  className="mt-5 rounded-lg bg-black px-5 py-2 text-sm text-white hover:bg-gray-800"
                >
                  View Shipment Details
                </button>

              </div>

            ) : (

              <div className="mt-5 rounded-lg border border-dashed p-6 text-center">

                <p className="text-gray-500">
                  No shipment has been created for this order yet.
                </p>

                <button
                  onClick={() =>
                    router.push(
                      `/admin/shipments/create?orderId=${order.id}`
                    )
                  }
                  className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                  Create Shipment
                </button>

              </div>

            )}

          </div>

          {/* ================================= */}
          {/* ACTIONS */}
          {/* ================================= */}

          <div className="mt-8 flex gap-3 border-t pt-6">

            <button
              onClick={() =>
                router.push(
                  `/admin/orders/${order.id}/edit`
                )
              }
              className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
            >
              Edit Order
            </button>

            <button
              onClick={() =>
                router.push(
                  "/admin/orders"
                )
              }
              className="rounded-lg border px-5 py-2 hover:bg-gray-50"
            >
              Back to Orders
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}

// ==========================================
// INFO ITEM
// ==========================================

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">

      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-all font-medium">
        {value}
      </p>

    </div>
  );
}