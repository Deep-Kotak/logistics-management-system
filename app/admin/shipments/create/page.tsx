"use client";

import { Suspense, useEffect, useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

function CreateShipmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState("");

  const [shipmentNumber, setShipmentNumber] =
    useState("");

  const [customerName, setCustomerName] =
    useState("");

  const [source, setSource] =
    useState("");

  const [destination, setDestination] =
    useState("");

  const [userId, setUserId] =
    useState("");

  const [loadingOrder, setLoadingOrder] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH ORDER
  // ==========================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const parameter =
          searchParams.get("orderId");

        console.log(
          "Order ID from URL:",
          parameter
        );

        if (!parameter) {
          setError(
            "Order ID is missing from the URL."
          );

          return;
        }

        const cleanOrderId =
          decodeURIComponent(
            parameter
          ).trim();

        console.log(
          "Clean Order ID:",
          cleanOrderId
        );

        setOrderId(cleanOrderId);

        // Get order document
        const orderRef = doc(
          db,
          "orders",
          cleanOrderId
        );

        console.log(
          "Looking for:",
          `orders/${cleanOrderId}`
        );

        const orderSnapshot =
          await getDoc(orderRef);

        console.log(
          "Document exists:",
          orderSnapshot.exists()
        );

        if (!orderSnapshot.exists()) {
          setError(
            `Order not found: ${cleanOrderId}`
          );

          return;
        }

        // Get order data ONLY ONCE
        const orderData =
          orderSnapshot.data();

        console.log(
          "FOUND ORDER:",
          orderData
        );

        // Set order information
        setCustomerName(
          orderData.customerName || ""
        );

        setSource(
          orderData.source || ""
        );

        setDestination(
          orderData.destination || ""
        );

        setUserId(
          orderData.userId || ""
        );

      } catch (error) {
        console.error(
          "Error fetching order:",
          error
        );

        setError(
          "Failed to load order."
        );
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [searchParams]);

  // ==========================================
  // CREATE SHIPMENT
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!orderId) {
      setError(
        "Order ID is missing."
      );

      return;
    }

    setLoading(true);

    try {
      await addDoc(
        collection(db, "shipments"),
        {
          shipmentNumber,

          orderId,

          userId,

          customerName,

          source,

          destination,

          status: "Pending",

          vehicleId: "",

          vehicleNumber: "",

          driverId: "",

          driverName: "",

          createdAt:
            serverTimestamp(),
        }
      );

      alert(
        "Shipment created successfully!"
      );

      router.push(
        "/admin/shipments"
      );

    } catch (error) {
      console.error(
        "Create shipment error:",
        error
      );

      setError(
        "Failed to create shipment."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-3xl">

        {/* Back */}

        <button
          onClick={() =>
            router.push(
              "/admin/shipments"
            )
          }
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back to Shipments
        </button>

        {/* Heading */}

        <h1 className="mt-4 text-3xl font-bold">
          Create Shipment
        </h1>

        <p className="mt-1 text-gray-500">
          Create a shipment for an order
        </p>

        <div className="mt-6 rounded-xl bg-white p-6 shadow">

          {loadingOrder ? (

            <div className="py-8 text-center">

              <p className="text-gray-500">
                Loading order information...
              </p>

            </div>

          ) : error ? (

            <div className="rounded-lg bg-red-50 p-4">

              <p className="text-sm text-red-600">
                {error}
              </p>

              <button
                onClick={() =>
                  router.push(
                    "/admin/orders"
                  )
                }
                className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white"
              >
                Back to Orders
              </button>

            </div>

          ) : (

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Order ID */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Order ID
                </label>

                <input
                  type="text"
                  value={orderId}
                  readOnly
                  className="w-full rounded-lg border bg-gray-100 p-3 text-gray-600"
                />
              </div>

              {/* Shipment Number */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Shipment Number
                </label>

                <input
                  type="text"
                  value={shipmentNumber}
                  onChange={(e) =>
                    setShipmentNumber(
                      e.target.value
                    )
                  }
                  placeholder="SHP-001"
                  required
                  className="w-full rounded-lg border p-3"
                />
              </div>

              {/* Customer */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Customer Name
                </label>

                <input
                  type="text"
                  value={customerName}
                  readOnly
                  className="w-full rounded-lg border bg-gray-100 p-3"
                />
              </div>

              {/* Source */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Source
                </label>

                <input
                  type="text"
                  value={source}
                  readOnly
                  className="w-full rounded-lg border bg-gray-100 p-3"
                />
              </div>

              {/* Destination */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Destination
                </label>

                <input
                  type="text"
                  value={destination}
                  readOnly
                  className="w-full rounded-lg border bg-gray-100 p-3"
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
                  ? "Creating Shipment..."
                  : "Create Shipment"}
              </button>

            </form>

          )}

        </div>
      </div>
    </main>
  );
}

// ==========================================
// SUSPENSE
// ==========================================

export default function CreateShipmentPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-100">
          <p className="text-gray-500">
            Loading shipment page...
          </p>
        </main>
      }
    >
      <CreateShipmentForm />
    </Suspense>
  );
}